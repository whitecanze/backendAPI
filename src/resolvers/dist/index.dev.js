"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mutations = _interopRequireDefault(require("./mutations"));

var _querys = _interopRequireDefault(require("./querys"));

var _graphqlIsoDate = require("graphql-iso-date");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var resolvers = {
  Query: _querys["default"],
  Mutation: _mutations["default"],
  Date: _graphqlIsoDate.GraphQLDateTime
};
var _default = resolvers;
exports["default"] = _default;