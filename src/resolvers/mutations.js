import User from '../models/user'
import Bcrypt from 'bcryptjs'
import Product from '../models/product'
import CartItem from '../models/cartItem'
import jwt from 'jsonwebtoken'
import {randomBytes} from 'crypto'
import axios from 'axios'
import { retrieveCustomer, createCustomer, createChargeCard, createChargeInternetBanking } from '../utils/omiseUtils'
import OrderItem from '../models/OrderItem'
import Order from '../models/Order'

const Mutation = {
    signup:async (parent, args, context, info) => {
        
        const email = args.email.trim().toLowerCase()

        const currentUsers = await User.find({})

        const isEmailExist = currentUsers.findIndex(user => user.email === email) > -1

        if(isEmailExist) throw new Error('Email already exist.')

        if (args.password.trim().length < 6) throw new Error('Password must be least 6 charactor.')
        
        const password = await Bcrypt.hash(args.password, 10)

        return User.create({...args, email,password})
    },
    login:async(parent, args, context, info) => {
        const { email, password } = args
        
        // Find user in database
        const user = await User.findOne({ email })
            .populate({ path: "products", populate: { path: "user" } })
            .populate({ path: 'carts', populate: { path: 'product' } })
            .populate({
                path: 'orders', options: { sort: { createdAt: 'desc' } },
                populate: { path: 'items', populate: { path: 'product' } }
            })

        
        if (!user) throw new Error('Email not found, please sign up.')

        //Check if password is correct
        const validPassword = await Bcrypt.compare(password,user.password)
    
        if(!validPassword) throw new Error('Invalid email or password.')
    
        const token = jwt.sign({userId: user.id},"8931b2faa6d70e124aa9b38f8a3dface8d66168ef9a02e2ea27fb7832d0d6e2e798366a6b44b9eae219ca365b8d75c4820ece130951d6d12b3e969fce8814b02", {expiresIn:'7days'})
    
        return {user, jwt: token}
    },
    requestResetPassword: async (parent, { email }, context, info) => {
        // 1. find user in database by email
        const user = await User.findOne({email})
        // 2. if no user found, throw error
        if(!user) throw new Error('Email not found,Please sign up instead.')
        // 3. Create resetPasswordToken and resetTokenExpiry
        const resetPasswordToken = randomBytes(32).toString('hex')
        const resetTokenExpiry = Date.now() + 30 * 60 * 1000
        // 4. Update user (save reset token and token expiry)
        await User.findByIdAndUpdate(user.id, {
            resetPasswordToken,
            resetTokenExpiry
        })
        // 5. Send link for set password to user email

        const sendMail = axios({
                "method": "POST",
                "url": "https://rapidprod-sendgrid-v1.p.rapidapi.com/mail/send",
                "headers": {
                    "content-type": "application/json",
                    "x-rapidapi-host": "rapidprod-sendgrid-v1.p.rapidapi.com",
                    "x-rapidapi-key": "ac36a5e47bmsh59e0e449eb248bfp1a64ddjsn90ea5ddd6a92",
                    "accept": "application/json",
                    "useQueryString": true
                },
                "data": {
                    "personalizations": [{
                        "to": [{ "email": user.email }],
                        "subject": "Reset password"
                    }],
                    "from": { "email": "admin@test.com" },
                    "content": [{
                        "type": "text/html",
                        "value": `
                            <div>
                                <p>Please click below link to reset your password.</p>
                                <a href='https://basic-ecommerce-front-end.vercel.app//signin/resetpass?resetToken=${resetPasswordToken}' target='blank' style="color:orange;">Click to reset your password</a>
                            </div>
                        `
                    }]
                }
            })
            if (!sendMail) throw new Error('Sorry,cannot proceed.')

        // 6. Return message to frontend

        return{message:'Please check your email to proceed reset password.'}
    },
    resetPassword: async (parent, {password,token}, context, info) => {
        // Find user in database by reset Token
        const user = await User.findOne({ resetPasswordToken: token })
        // If no user found throw error
        if (!user) throw new Error('Invalid token, cannot reset password.')
        // check if token is expired
        const isTokenExpired = user.resetTokenExpiry < Date.now()
        // if token is expired throw error
        if(isTokenExpired) throw new Error('Token is expired, cannot reset password.')
        // hash new password
        const hashedPassword = await Bcrypt.hash(password,10)
        // update user in database (save new hashed password, delete reset token and token expiry time )
        await User.findByIdAndUpdate(user.id, {
            password: hashedPassword,
            resetPasswordToken: null,
            resetTokenExpiry: null
        })
        // return message
        return { message: 'You have successfully reset your password, Please sign in' }
    },
    ABV: (parent, args, context, info) => {
            args.standard_formula = "(ssg - fsg) * 131.25"
            args.alternate_formula = "76.08 * (ssg - fsg) / (1.775 - ssg) * (fsg / 0.794)"
            args.abw_formula = "abv * 0.79336"

            const standard_result = ((args.ssg - args.fsg) * 131.25)
            const alternate_result = (76.08 * (args.ssg - args.fsg) / (1.775 - args.ssg) * (args.fsg / 0.794))
            const standard_abw = (standard_result * 0.79336)
            const alternate_abw = (alternate_result * 0.79336)
            
            args.standard_abv = standard_result.toFixed(3)
            args.standard_abw = standard_abw.toFixed(3)
            args.alternate_abv = alternate_result.toFixed(3)
            args.alternate_abw = alternate_abw.toFixed(3)

            return (args)
    },
    createProduct: async (parent, args, {userId}, info) => {
        // const userId = '5f43628d999d5605d066e435'

        // Check if user logged in 
        if (!userId) throw new Error('Please login.')

        if(!args.description || !args.price || !args.imageUrl) throw new Error("Please provide all required fields.")

        const product = await Product.create({ ...args, user: userId })
        const user = await User.findById(userId)

        if (!user.products) {
            user.products = [product]
        } else {
            user.products.push(product)
        }

        await user.save()

        return Product.findById(product.id).populate({
            path: "user",
            populate: {
                path:"products"
            }
        })
    },
    updateProduct: async (parent, args, {userId}, info) => {
        const { id, description, price, imageUrl } = args

        // TODO: Check if user logged in
        if (!userId) throw new Error("Please login.")
        // Find product in database
        const product = await Product.findById(id)

        // TODO: Check if user is the owner of the product
        // const userId = "5f43628d999d5605d066e435"

        if (userId !== product.user.toString()) {
        throw new Error("You are not authorized.")
        }

        // Form updated information
        const updateInfo = {
        description: !!description ? description : product.description,
        price: !!price ? price : product.price,
        imageUrl: !!imageUrl ? imageUrl : product.imageUrl
        }

        // Update product in database
        await Product.findByIdAndUpdate(id, updateInfo)

        // Find the updated Product
        const updatedProduct = await Product.findById(id).populate({ path: "user" })

        return updatedProduct
    },
    addToCart: async (parent, args, {userId}, info) => {
        // id --> productId
        const { id } = args
        
        if (!userId) throw new Error('Please login.')

        try {
            // Find user who perform add to cart --> from logged in
            // const userId = "5f43692ab88fbe346cbe7c22"

            // Check if the new  addToCart is already in user.carts
            const user = await User.findById(userId).populate(
                {
                    path: 'carts',
                    populate: {
                        path:'product'
                    }
                }
            )

            const findCartItemIndex = user.carts.findIndex(cartItem => cartItem.product.id === id)
            
            if (findCartItemIndex > -1) {
            // A. The new addToCart item is already.
            // A.1 Find the cartItem and update in database.
                user.carts[findCartItemIndex].quantity += 1
                await CartItem.findByIdAndUpdate(user.carts[findCartItemIndex].id, {
                    quantity: user.carts[findCartItemIndex].quantity
                })
                
                // A.2 Find updated cartItem
                const updatedCartItem = await CartItem.findById(user.carts[findCartItemIndex].id)
                    .populate({ path: "product" })
                    .populate({ path: "user" })
                
                return updatedCartItem
            } else {
                // B. The new addToCart item is not in cart yet.
                // B.1 Create new cartItem.
                const cartItem = await CartItem.create({
                    product: id,
                    quantity: 1,
                    user: userId
                })
                // B.2 Find new cartItem.
                const newCartItem = await CartItem.findById(cartItem.id)
                    .populate({ path: "product" })
                    .populate({ path: "user" })
                
                await User.findByIdAndUpdate(userId, {
                    carts: [...user.carts, newCartItem]
                })
                return newCartItem
            }
            
        } catch (error) {
            console.log(error)
        }
    },
    deleteCart: async (parent, args, {userId}, info) => {
        const { id } = args

        if (!userId) throw new Error('Please login.')
        // Find cart from given id
        const cart = await CartItem.findById(id)

        // TODO: Check if user logged in

        // TODO: user id from request --> Find user
        // const userId = "5f43692ab88fbe346cbe7c22"

        const user = await User.findById(userId)

        // Check ownership of the cart
        if (cart.user.toString() !== userId) {
            throw new Error("Not authorized.")
        }

        // Delete cart
        const deletedCart = await CartItem.findByIdAndRemove(id)

        // Update user's carts
        const updatedUserCarts = user.carts.filter(
            cartId => cartId.toString() !== deletedCart.id.toString()
        )

        await User.findByIdAndUpdate(userId, { carts: updatedUserCarts })

        return deletedCart
    },
    deleteProduct: async (parent, args, {userId}, info) => {
        const { id } = args

        if (!userId) throw new Error('Please login.')
        // Find products from given id
        const products = await Product.findById(id)

        // TODO: Check if user logged in

        // TODO: user id from request --> Find user
        // const userId = "5f43692ab88fbe346cbe7c22"

        const user = await User.findById(userId)

        // Check ownership of the cart
        if (products.user.toString() !== userId) {
            throw new Error("Not authorized.")
        }

        // Delete products
        const deletedProduct = await Product.findByIdAndRemove(id)

        // Update user's products
        const updatedUserProducts = user.products.filter(
            productId => productId.toString() !== deletedProduct.id.toString()
        )

        await User.findByIdAndUpdate(userId, { products: updatedUserProducts })

        return deletedProduct
    },
    createOrder: async (parent, { amount, cardId, token, return_uri }, { userId }, info) => {
        // Check if user logged in
        if (!userId) throw new Error('Please log in.')

        // Query user from the database
        const user = await User.findById(userId).populate({
        path: 'carts',
        populate: { path: 'product' }
        })

        // Create charge with omise
        let customer

        // Credit Card: User use existing card
        if (amount && cardId && !token && !return_uri) {
            const cust = await retrieveCustomer(cardId)

            if (!cust) throw new Error('Cannot process payment.')

            customer = cust
        }

        // Credit Card: User use new card

        if (amount && token && !cardId && !return_uri) {
            const newCustomer = await createCustomer(user.email, user.name, token)
            
            if (!newCustomer) throw new Error('Cannot process payment.')

            customer = newCustomer

            // update user'cards field
            const {
                id,
                expiration_month,
                expiration_year,
                brand,
                last_digits
            } = newCustomer.cards.data[0]

            const newCard = {
                id: newCustomer.id,
                cardInfo: {
                    id,
                    expiration_month,
                    expiration_year,
                    brand,
                    last_digits
                }
            }

        await User.findByIdAndUpdate(userId, { cards: [newCard,...user.cards] })
        }

        let charge

        if (token && return_uri) {
            // Internet Banking
            charge = await createChargeInternetBanking(amount,token,return_uri)
        } else {
            // Credit Card
            charge = await createChargeCard(amount, customer.id)
        }
        
        if (!charge)
        throw new Error('Something went wrong with payment, please try again.')

        // Convert cartItem to OrderItem
        const convertCartToOrder = async () => {
        return Promise.all(
            user.carts.map(cart =>
            OrderItem.create({
                product: cart.product,
                quantity: cart.quantity,
                user: cart.user
            })
            )
        )
        }

        // Create order
        const orderItemArray = await convertCartToOrder()

        const order = await Order.create({
            user: userId,
            items: orderItemArray.map(orderItem => orderItem.id),
            authorize_uri: charge.authorize_uri
        })

        // Delete cartItem from the database
        const deleteCartItems = async () => {
        return Promise.all(
            user.carts.map(cart => CartItem.findByIdAndRemove(cart.id))
        )
        }

        await deleteCartItems()

        // Update user info in the database
        await User.findByIdAndUpdate(userId, {
        carts: [],
        orders: !user.orders ? [order.id] : [...user.orders, order.id]
        })

        // return order
        return Order.findById(order.id)
        .populate({ path: 'user' })
        .populate({ path: 'items', populate: { path: 'product' } })
    }
}

export default Mutation