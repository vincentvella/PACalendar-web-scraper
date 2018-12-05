"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("@babel/polyfill");

var _axios = _interopRequireDefault(require("axios"));

var _cheerio = _interopRequireDefault(require("cheerio"));

var _app = _interopRequireDefault(require("firebase/app"));

require("firebase/database");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

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
  _createClass(WebScraper, null, [{
    key: "condenseEvents",
    value: function condenseEvents(result, currentScrapedEvents) {
      var condensedEvents = {};
      Object.keys(result).forEach(function (eventKey) {
        if (!(currentScrapedEvents && currentScrapedEvents[eventKey])) {
          condensedEvents = _objectSpread({}, condensedEvents, _defineProperty({}, eventKey, result[eventKey]));
        }
      });
      return condensedEvents;
    }
  }]);

  function WebScraper(props) {
    _classCallCheck(this, WebScraper);

    this.ref = props.ref;
    this.toHex = this.toHex.bind(this);
    this.runScraper = this.runScraper.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.getScrapedEvents = this.getScrapedEvents.bind(this);
    this.extractListingsFromHTML = this.extractListingsFromHTML.bind(this);
  }

  _createClass(WebScraper, [{
    key: "toHex",
    value: function toHex(str) {
      var hex = '';

      for (var i = 0; i < str.length; i++) {
        hex += "".concat(str.charCodeAt(i).toString(16));
      }

      return hex.trim();
    }
  }, {
    key: "extractListingsFromHTML",
    value: function extractListingsFromHTML(html) {
      var _this = this;

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
        var event = events[key];

        var eventKey = _this.toHex(event.timeDate + event.title);

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
                return this.ref.child('/Scraped-Events').once('value');

              case 2:
                snapshot = _context.sent;
                return _context.abrupt("return", snapshot.val());

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
    key: "makeRequest",
    value: function () {
      var _makeRequest = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(i, j, year) {
        var listings, response, html;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                listings = {};
                _context2.prev = 1;
                _context2.next = 4;
                return _axios.default.get("https://25livepub.collegenet.com/calendars/arts-and-architecture-mixin?date=".concat(year).concat(i < 10 ? "0".concat(i) : i).concat(j < 10 ? "0".concat(j) : j, "&media=print"), {
                  headers: {
                    'content-type': 'text/html'
                  }
                });

              case 4:
                response = _context2.sent;

                if (response.status === 200) {
                  html = response.data;
                  listings = _objectSpread({}, listings, this.extractListingsFromHTML(html));
                }

                return _context2.abrupt("return", listings);

              case 9:
                _context2.prev = 9;
                _context2.t0 = _context2["catch"](1);
                console.warn('REQUEST ERROR:', "date=".concat(year).concat(i < 10 ? "0".concat(i) : i).concat(j < 10 ? "0".concat(j) : j));

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[1, 9]]);
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
      regeneratorRuntime.mark(function _callee4(year) {
        var _this2 = this;

        var dateVariables, i, j, result, currentScrapedEvents, val;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
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
                currentScrapedEvents = {};
                _context4.prev = 4;
                _context4.next = 7;
                return Promise.all(dateVariables.map(
                /*#__PURE__*/
                function () {
                  var _ref = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee3(date) {
                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                      while (1) {
                        switch (_context3.prev = _context3.next) {
                          case 0:
                            return _context3.abrupt("return", _this2.makeRequest(date.i, date.j, date.year));

                          case 1:
                          case "end":
                            return _context3.stop();
                        }
                      }
                    }, _callee3, this);
                  }));

                  return function (_x5) {
                    return _ref.apply(this, arguments);
                  };
                }()));

              case 7:
                val = _context4.sent;
                val.forEach(function (requestGroup) {
                  Object.keys(requestGroup).forEach(function (eventKey) {
                    result = _objectSpread({}, result, _defineProperty({}, eventKey, requestGroup[eventKey]));
                  });
                });
                _context4.next = 11;
                return this.getScrapedEvents();

              case 11:
                currentScrapedEvents = _context4.sent;
                _context4.next = 17;
                break;

              case 14:
                _context4.prev = 14;
                _context4.t0 = _context4["catch"](4);
                console.warn('ERROR Condensing request');

              case 17:
                return _context4.abrupt("return", _objectSpread({}, WebScraper.condenseEvents(result, currentScrapedEvents)));

              case 18:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this, [[4, 14]]);
      }));

      return function runScraper(_x4) {
        return _runScraper.apply(this, arguments);
      };
    }()
  }, {
    key: "startScraper",
    value: function () {
      var _startScraper = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee6() {
        var _this3 = this;

        var year, date, years, run;
        return regeneratorRuntime.wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                year = 0;
                date = new Date();
                years = [date.getFullYear(), date.getFullYear() + 1];

                run =
                /*#__PURE__*/
                function () {
                  var _ref2 = _asyncToGenerator(
                  /*#__PURE__*/
                  regeneratorRuntime.mark(function _callee5() {
                    var events;
                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                      while (1) {
                        switch (_context5.prev = _context5.next) {
                          case 0:
                            if (year === 0) {
                              year++;
                            } else {
                              year--;
                            }

                            _context5.next = 3;
                            return _this3.runScraper(years[year]);

                          case 3:
                            events = _context5.sent;
                            console.log('Events', Object.keys(events).length);
                            setTimeout(function () {
                              run().then(function () {
                                console.log('DATE', years[year], new Date().toISOString());
                              });
                            }, 1000 * 60 * 30);

                          case 6:
                          case "end":
                            return _context5.stop();
                        }
                      }
                    }, _callee5, this);
                  }));

                  return function run() {
                    return _ref2.apply(this, arguments);
                  };
                }();

                run().then(function () {
                  console.log('DATE', years[year], new Date().toISOString());
                });

              case 5:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
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
      regeneratorRuntime.mark(function _callee7() {
        return regeneratorRuntime.wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                this.startScraper();
                return _context7.abrupt("return", this);

              case 2:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
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