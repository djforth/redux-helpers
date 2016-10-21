"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = updateState;
function updateState(state) {
  return function (update) {
    return Object.assign({}, state, update);
  };
}