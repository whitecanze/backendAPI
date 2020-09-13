"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var cartItemSchema = new _mongoose["default"].Schema({
  product: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Product"
  },
  quantity: {
    type: Number,
    required: true
  },
  user: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  createdAt: {
    type: Date,
    required: true,
    "default": function _default() {
      return Date.now();
    }
  }
});

var CartItem = _mongoose["default"].model("CartItem", cartItemSchema);

var _default2 = CartItem;
exports["default"] = _default2;