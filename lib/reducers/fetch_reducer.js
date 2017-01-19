'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _update_state = require('./update_state');

var _update_state2 = _interopRequireDefault(_update_state);

var _get_data = require('./get_data');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (types) {
  var RECEIVE = types.RECEIVE,
      REQUEST = types.REQUEST,
      URL = types.URL;

  return function (state, action) {
    var update_state = (0, _update_state2.default)(state);
    switch (action.type) {
      case REQUEST:
        return (0, _get_data.requestData)(update_state);
      case RECEIVE:
        return (0, _get_data.receiveData)(update_state, action.data, action.receivedAt);
      case URL:
        return (0, _get_data.addUrl)(update_state, action.url);
      default:
        return false;
    }
  };
};