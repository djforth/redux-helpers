'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.successUpdate = exports.sendUpdate = exports.failUpdate = exports.addUpdateUrl = undefined;

var _update_state = require('./update_state');

var _update_state2 = _interopRequireDefault(_update_state);

var _forIn = require('lodash/forIn');

var _forIn2 = _interopRequireDefault(_forIn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addUpdateUrl = exports.addUpdateUrl = function addUpdateUrl(update_state, update_url) {
  return update_state({ update_url: update_url });
};

var failUpdate = exports.failUpdate = function failUpdate(update_state, errors, receivedAt) {
  return update_state({
    isUpdating: false,
    didError: true,
    errors: errors,
    lastUpdated: receivedAt
  });
};

var sendUpdate = exports.sendUpdate = function sendUpdate(update_state) {
  return update_state({
    isUpdating: true,
    didError: false,
    errors: null
  });
};

function update_item(items, updated_data) {
  var item = items.find(function (item) {
    return item.get('id') === updated_data.id;
  });
  if (!item) return items;
  var index = items.indexOf(item);
  (0, _forIn2.default)(updated_data, function (v, k) {
    item = item.set(k, v);
  });
  return items.set(index, item);
}

var successUpdate = exports.successUpdate = function successUpdate(state, item, receivedAt) {
  var update_state = (0, _update_state2.default)(state);
  var items = state.items;

  items = update_item(items, item);
  return update_state({
    isUpdating: false,
    didError: false,
    errors: null,
    items: items,
    lastUpdated: receivedAt
  });
};

// For Testing

exports.default = function () {
  return 'Update Data';
};