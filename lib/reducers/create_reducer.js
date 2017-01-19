'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _update_state = require('./update_state');

var _update_state2 = _interopRequireDefault(_update_state);

var _create_data = require('./create_data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (types) {
  var flush = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
  var FAIL = types.FAIL,
      SEND = types.SEND,
      SUCCESS = types.SUCCESS,
      URL = types.URL;

  return function (state, action) {
    var update_state = (0, _update_state2.default)(state);
    switch (action.type) {
      case URL:
        return (0, _create_data.addCreateUrl)(update_state, action.url);
      case SEND:
        return (0, _create_data.sendCreate)(update_state);
      case SUCCESS:
        return (0, _create_data.successCreate)(state, action.item, action.receivedAt, flush);
      case FAIL:
        return (0, _create_data.failCreate)(update_state, action.errors, action.receivedAt);
      default:
        return false;
    }
  };
};