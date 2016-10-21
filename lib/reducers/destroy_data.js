'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.successDestroy = exports.sendDestroy = exports.failDestroy = exports.addDestroyUrl = undefined;

var _update_state = require('./update_state');

var _update_state2 = _interopRequireDefault(_update_state);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var addDestroyUrl = exports.addDestroyUrl = function addDestroyUrl(update_state, destroy_url) {
  return update_state({ destroy_url: destroy_url });
};

var failDestroy = exports.failDestroy = function failDestroy(update_state, errors, receivedAt) {
  return update_state({
    isDestroying: false,
    didError: true,
    errors: errors,
    lastUpdated: receivedAt
  });
};

var sendDestroy = exports.sendDestroy = function sendDestroy(update_state) {
  return update_state({
    isDestroying: true,
    didError: false,
    errors: null
  });
};

function destroy_item(items, id) {
  var item = items.find(function (item) {
    return item.get('id') === id;
  });
  if (!item) return items;
  var index = items.indexOf(item);
  return items.delete(index);
}

var successDestroy = exports.successDestroy = function successDestroy(state, id, receivedAt) {
  var update_state = (0, _update_state2.default)(state);
  var items = state.items;

  items = destroy_item(items, id);
  return update_state({
    isDestroying: false,
    didError: false,
    errors: null,
    items: items,
    lastUpdated: receivedAt
  });
};

// For Testing

exports.default = function () {
  return 'Destroy Data';
};