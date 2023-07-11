import mongoose, { ObjectId } from "mongoose";

const Schema = new mongoose.Schema({
    email: {
        type: String,
    },
    firstname: {
        type: String,
    },
    lastname: {
        type: String,
    },
    username: {
        type: String,
    },
    source: {
        type: String,
    },
}, {
    timestamps: true
})