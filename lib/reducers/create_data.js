'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendCreate = exports.successCreate = exports.failCreate = exports.addCreateUrl = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _update_state = require('./update_state');

var _update_state2 = _interopRequireDefault(_update_state);

var _core = require('lodash/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addCreateUrl = exports.addCreateUrl = function addCreateUrl(update_state, create_url) {
  return update_state({ create_url: create_url });
};

var failCreate = exports.failCreate = function failCreate(update_state, errors, receivedAt) {
  return update_state({
    isCreating: false,
    didError: true,
    errors: errors,
    lastUpdated: receivedAt
  });
};

var successCreate = exports.successCreate = function successCreate(state, item, receivedAt, flush) {
  var update_state = (0, _update_state2.default)(state);
  var items = state.items;

  if (flush) {
    items = _immutable2.default.fromJS(item);
  } else if (_core2.default.isArray(item)) {
    items = items.concat(_immutable2.default.fromJS(item));
  } else {
    items = items.push(_immutable2.default.fromJS(item));
  }
  return update_state({
    isCreating: false,
    didError: false,
    errors: null,
    items: items,
    lastUpdated: receivedAt
  });
};

var sendCreate = exports.sendCreate = function sendCreate(update_state) {
  return update_state({
    isCreating: true,
    didError: false,
    errors: null
  });
};

// For Testing

exports.default = function () {
  return 'Create Data';
};