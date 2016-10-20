"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Open = exports.Open = function Open(type) {
  return function (id) {
    return {
      type: type,
      id: id
    };
  };
};

var Edit = exports.Edit = function Edit(Opener) {
  return function (id) {
    return function (dispatch) {
      dispatch(Opener(id));
    };
  };
};

var Close = exports.Close = function Close(type) {
  return function () {
    return {
      type: type
    };
  };
};

exports.default = function (open_type, close_type) {
  var open = Open(open_type);
  var edit = Edit(open);
  var close = Close(close_type);
  return {
    close: close, edit: edit, open: open
  };
};