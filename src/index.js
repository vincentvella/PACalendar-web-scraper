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
require('dotenv').load();

import '@babel/polyfill';
import express from 'express';
import firebase from 'firebase/app';
import 'firebase/database';
import Scraper from "./scraper";
const app = express();
const port = process.env.PORT;

app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.get('/', (req, res) => {
  res.render('index');
});
app.listen(port, () => {
  console.log(`Our app is running on port ${port}`);
});

const config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
};

firebase.initializeApp(config);
const db = firebase.database();
const ref = db.ref();

const webScraper = new Scraper({ ref });
webScraper.init();

setTimeout(() => process.exit(), 86400000);
