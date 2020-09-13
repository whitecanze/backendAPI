"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getUser = function getUser(token) {
  if (!token) return null; // 'Bearer ....' -> [Bearer, ....]

  var parsedToken = token.split(' ')[1];

  try {
    var decodedToken = _jsonwebtoken["default"].verify(parsedToken, process.env.SECRET);

    return decodedToken.userId;
  } catch (error) {
    return null;
  }
};

var _default = getUser;
exports["default"] = _default;