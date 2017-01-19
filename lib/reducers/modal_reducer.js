'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _update_state = require('./update_state');

var _update_state2 = _interopRequireDefault(_update_state);

var _open_close = require('./open_close');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (types) {
  var CLOSE = types.CLOSE,
      OPEN = types.OPEN;

  return function (state, action) {
    var update_state = (0, _update_state2.default)(state);
    switch (action.type) {
      case CLOSE:
        return (0, _open_close.closeModal)(update_state);
      case OPEN:
        return (0, _open_close.openModal)(update_state, action.id);
      default:
        return false;
    }
  };
};