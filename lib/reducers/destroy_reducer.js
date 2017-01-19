'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _update_state = require('./update_state');

var _update_state2 = _interopRequireDefault(_update_state);

var _destroy_data = require('./destroy_data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (types) {
  var FAIL = types.FAIL,
      SEND = types.SEND,
      SUCCESS = types.SUCCESS,
      URL = types.URL;

  return function (state, action) {
    var update_state = (0, _update_state2.default)(state);
    switch (action.type) {
      case URL:
        return (0, _destroy_data.addDestroyUrl)(update_state, action.url);
      case SEND:
        return (0, _destroy_data.sendDestroy)(update_state);
      case SUCCESS:
        return (0, _destroy_data.successDestroy)(state, action.id, action.receivedAt);
      case FAIL:
        return (0, _destroy_data.failDestroy)(update_state, action.errors, action.receivedAt);
      default:
        return false;
    }
  };
};