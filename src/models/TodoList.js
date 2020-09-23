import mongoose from "mongoose"

const todoListSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    completed:{
        type: Boolean,
        required: true,
        default: false
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => Date.now() + 60 * 60 * 1000 * 7
    }
})

const TodoList = mongoose.model("TodoList", todoListSchema)

export default TodoList