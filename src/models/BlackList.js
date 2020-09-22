import mongoose from "mongoose"

const blackListSchema = new mongoose.Schema({
    jwt: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 60 * 60 * 1000 * 7
    }
})

const BlackList = mongoose.model("BlackList", blackListSchema)

export default BlackList