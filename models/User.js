const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true
    },
    gender: String,
    name: String,
    age: String,

    step: {
        type: String,
        default: "gender"
    },

    isSearching: {
        type: Boolean,
        default: false
    },

    isConnected: {
        type: Boolean,
        default: false
    },

    partnerId: {
        type: Number,
        default: null
    }
});

module.exports = mongoose.model("User", userSchema);