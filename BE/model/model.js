const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const chatSchema = new mongoose.Schema({
    chatName: { type: String, required: false },
    type: { type: Number, required: true },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }]
},
    {
        timestamps: true
    }
);

const userSchema = new mongoose.Schema({
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    gender: { type: Number, require: true },
    birthDay: { type: String, require: false },
    avatar: { type: String, require: false, default: null },
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "Request" }]
});

userSchema.index({ phoneNumber: 'text', name: 'text' });

const requestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});

const messageSchema = new mongoose.Schema(
    {
        type: { type: Number, require: true },
        content: { type: String, require: true },
        recall: { type: Boolean, require: true, default: false },
        usersDelete: [{ type: mongoose.Schema.Types.ObjectId }],
        replyMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null },
        imageHeight: { type: Number, require: false },
        chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
    },
    {
        timestamps: true
    }
);


let User = mongoose.model("User", userSchema);
let Chat = mongoose.model("Chat", chatSchema);
let Request = mongoose.model("Request", requestSchema);
let Message = mongoose.model("Message", messageSchema);

module.exports = { User, Chat, Request, Message };