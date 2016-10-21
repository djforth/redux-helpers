'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setDefaults;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setDefaults(defaults) {
  return function (state) {
    // Doing this way because of how Redux deals with initialState (see scriptWriterApp)
    return Object.assign({}, defaults, state);
  };
}