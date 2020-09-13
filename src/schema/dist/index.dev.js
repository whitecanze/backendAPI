"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.typeDefs = exports.resolvers = void 0;

var _apolloServerExpress = require("apollo-server-express");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    type Query{\n        me: User\n        user(id: ID!): User\n        users: [User]!\n    }\n    type User {\n        id: ID!\n        name: String!\n    }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _users = [{
  id: '1',
  name: 'Roengchai'
}, {
  id: '2',
  name: 'Sempai'
}, {
  id: '3',
  name: 'Hime'
}];
var _me = _users[0];
var resolvers = {
  Query: {
    me: function me(parent, args, context, info) {
      return _me;
    },
    user: function user(parent, args, context, info) {
      var id = args.id;

      var user = _users.find(function (u) {
        return u.id === id;
      });

      return user;
    },
    users: function users(parent, args, context, info) {
      return _users;
    }
  }
};
exports.resolvers = resolvers;
var typeDefs = (0, _apolloServerExpress.gql)(_templateObject());
exports.typeDefs = typeDefs;