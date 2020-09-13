"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../models/user"));

var _product = _interopRequireDefault(require("../models/product"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var Query = {
  login: function login(parent, args, context, info) {
    var email, password, user, validPassword, token;
    return regeneratorRuntime.async(function login$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = args.email, password = args.password; // Find user in database

            _context.next = 3;
            return regeneratorRuntime.awrap(_user["default"].findOne({
              email: email
            }));

          case 3:
            user = _context.sent;

            if (user) {
              _context.next = 6;
              break;
            }

            throw new Error('Email not found, please sign up.');

          case 6:
            _context.next = 8;
            return regeneratorRuntime.awrap(_bcryptjs["default"].compare(password, user.password));

          case 8:
            validPassword = _context.sent;

            if (validPassword) {
              _context.next = 11;
              break;
            }

            throw new Error('Invalid email or password.');

          case 11:
            token = _jsonwebtoken["default"].sign({
              userId: user.id
            }, process.env.SECRET, {
              expiresIn: '7days'
            });
            return _context.abrupt("return", {
              userId: user.id,
              jwt: token
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  user: function user(parent, args, _ref, info) {
    var userId = _ref.userId;
    // Check if user logged in
    if (!userId) throw new Error('Please login');
    if (userId !== args.id) throw new Error('Not authorized.');
    return _user["default"].findById(args.id).populate({
      path: "products",
      populate: {
        path: "user"
      }
    }).populate({
      path: 'carts',
      populate: {
        path: 'product'
      }
    });
  },
  users: function users(parent, args, context, info) {
    return _user["default"].find({}).populate({
      path: "products",
      populate: {
        path: "user"
      }
    }).populate({
      path: 'carts',
      populate: {
        path: 'product'
      }
    });
  },
  product: function product(parent, args, context, info) {
    return _product["default"].findById(args.id).populate({
      path: "user",
      populate: {
        path: "products"
      }
    });
  },
  products: function products(parent, args, context, info) {
    return _product["default"].find().populate({
      path: "user",
      populate: {
        path: "products"
      }
    });
  }
};
var _default = Query;
exports["default"] = _default;