"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var productSchema = new _mongoose["default"].Schema({
  description: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  user: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: {
    type: Date,
    required: true,
    "default": function _default() {
      return Date.now();
    }
  }
});

var Product = _mongoose["default"].model("Product", productSchema);

var _default2 = Product;
exports["default"] = _default2;