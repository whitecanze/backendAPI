"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _apolloServerExpress = require("apollo-server-express");

var _resolvers = _interopRequireDefault(require("./resolvers"));

var _getUser = _interopRequireDefault(require("./utils/getUser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var typeDefs = _fs["default"].readFileSync(_path["default"].join(__dirname, "./schema", "schema.graphql"), "utf8").toString();

var server = new _apolloServerExpress.ApolloServer({
  typeDefs: typeDefs,
  resolvers: _resolvers["default"],
  context: function context(_ref) {
    var req = _ref.req;
    // Check token from headers
    var token = req.headers.authorization || ''; // Extract userId from token

    var userId = (0, _getUser["default"])(token);
    return {
      userId: userId
    };
  }
});
var _default = server;
exports["default"] = _default;