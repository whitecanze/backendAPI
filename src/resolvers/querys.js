import User from '../models/user'
import Product from '../models/product'
import CartItem from '../models/cartItem'
import BlackList from '../models/BlackList'
import TodoList from '../models/TodoList'

const Query = {
    user: (parent, args, { userId }, info) => {
        // Check if user logged in
        if (!userId) throw new Error('Please login')
        
        return User.findById(userId)
            .populate({ path: "products",options:{sort:{createdAt: 'desc'}},populate: { path:"user" } })
            .populate({ path: 'carts', populate: { path: 'product' } })
            .populate({path:'orders',options:{sort:{createdAt: 'desc'}},populate:{path:'items',populate:{path:'product'}}})
    },
    checkBlackList: (parent, args, context, info) => BlackList.find({}),
    allTodoList: (parent, args, context, info) => TodoList.find({}),
    userTodoList: (parent, args, context, info) => TodoList.find()
        .populate({ path: "user", populate: { path: "todolist" } }).sort({ createdAt: 'desc' }),
    users: (parent, args, context, info) => User.find({})
        .populate({ path: "products", populate: { path: "user" }})
        .populate({ path: 'carts', populate: { path: 'product' } }),
    product: (parent, args, context, info) => Product.findById(args.id)
        .populate({ path: "user",populate: {path:"products"}}),
    products: (parent, args, context, info) => Product.find()
        .populate({ path: "user",populate: {path:"products"}}).sort({createdAt: 'desc'}),
    allCartItem: (parent, args, context, info) => CartItem.find({})
        .populate({ path: "product" }).populate({ path: "user" }).sort({createdAt: 'desc'}),
        // .populate({ path: "products",populate: {path:"user"}})
        // .populate({ path: "user",populate: {path:"products"}})
}

export default Query