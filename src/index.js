import express from 'express'
import server from './server'
import mongoose from 'mongoose'
import { config } from 'dotenv'
import expressPlayground from 'graphql-playground-middleware-express'

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
            `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@graphql-basic.7dgl9.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
            { useUnifiedTopology : true , useFindAndModify: false},
        )

        const app = express()

        server.applyMiddleware({ app })
        app.get("/playground", expressPlayground({ endpoint: `${server.graphqlPath}`}));
        app.listen({ port: `${PORT}`}, () =>
            console.log(`🚀 Server ready at http://localhost:${PORT}/playground`)
        )
    } catch (error) {
        console.log(error)
    }
}

createServer()