'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _core = require('lodash/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (dispatch) {
  return function (data, creator, type) {
    var obj = {};

    if (_core2.default.isString(data)) {
      obj[type + '_title'] = data;
      obj[type + '_id'] = null;

      if (_core2.default.isFunction(creator)) {
        dispatch(creator({ title: data }));
      }

      return obj;
    }

    obj[type + '_id'] = data;
    return obj;
  };
};