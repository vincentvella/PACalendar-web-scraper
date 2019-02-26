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
class Scraper {
  constructor(props) {
    this.ref = props.ref;
  }

  async startStatusProcess() {
    let year = 0;
    let date = new Date();
    let years = [date.getFullYear(), date.getFullYear() + 1];
    const run = async () => {
      console.log('hey');
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
    this.startStatusProcess();
    return this;
  }
}

export default Scraper;