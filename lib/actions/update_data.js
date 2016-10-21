'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Patch = require('@djforth/ajax-es6-fp/patch');

var Send = exports.Send = function Send(TYPE) {
  return function () {
    return {
      type: TYPE,
      didError: false,
      isUpdating: true
    };
  };
};

var Success = exports.Success = function Success(TYPE) {
  return function (succ) {
    return {
      type: TYPE,
      item: succ,
      receivedAt: Date.now(),
      isUpdating: false
    };
  };
};

var Fail = exports.Fail = function Fail(TYPE) {
  return function (err) {
    return {
      type: TYPE,
      didError: true,
      errors: err,
      receivedAt: Date.now(),
      isUpdating: false
    };
  };
};

var UpdateData = exports.UpdateData = function UpdateData(send, success, fail) {
  return function (url, data, id) {
    var update_data = Patch(url);
    return function (dispatch) {
      dispatch(send());

      return update_data(data, id).then(function (json) {
        dispatch(success(json));
      }).catch(function (err, status) {
        dispatch(fail(err, status));
      });
    };
  };
};

var UpdateAction = exports.UpdateAction = function UpdateAction(fail_type, send_type, processor) {
  var failer = Fail(fail_type);
  var sender = Send(send_type);

  return UpdateData(sender, processor, failer);
};

var addUpdateUrl = exports.addUpdateUrl = function addUpdateUrl(TYPE) {
  return function (url) {
    return {
      type: TYPE,
      url: url
    };
  };
};

exports.default = function () {
  return 'update';
};