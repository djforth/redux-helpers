"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setDefaults;
function setDefaults(defaults) {
  return function (state) {
    // Doing this way because of how Redux deals with initialState (see scriptWriterApp)
    return Object.assign({}, defaults, state);
  };
}