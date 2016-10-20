'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCreateUrl = exports.CreateAction = exports.CreateData = exports.Fail = exports.Success = exports.Send = undefined;

var _create = require('@djforth/ajax-es6-fp/create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Send = exports.Send = function Send(TYPE) {
  return function () {
    return {
      type: TYPE,
      isCreating: true
    };
  };
};

var Success = exports.Success = function Success(TYPE) {
  return function (succ) {
    return {
      type: TYPE,
      item: succ,
      receivedAt: Date.now(),
      isCreating: false
    };
  };
};

var Fail = exports.Fail = function Fail(TYPE) {
  return function (err) {
    return {
      type: TYPE,
      errors: err,
      receivedAt: Date.now(),
      isCreating: false
    };
  };
};

var CreateData = exports.CreateData = function CreateData(send, success, fail) {
  var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'Item';

  return function (url, data) {
    var create_data = (0, _create2.default)(url);
    return function (dispatch) {
      dispatch(send());
      return create_data(data).then(function (json) {
        dispatch(success(json));
      }).catch(function (err) {
        dispatch(fail(err));
      });
    };
  };
};

var CreateAction = exports.CreateAction = function CreateAction(fail_type, send_type, processor) {
  var failer = Fail(fail_type);
  var sender = Send(send_type);

  return CreateData(sender, processor, failer);
};

var addCreateUrl = exports.addCreateUrl = function addCreateUrl(TYPE) {
  return function (url) {
    return {
      type: TYPE,
      url: url
    };
  };
};

exports.default = function () {
  return 'create';
};