'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _update_state = require('./update_state');

var _update_state2 = _interopRequireDefault(_update_state);

var _update_data = require('./update_data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (types) {
  var FAIL = types.FAIL;
  var SEND = types.SEND;
  var SUCCESS = types.SUCCESS;
  var URL = types.URL;

  return function (state, action) {
    var update_state = (0, _update_state2.default)(state);
    switch (action.type) {
      case URL:
        return (0, _update_data.addUpdateUrl)(update_state, action.url);
      case SEND:
        return (0, _update_data.sendUpdate)(update_state);
      case SUCCESS:
        return (0, _update_data.successUpdate)(state, action.item, action.receivedAt);
      case FAIL:
        return (0, _update_data.failUpdate)(update_state, action.errors, action.receivedAt);
      default:
        return false;
    }
  };
};