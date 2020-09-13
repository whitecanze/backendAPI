"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  products: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Product"
  }],
  carts: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "CartItem"
  }],
  createdAt: {
    type: Date,
    required: true,
    "default": function _default() {
      return Date.now();
    }
  }
});

var User = _mongoose["default"].model("User", userSchema);

var _default2 = User;
exports["default"] = _default2;