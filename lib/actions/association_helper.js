"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Create = exports.Create = function Create(type) {
  return function (data) {
    return {
      type: type,
      data: data
    };
  };
};

var Update = exports.Update = function Update(type) {
  return function (id) {
    return {
      type: type,
      id: id
    };
  };
};