"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var changeYear = function changeYear(year) {
  if (year === 0) {
    return year += 1;
  } else {
    return year -= 1;
  }
};

var toHex = function toHex(str) {
  str = str.toString();
  var hex = '';

  for (var i = 0; i < str.length; i++) {
    hex += "".concat(str.charCodeAt(i).toString(16));
  }

  return hex.trim();
};

var _default = {
  changeYear: changeYear,
  toHex: toHex
};
exports.default = _default;