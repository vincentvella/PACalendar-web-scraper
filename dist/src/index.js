"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("@babel/polyfill");

var _axios = _interopRequireDefault(require("axios"));

var _lodash = require("lodash");

var _cheerio = _interopRequireDefault(require("cheerio"));

var _express = _interopRequireDefault(require("express"));

var _app = _interopRequireDefault(require("firebase/app"));

require("firebase/database");

var _helpers = _interopRequireDefault(require("./helpers"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

require('dotenv').load();

var app = (0, _express.default)();
var port = process.env.PORT;
app.set('view engine', 'ejs');
app.use(_express.default.static('./public'));
app.get('/', function (req, res) {
  res.render('index');
});
app.listen(port, function () {
  console.log("Our app is running on port ".concat(port));
});
var config = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
};

_app.default.initializeApp(config);

var db = _app.default.database();

var ref = db.ref();

var WebScraper =
/*#__PURE__*/
function () {
  function WebScraper(props) {
    _classCallCheck(this, WebScraper);

    this.ref = props.ref;
    this.runScraper = this.runScraper.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.killLostEvents = this.killLostEvents.bind(this);
    this.getScrapedEvents = this.getScrapedEvents.bind(this);
    this.getCurrentEvents = this.getCurrentEvents.bind(this);
    this.getPendingWebEvents = this.getPendingWebEvents.bind(this);
    this.extractListingsFromHTML = this.extractListingsFromHTML.bind(this);
  }

  _createClass(WebScraper, [{
    key: "extractListingsFromHTML",
    value: function extractListingsFromHTML(html, year) {
      var $ = _cheerio.default.load(html, {
        xmlMode: false
      });

      var events = {};
      $('div.twRyoPhotoEventsItemHeader').each(function (i, el) {
        events = _objectSpread({}, events, _defineProperty({}, i, {}));
        events[i].timeDate = $(el).children('.twRyoPhotoEventsItemHeaderDate').text().trim(); // this is the time and date

        events[i].calendar = $(el).children('.twRyoPhotoEventsItemHeaderLocation').text().trim(); // calendar location
      });
      $('span.twRyoPhotoEventsDescription').each(function (i, el) {
        events[i].title = $(el).children('a').text().trim();
      });
      $('div.twRyoPhotoEventsNotes').each(function (i, el) {
        $(el).children('p').each(function (j, detail) {
          if ($(detail).text() === 'More details...') {
            events[i].extraInfoLink = $(detail).children('a').attr('href');
          }
        });
        events[i].details = $(el).html();
      });
      var finalEvents = {};
      Object.keys(events).forEach(function (key) {
        var event = _objectSpread({}, events[key], {
          year: year
        });

        var eventKey = _helpers.default.toHex(year + event.timeDate + event.title);

        finalEvents = _objectSpread({}, finalEvents, _defineProperty({}, eventKey, event));
      });
      return finalEvents;
    }
  }, {
    key: "getScrapedEvents",
    value: function () {
      var _getScrapedEvents = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var snapshot;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.ref.child('/ScrapedEvents').once('value');

              case 2:
                snapshot = _context.sent;
                return _context.abrupt("return", snapshot.val() || {});

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function getScrapedEvents() {
        return _getScrapedEvents.apply(this, arguments);
      };
    }()
  }, {
    key: "getPendingWebEvents",
    value: function () {
      var _getPendingWebEvents = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var snapshot;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return this.ref.child('/Web/Events').once('value');

              case 2:
                snapshot = _context2.sent;
                return _context2.abrupt("return", snapshot.val() || {});

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function getPendingWebEvents() {
        return _getPendingWebEvents.apply(this, arguments);
      };
    }()
  }, {
    key: "getCurrentEvents",
    value: function () {
      var _getCurrentEvents = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var snapshot;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return this.ref.child('/Mobile/Events').once('value');

              case 2:
                snapshot = _context3.sent;
                return _context3.abrupt("return", snapshot.val() || {});

              case 4:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      return function getCurrentEvents() {
        return _getCurrentEvents.apply(this, arguments);
      };
    }()
  }, {
    key: "makeRequest",
    value: function () {
      var _makeRequest = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4(i, j, year) {
        var listings, response, html;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                listings = {};
                _context4.prev = 1;
                _context4.next = 4;
                return _axios.default.get("https://25livepub.collegenet.com/calendars/arts-and-architecture-mixin?date=".concat(year).concat(i < 10 ? "0".concat(i) : i).concat(j < 10 ? "0".concat(j) : j, "&media=print"), {
                  headers: {
                    'content-type': 'text/html'
                  }
                });

              case 4:
                response = _context4.sent;

                if (response.status === 200) {
                  html = response.data;
                  listings = _objectSpread({}, listings, this.extractListingsFromHTML(html, year));
                }

                return _context4.abrupt("return", listings);

              case 9:
                _context4.prev = 9;
                _context4.t0 = _context4["catch"](1);
                console.warn('REQUEST ERROR:', "date=".concat(year).concat(i < 10 ? "0".concat(i) : i).concat(j < 10 ? "0".concat(j) : j));

              case 12:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[1, 9]]);
      }));

      return function makeRequest(_x, _x2, _x3) {
        return _makeRequest.apply(this, arguments);
      };
    }()
  }, {
    key: "runScraper",
    value: function () {
      var _runScraper = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6(year) {
        var _this = this;

        var dateVariables, i, j, result, val;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                dateVariables = [];

                for (i = 1; i < 13; i++) {
                  for (j = 1; j < 31; j++) {
                    dateVariables.push({
                      i: i,
                      j: j,
                      year: year
                    });
                  }
                }

                result = {};
                _context6.prev = 3;
                _context6.next = 6;
                return Promise.all(dateVariables.map(
                /*#__PURE__*/
                function () {
                  var _ref = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee5(date) {
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            return _context5.abrupt("return", _this.makeRequest(date.i, date.j, date.year));

                          case 1:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5, this);
                  }));

                  return function (_x5) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 6:
                val = _context6.sent;
                val.forEach(function (requestGroup) {
                  Object.keys(requestGroup).forEach(function (eventKey) {
                    result = _objectSpread({}, result, _defineProperty({}, eventKey, requestGroup[eventKey]));
                  });
                });
                _context6.next = 13;
                break;

              case 10:
                _context6.prev = 10;
                _context6.t0 = _context6["catch"](3);
                console.warn('ERROR Condensing request');

              case 13:
                return _context6.abrupt("return", _objectSpread({}, result));

              case 14:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this, [[3, 10]]);
      }));

      return function runScraper(_x4) {
        return _runScraper.apply(this, arguments);
      };
    }()
  }, {
    key: "filterExistingEvents",
    value: function filterExistingEvents(existingEvents, possibleEvents) {
      Object.keys(possibleEvents).forEach(function (eventKey) {
        var event = (0, _lodash.get)(existingEvents, eventKey, null);
        if (event) delete possibleEvents[eventKey];
      });
      return possibleEvents;
    }
  }, {
    key: "killLostEvents",
    value: function () {
      var _killLostEvents = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee8(year, firebaseEvents, scrapedEvents) {
        var _this2 = this;

        var yearHex, eventsForYear;
        return regeneratorRuntime.wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                yearHex = _helpers.default.toHex(year);
                eventsForYear = Object.keys(firebaseEvents).reduce(function (acc, key) {
                  if (key && yearHex && key.startsWith(yearHex)) {
                    acc = _objectSpread({}, acc, _defineProperty({}, key, _objectSpread({}, firebaseEvents[key])));
                  }

                  return acc;
                }, {});
                _context8.next = 4;
                return Promise.all(Object.keys(eventsForYear).map(
                /*#__PURE__*/
                function () {
                  var _ref2 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee7(eventKey) {
                    var existsInScraped;
                    return regeneratorRuntime.wrap(function _callee7$(_context7) {
                      while (1) {
                        switch (_context7.prev = _context7.next) {
                          case 0:
                            if (!eventKey) {
                              _context7.next = 5;
                              break;
                            }

                            existsInScraped = (0, _lodash.get)(scrapedEvents, eventKey, null);

                            if (existsInScraped) {
                              _context7.next = 5;
                              break;
                            }

                            _context7.next = 5;
                            return _this2.ref.child("/ScrapedEvents/Pending/".concat(eventKey)).remove();

                          case 5:
                          case "end":
                            return _context7.stop();
                        }
                      }
                    }, _callee7, this);
                  }));

                  return function (_x9) {
                    return _ref2.apply(this, arguments);
                  };
                }()));

              case 4:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      return function killLostEvents(_x6, _x7, _x8) {
        return _killLostEvents.apply(this, arguments);
      };
    }()
  }, {
    key: "writeEventsToFirebase",
    value: function () {
      var _writeEventsToFirebase = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee9(events) {
        return regeneratorRuntime.wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                console.log('WRITING TO FIREBASE', JSON.stringify(events));
                _context9.next = 3;
                return this.ref.child('/ScrapedEvents/Pending/').update(events);

              case 3:
                return _context9.abrupt("return", _context9.sent);

              case 4:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9, this);
      }));

      return function writeEventsToFirebase(_x10) {
        return _writeEventsToFirebase.apply(this, arguments);
      };
    }()
  }, {
    key: "startScraper",
    value: function () {
      var _startScraper = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee11() {
        var _this3 = this;

        var year, date, years, run;
        return regeneratorRuntime.wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                year = 0;
                date = new Date();
                years = [date.getFullYear(), date.getFullYear() + 1];

                run =
                /*#__PURE__*/
                function () {
                  var _ref3 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee10() {
                    var currentEvents, firebaseEvents, scrapedEvents, pendingWebEvents, ignoredEvents;
                    return regeneratorRuntime.wrap(function _callee10$(_context10) {
                      while (1) {
                        switch (_context10.prev = _context10.next) {
                          case 0:
                            year = _helpers.default.changeYear(year);
                            _context10.next = 3;
                            return _this3.getCurrentEvents();

                          case 3:
                            currentEvents = _context10.sent;
                            _context10.next = 6;
                            return _this3.getScrapedEvents();

                          case 6:
                            firebaseEvents = _context10.sent;
                            _context10.next = 9;
                            return _this3.runScraper(years[year]);

                          case 9:
                            scrapedEvents = _context10.sent;
                            _context10.next = 12;
                            return _this3.getPendingWebEvents();

                          case 12:
                            pendingWebEvents = _context10.sent;
                            _context10.next = 15;
                            return _this3.killLostEvents(years[year], firebaseEvents, scrapedEvents);

                          case 15:
                            _context10.next = 17;
                            return _this3.getScrapedEvents();

                          case 17:
                            firebaseEvents = _context10.sent;
                            ignoredEvents = (0, _lodash.get)(firebaseEvents, 'ignored', {});
                            scrapedEvents = _this3.filterExistingEvents(currentEvents, scrapedEvents);
                            scrapedEvents = _this3.filterExistingEvents(pendingWebEvents, scrapedEvents);
                            scrapedEvents = _this3.filterExistingEvents(ignoredEvents, scrapedEvents);
                            _context10.next = 24;
                            return _this3.writeEventsToFirebase(scrapedEvents);

                          case 24:
                            setTimeout(function () {
                              run().then(function () {
                                console.log('DATE', years[year], new Date().toISOString());
                              });
                            }, 1000 * 60 * 30);

                          case 25:
                          case "end":
                            return _context10.stop();
                        }
                      }
                    }, _callee10, this);
                  }));

                  return function run() {
                    return _ref3.apply(this, arguments);
                  };
                }();

                run().then(function () {
                  console.log('DATE', years[year], new Date().toISOString());
                });

              case 5:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      return function startScraper() {
        return _startScraper.apply(this, arguments);
      };
    }()
  }, {
    key: "init",
    value: function () {
      var _init = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee12() {
        return regeneratorRuntime.wrap(function _callee12$(_context12) {
          while (1) {
            switch (_context12.prev = _context12.next) {
              case 0:
                console.log('INITIALIZING');
                this.startScraper();
                return _context12.abrupt("return", this);

              case 3:
              case "end":
                return _context12.stop();
            }
          }
        }, _callee12, this);
      }));

      return function init() {
        return _init.apply(this, arguments);
      };
    }()
  }]);

  return WebScraper;
}();

exports.default = WebScraper;
var webScraper = new WebScraper({
  ref: ref
});
webScraper.init();
setTimeout(function () {
  return process.exit();
}, 86400000);