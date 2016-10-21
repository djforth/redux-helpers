'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateItemId = exports.addItem = undefined;

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _update_state = require('./update_state');

var _update_state2 = _interopRequireDefault(_update_state);

var _core = require('lodash/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createItem(data) {
  data = Object.assign({}, data, {
    id: _core2.default.uniqueId('new'),
    creating: true
  });
  return _immutable2.default.fromJS(data);
}

function removeExistingInCreating(items) {
  return items.filterNot(function (i) {
    return i.get('creating');
  });
}

var addItem = exports.addItem = function addItem(state, data) {
  var update_state = (0, _update_state2.default)(state);
  var items = state.items;
  // Clear existing creating items

  items = removeExistingInCreating(items);
  items = items.push(createItem(data));
  return update_state({
    items: items
  });
};

var updateItemId = exports.updateItemId = function updateItemId(state, id) {
  var update_state = (0, _update_state2.default)(state);
  var items = state.items;

  items = items.map(function (item) {
    if (item.get('creating') && !_core2.default.isNull(id)) {
      return item.map(function (v, k) {
        if (k === 'id') return id;
        if (k === 'creating') return false;
        return v;
      });
    }
    return item;
  });

  return update_state({
    items: items
  });
};

// For Testing

exports.default = function () {
  return 'Add Data';
};