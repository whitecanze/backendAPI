import express from 'express'
import server from './server'
import mongoose from 'mongoose'
import { config } from 'dotenv'

config()

const {
    DB_USERNAME,
    DB_PASSWORD,
    DB_NAME,
    PORT,
} = process.env

const createServer = async () => {
    try {
        await mongoose.connect(
            `mongodb+srv://whitecanze123:JQrSlA67Icy1kxKA@graphql-basic.7dgl9.mongodb.net/ecommerce?retryWrites=true&w=majority`,
            { useUnifiedTopology : true , useFindAndModify: false},
        )

        const app = express()

        server.applyMiddleware({ app })

        app.listen({ port: 4000}, () =>
            console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
        )
    } catch (error) {
        console.log(error)
    }
}

createServer()