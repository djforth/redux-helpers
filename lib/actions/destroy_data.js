'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Destroy = require('@djforth/ajax-es6-fp/destroy');

var Send = exports.Send = function Send(TYPE) {
  return function () {
    return {
      type: TYPE,
      didError: false,
      isDeleting: true
    };
  };
};

var Success = exports.Success = function Success(TYPE) {
  return function (id) {
    return {
      type: TYPE,
      id: id,
      receivedAt: Date.now(),
      isDeleting: false
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
      isDeleting: false
    };
  };
};

var DestroyData = exports.DestroyData = function DestroyData(send, success, fail) {
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Item';

  return function (url, data) {
    var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    var destroy_data = Destroy(url);
    return function (dispatch) {
      dispatch(send());
      return destroy_data(id, data).then(function () {
        dispatch(success(id));
      }).catch(function (err) {
        dispatch(fail(err));
      });
    };
  };
};

var DestroyAction = exports.DestroyAction = function DestroyAction(fail_type, send_type, processor) {
  var failer = Fail(fail_type);
  var sender = Send(send_type);

  return DestroyData(sender, processor, failer);
};

var addDestroyUrl = exports.addDestroyUrl = function addDestroyUrl(TYPE) {
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