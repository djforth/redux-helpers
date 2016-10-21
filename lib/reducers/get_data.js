'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requestData = exports.receiveData = exports.addUrl = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import _ from 'lodash/core';

var addUrl = exports.addUrl = function addUrl(update_state, url) {
  return update_state({ url: url });
};

var receiveData = exports.receiveData = function receiveData(update_state, items, receivedAt) {
  return update_state({
    isFetching: false,
    didInvalidate: false,
    items: _immutable2.default.fromJS(items),
    lastUpdated: receivedAt
  });
};

var requestData = exports.requestData = function requestData(update_state) {
  return update_state({
    isFetching: true,
    didInvalidate: false
  });
};

// For Testing

exports.default = function () {
  return 'get Data';
};