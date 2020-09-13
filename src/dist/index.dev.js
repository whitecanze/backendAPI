"use strict";

var _express = _interopRequireDefault(require("express"));

var _server = _interopRequireDefault(require("./server"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dotenv = require("dotenv");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

(0, _dotenv.config)();
var _process$env = process.env,
    DB_USERNAME = _process$env.DB_USERNAME,
    DB_PASSWORD = _process$env.DB_PASSWORD,
    DB_NAME = _process$env.DB_NAME,
    PORT = _process$env.PORT;

var createServer = function createServer() {
  var app;
  return regeneratorRuntime.async(function createServer$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(_mongoose["default"].connect("mongodb+srv://".concat(DB_USERNAME, ":").concat(DB_PASSWORD, "@graphql-basic.7dgl9.mongodb.net/").concat(DB_NAME, "?retryWrites=true&w=majority"), {
            useUnifiedTopology: true,
            useFindAndModify: false
          }));

        case 3:
          app = (0, _express["default"])();

          _server["default"].applyMiddleware({
            app: app
          });

          app.listen({
            port: "".concat(PORT)
          }, function () {
            return console.log("\uD83D\uDE80 Server ready at http://localhost:".concat(PORT).concat(_server["default"].graphqlPath));
          });
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

createServer();