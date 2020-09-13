"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _user = _interopRequireDefault(require("../models/user"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _product = _interopRequireDefault(require("../models/product"));

var _cartItem = _interopRequireDefault(require("../models/cartItem"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Mutation = {
  signup: function signup(parent, args, context, info) {
    var email, currentUsers, isEmailExist, password;
    return regeneratorRuntime.async(function signup$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            email = args.email.trim().toLowerCase();
            _context.next = 3;
            return regeneratorRuntime.awrap(_user["default"].find({}));

          case 3:
            currentUsers = _context.sent;
            isEmailExist = currentUsers.findIndex(function (user) {
              return user.email === email;
            }) > -1;

            if (!isEmailExist) {
              _context.next = 7;
              break;
            }

            throw new Error('Email already exist.');

          case 7:
            if (!(args.password.trim().length < 6)) {
              _context.next = 9;
              break;
            }

            throw new Error('Password must be least 6 charactor.');

          case 9:
            _context.next = 11;
            return regeneratorRuntime.awrap(_bcryptjs["default"].hash(args.password, 10));

          case 11:
            password = _context.sent;
            return _context.abrupt("return", _user["default"].create(_objectSpread({}, args, {
              email: email,
              password: password
            })));

          case 13:
          case "end":
            return _context.stop();
        }
      }
    });
  },
  ABV: function ABV(parent, args, context, info) {
    args.standard_formula = "(ssg - fsg) * 131.25";
    args.alternate_formula = "76.08 * (ssg - fsg) / (1.775 - ssg) * (fsg / 0.794)";
    args.abw_formula = "abv * 0.79336";
    var standard_result = (args.ssg - args.fsg) * 131.25;
    var alternate_result = 76.08 * (args.ssg - args.fsg) / (1.775 - args.ssg) * (args.fsg / 0.794);
    var standard_abw = standard_result * 0.79336;
    var alternate_abw = alternate_result * 0.79336;
    args.standard_abv = standard_result.toFixed(3);
    args.standard_abw = standard_abw.toFixed(3);
    args.alternate_abv = alternate_result.toFixed(3);
    args.alternate_abw = alternate_abw.toFixed(3);
    return args;
  },
  createProduct: function createProduct(parent, args, _ref, info) {
    var userId, product, user;
    return regeneratorRuntime.async(function createProduct$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            userId = _ref.userId;

            if (userId) {
              _context2.next = 3;
              break;
            }

            throw new Error('Please login.');

          case 3:
            if (!(!args.description || !args.price || !args.imageUrl)) {
              _context2.next = 5;
              break;
            }

            throw new Error("Please provide all required fields.");

          case 5:
            _context2.next = 7;
            return regeneratorRuntime.awrap(_product["default"].create(_objectSpread({}, args, {
              user: userId
            })));

          case 7:
            product = _context2.sent;
            _context2.next = 10;
            return regeneratorRuntime.awrap(_user["default"].findById(userId));

          case 10:
            user = _context2.sent;

            if (!user.products) {
              user.products = [product];
            } else {
              user.products.push(product);
            }

            _context2.next = 14;
            return regeneratorRuntime.awrap(user.save());

          case 14:
            return _context2.abrupt("return", _product["default"].findById(product.id).populate({
              path: "user",
              populate: {
                path: "products"
              }
            }));

          case 15:
          case "end":
            return _context2.stop();
        }
      }
    });
  },
  updateProduct: function updateProduct(parent, args, _ref2, info) {
    var userId, id, description, price, imageUrl, product, updateInfo, updatedProduct;
    return regeneratorRuntime.async(function updateProduct$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            userId = _ref2.userId;
            id = args.id, description = args.description, price = args.price, imageUrl = args.imageUrl; // TODO: Check if user logged in

            if (userId) {
              _context3.next = 4;
              break;
            }

            throw new Error("Please login.");

          case 4:
            _context3.next = 6;
            return regeneratorRuntime.awrap(_product["default"].findById(id));

          case 6:
            product = _context3.sent;

            if (!(userId !== product.user.toString())) {
              _context3.next = 9;
              break;
            }

            throw new Error("You are not authorized.");

          case 9:
            // Form updated information
            updateInfo = {
              description: !!description ? description : product.description,
              price: !!price ? price : product.price,
              imageUrl: !!imageUrl ? imageUrl : product.imageUrl
            }; // Update product in database

            _context3.next = 12;
            return regeneratorRuntime.awrap(_product["default"].findByIdAndUpdate(id, updateInfo));

          case 12:
            _context3.next = 14;
            return regeneratorRuntime.awrap(_product["default"].findById(id).populate({
              path: "user"
            }));

          case 14:
            updatedProduct = _context3.sent;
            return _context3.abrupt("return", updatedProduct);

          case 16:
          case "end":
            return _context3.stop();
        }
      }
    });
  },
  addToCart: function addToCart(parent, args, _ref3, info) {
    var userId, id, user, findCartItemIndex, updatedCartItem, cartItem, newCartItem;
    return regeneratorRuntime.async(function addToCart$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            userId = _ref3.userId;
            // id --> productId
            id = args.id;

            if (userId) {
              _context4.next = 4;
              break;
            }

            throw new Error('Please login.');

          case 4:
            _context4.prev = 4;
            _context4.next = 7;
            return regeneratorRuntime.awrap(_user["default"].findById(userId).populate({
              path: 'carts',
              populate: {
                path: 'product'
              }
            }));

          case 7:
            user = _context4.sent;
            findCartItemIndex = user.carts.findIndex(function (cartItem) {
              return cartItem.product.id === id;
            });

            if (!(findCartItemIndex > -1)) {
              _context4.next = 19;
              break;
            }

            // A. The new addToCart item is already.
            // A.1 Find the cartItem and update in database.
            user.carts[findCartItemIndex].quantity += 1;
            _context4.next = 13;
            return regeneratorRuntime.awrap(_cartItem["default"].findByIdAndUpdate(user.carts[findCartItemIndex].id, {
              quantity: user.carts[findCartItemIndex].quantity
            }));

          case 13:
            _context4.next = 15;
            return regeneratorRuntime.awrap(_cartItem["default"].findById(user.carts[findCartItemIndex].id).populate({
              path: "product"
            }).populate({
              path: "user"
            }));

          case 15:
            updatedCartItem = _context4.sent;
            return _context4.abrupt("return", updatedCartItem);

          case 19:
            _context4.next = 21;
            return regeneratorRuntime.awrap(_cartItem["default"].create({
              product: id,
              quantity: 1,
              user: userId
            }));

          case 21:
            cartItem = _context4.sent;
            _context4.next = 24;
            return regeneratorRuntime.awrap(_cartItem["default"].findById(cartItem.id).populate({
              path: "product"
            }).populate({
              path: "user"
            }));

          case 24:
            newCartItem = _context4.sent;
            _context4.next = 27;
            return regeneratorRuntime.awrap(_user["default"].findByIdAndUpdate(userId, {
              carts: [].concat(_toConsumableArray(user.carts), [newCartItem])
            }));

          case 27:
            return _context4.abrupt("return", newCartItem);

          case 28:
            _context4.next = 33;
            break;

          case 30:
            _context4.prev = 30;
            _context4.t0 = _context4["catch"](4);
            console.log(_context4.t0);

          case 33:
          case "end":
            return _context4.stop();
        }
      }
    }, null, null, [[4, 30]]);
  },
  deleteCart: function deleteCart(parent, args, _ref4, info) {
    var userId, id, cart, user, deletedCart, updatedUserCarts;
    return regeneratorRuntime.async(function deleteCart$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userId = _ref4.userId;
            id = args.id;

            if (userId) {
              _context5.next = 4;
              break;
            }

            throw new Error('Please login.');

          case 4:
            _context5.next = 6;
            return regeneratorRuntime.awrap(_cartItem["default"].findById(id));

          case 6:
            cart = _context5.sent;
            _context5.next = 9;
            return regeneratorRuntime.awrap(_user["default"].findById(userId));

          case 9:
            user = _context5.sent;

            if (!(cart.user.toString() !== userId)) {
              _context5.next = 12;
              break;
            }

            throw new Error("Not authorized.");

          case 12:
            _context5.next = 14;
            return regeneratorRuntime.awrap(_cartItem["default"].findOneAndRemove(id));

          case 14:
            deletedCart = _context5.sent;
            // Update user's carts
            updatedUserCarts = user.carts.filter(function (cartId) {
              return cartId.toString() !== deletedCart.id.toString();
            });
            _context5.next = 18;
            return regeneratorRuntime.awrap(_user["default"].findByIdAndUpdate(userId, {
              carts: updatedUserCarts
            }));

          case 18:
            return _context5.abrupt("return", deletedCart);

          case 19:
          case "end":
            return _context5.stop();
        }
      }
    });
  }
};
var _default = Mutation;
exports["default"] = _default;