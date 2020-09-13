import Mutation from './mutations'
import Query from './querys'
import {GraphQLDateTime} from 'graphql-iso-date'

const resolvers = {
    Query,
    Mutation,
    Date: GraphQLDateTime
}

export default resolvers