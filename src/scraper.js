/**
 * PACalendar Web Scraper - skimming 25Live's static HTML files to build a database
 * Copyright (C) 2019 Vincent Vella
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
import axios from "axios";
import { get } from 'lodash';
import cheerio from "cheerio";
import h from "./helpers";

class Scraper {
  constructor(props) {
    this.ref = props.ref;
    this.runScraper = this.runScraper.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.killLostEvents = this.killLostEvents.bind(this);
    this.getScrapedEvents = this.getScrapedEvents.bind(this);
    this.getCurrentEvents = this.getCurrentEvents.bind(this);
    this.getPendingWebEvents = this.getPendingWebEvents.bind(this);
    this.extractListingsFromHTML = this.extractListingsFromHTML.bind(this);
  }

  extractListingsFromHTML(html, year) {
    const $ = cheerio.load(html, { xmlMode: false });
    let events = {};
    $('div.twRyoPhotoEventsItemHeader').each((i, el) => {
      events = { ...events, [i]: {} };
      events[i].timeDate = $(el).children('.twRyoPhotoEventsItemHeaderDate').text().trim(); // this is the time and date
      events[i].calendar = $(el).children('.twRyoPhotoEventsItemHeaderLocation').text().trim(); // calendar location
    });
    $('span.twRyoPhotoEventsDescription').each((i, el) => {
      events[i].title = $(el).children('a').text().trim();
    });
    $('div.twRyoPhotoEventsNotes').each((i, el) => {
      $(el).children('p').each((j, detail) => {
        if ($(detail).text() === 'More details...') {
          events[i].extraInfoLink = $(detail).children('a').attr('href');
        }
      });
      events[i].details = $(el).html();
    });
    let finalEvents = {};
    Object.keys(events).forEach((key) => {
      const event = {...events[key], year };
      const eventKey = h.toHex(year + event.timeDate + event.title);
      finalEvents = { ...finalEvents, [eventKey]: event };
    });
    return finalEvents;
  };

  async getScrapedEvents() {
    const snapshot = await this.ref.child('/ScrapedEvents').once('value');
    return snapshot.val() || {};
  }

  async getPendingWebEvents() {
    const snapshot = await this.ref.child('/Web/Events').once('value');
    return snapshot.val() || {};
  }

  async getCurrentEvents() {
    const snapshot = await this.ref.child('/Mobile/Events').once('value');
    return snapshot.val() || {};
  }

  async makeRequest(i, j, year) {
    let listings = {};
    try {
      //The web request to 25LivePub
      let response = await axios.get(`https://25livepub.collegenet.com/calendars/arts-and-architecture-mixin?date=${year}${i < 10 ? `0${i}` : i}${j < 10 ? `0${j}` : j}&media=print`, { headers: { 'content-type': 'text/html' } });
      if (response.status === 200) {
        const html = response.data;
        listings = { ...listings, ...this.extractListingsFromHTML(html, year) };
      }
      return listings;
    } catch (err) {
      console.warn('REQUEST ERROR:', `date=${year}${i < 10 ? `0${i}` : i}${j < 10 ? `0${j}` : j}`);
    }
  }

  async runScraper(year) {
    const dateVariables = [];
    for (let i = 1; i < 13; i++) {
      for (let j = 1; j < 31; j++) {
        dateVariables.push({ i, j, year });
      }
    }
    let result = {};
    try {
      const val = await Promise.all(
        dateVariables.map(async date => this.makeRequest(date.i, date.j, date.year)),
      );
      val.forEach((requestGroup) => {
        Object.keys(requestGroup).forEach((eventKey) => {
          result = { ...result, [eventKey]: requestGroup[eventKey] };
        });
      });
    } catch (err) {
      console.warn('ERROR Condensing request')
    }
    return { ...result };
  }

  filterExistingEvents(existingEvents, possibleEvents) {
    Object.keys(possibleEvents).forEach((eventKey) => {
      let event = get(existingEvents, eventKey, null);
      if (event) delete possibleEvents[eventKey];
    });
    return possibleEvents;
  }

  async killLostEvents(year, firebaseEvents, scrapedEvents) {
    const yearHex = h.toHex(year);
    const eventsForYear = Object.keys(firebaseEvents).reduce((acc, key) => {
      if (key && yearHex && key.startsWith(yearHex)) {
        acc = { ...acc, [key]: { ...firebaseEvents[key] } }
      }
      return acc;
    }, {});
    await Promise.all(
      Object.keys(eventsForYear).map(async (eventKey) => {
        if (eventKey) {
          const existsInScraped = get(scrapedEvents, eventKey, null);
          if (!existsInScraped) await this.ref.child(`/ScrapedEvents/Pending/${eventKey}`).remove();
        }
      })
    );
  }

  async writeEventsToFirebase(events) {
    console.log('WRITING TO FIREBASE', JSON.stringify(events));
    return await this.ref.child('/ScrapedEvents/Pending/').update(events)
  }

  async startScraper() {
    let year = 0;
    let date = new Date();
    let years = [date.getFullYear(), date.getFullYear() + 1];
    const run = async () => {
      year = h.changeYear(year);
      const currentEvents = await this.getCurrentEvents();
      let firebaseEvents = await this.getScrapedEvents();
      let scrapedEvents = await this.runScraper(years[year]);
      const pendingWebEvents = await this.getPendingWebEvents();
      await this.killLostEvents(years[year], firebaseEvents, scrapedEvents);
      firebaseEvents = await this.getScrapedEvents();
      const ignoredEvents = get(firebaseEvents, 'ignored', {});
      scrapedEvents = this.filterExistingEvents(currentEvents, scrapedEvents);
      scrapedEvents = this.filterExistingEvents(pendingWebEvents, scrapedEvents);
      scrapedEvents = this.filterExistingEvents(ignoredEvents, scrapedEvents);
      await this.writeEventsToFirebase(scrapedEvents);
      setTimeout(() => {
        run().then(() => {
          console.log('DATE', years[year], new Date().toISOString());
        });
      }, 1000 * 60 * 30);
    };
    run().then(() => {
      console.log('DATE', years[year], new Date().toISOString());
    });
  }

  async init() {
    console.log('INITIALIZING');
    this.startScraper();
    return this;
  }
}

export default Scraper;