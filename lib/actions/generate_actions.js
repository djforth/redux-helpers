"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (action, type) {
  action = action.toUpperCase();
  type = type.toUpperCase();
  return {
    URL: action + "_" + type + "_URL",
    SEND: action + "_SEND_" + type,
    SUCCESS: action + "_SUCCESS_" + type,
    FAIL: action + "_FAIL_" + type
  };
};

var ModelActions = exports.ModelActions = function ModelActions(type) {
  type = type.toUpperCase();
  return {
    CLOSE: "CLOSE_" + type,
    OPEN: "OPEN_" + type
  };
};

var FetchActions = exports.FetchActions = function FetchActions(type) {
  type = type.toUpperCase();
  return {
    URL: type + "_URL",
    REQUEST: "REQUEST_" + type,
    RECEIVE: "RECEIVE_" + type
  };
};