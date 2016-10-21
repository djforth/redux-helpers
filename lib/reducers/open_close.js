"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var openModal = exports.openModal = function openModal(update_state, id) {
  return update_state({
    editing: id,
    open: true
  });
};

var closeModal = exports.closeModal = function closeModal(update_state) {
  return update_state({
    editing: null,
    didError: false,
    errors: null,
    open: false
  });
};