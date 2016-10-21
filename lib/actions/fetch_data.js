'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Get = exports.addUrl = exports.FetchAction = exports.FetchData = exports.Receive = exports.Request = undefined;

var _fetch = require('@djforth/ajax-es6-fp/fetch');

var _fetch2 = _interopRequireDefault(_fetch);

var _core = require('lodash/core');

var _core2 = _interopRequireDefault(_core);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Request = exports.Request = function Request(TYPE) {
  return function () {
    return {
      type: TYPE,
      isFetching: true
    };
  };
};

var Receive = exports.Receive = function Receive(TYPE) {
  return function (json) {
    return {
      type: TYPE,
      data: json,
      isFetching: false,
      receivedAt: Date.now()
    };
  };
};

function additionalDispatcher(additional) {
  if (!(_core2.default.isArray(additional) || _core2.default.isFunction(additional))) return null;

  return function (dispatch, data) {
    // data = Immutable.fromJS(data)
    if (_core2.default.isFunction(additional)) {
      dispatch(additional(data));
      return;
    }

    additional.forEach(function (a) {
      dispatch(a(data));
    });
  };
}

var FetchData = exports.FetchData = function FetchData(request, receive, additional) {
  var addDispatcher = additionalDispatcher(additional);
  return function (url, sucMsg, errMsg) {
    var get_data = (0, _fetch2.default)(url);
    return function (dispatch) {
      dispatch(request());
      return get_data().then(function (json) {
        dispatch(receive(json));
        if (!_core2.default.isNull(addDispatcher)) {
          addDispatcher(dispatch, json);
        }
      }).catch(function (err) {
        /* eslint-disable */
        console.log(err);
        /* eslint-enable */
      });
    };
  };
};

var FetchAction = exports.FetchAction = function FetchAction(receive_type, request_type, additonal) {
  var requester = Request(request_type);
  var receiver = Receive(receive_type);
  return FetchData(requester, receiver, additonal);
};

var addUrl = exports.addUrl = function addUrl(TYPE) {
  return function (url) {
    return {
      type: TYPE,
      url: url
    };
  };
};

var Get = exports.Get = function Get(getFetchURL, RECEIVE, REQUEST) {
  return function () {
    var fetcher = FetchAction(RECEIVE, REQUEST);

    return function (dispatch, getState) {
      var url = getFetchURL(getState());
      return dispatch(fetcher(url));
    };
  };
};

exports.default = function () {
  return 'fetch';
};