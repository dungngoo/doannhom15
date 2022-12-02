const { json } = require("body-parser");
const { User, Chat, Request, Message } = require("../model/model");
const userController = require("./userController");

const chatController = {

    //Get Method=======================================================================================

    getAllChats: async (req, res) => {
        try {
            const chats = await Chat.find();
            const lstRs = [];

            if (chats.length == 0) {
                return res.status(404).json({ "statusCode": 404, "message": "Not Found Chats", payload: null });
            }

            chats.forEach((item) => {
                const d = {
                    id: item.id,
                    chatName: item.chatName,
                    type: item.type,
                };
                lstRs.push(d);
            });
            return res.status(200).json({ "statusCode": 200, "message": "Get Chats Successfully", payload: { chat: lstRs } });
        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    getChatWithOtherUserId: async (req, res) => {
        try {
            const chat = await Chat.findOne({ 'type': 0, 'users': { $all: [req.body.currentUserId, req.params.otherUserId] } }).populate("messages");

            if (chat) {

                const lstMess = [];

                for (const i in chat.messages) {
                    const sender = await User.findOne({ '_id': chat.messages[i].sender }, { '_id': 1, 'name': 1, 'avatar': 1 });
                    const a = {
                        id: chat.messages[i].id,
                        type: chat.messages[i].type,
                        content: chat.messages[i].content,
                        chat: chat.messages[i].chat,
                        imageHeight: chat.messages[i].imageHeight,
                        recall: chat.messages[i].recall,
                        sender: {
                            id: sender.id,
                            name: sender.name,
                            avatar: sender.avatar
                        },
                        createdAt: chat.messages[i].createdAt
                    }
                    lstMess.push(a);
                }

                const payload = {
                    id: chat.id,
                    chatName: chat.chatName,
                    type: chat.type,
                    users: chat.users,
                    messages: lstMess
                };

                return res.status(200).json({ "statusCode": 200, "message": "Get Chat Successfully", payload });
            } else {
                return res.status(404).json({ "statusCode": 404, "message": "Not Found Chat", payload: null });
            }
        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    getChatById: async (req, res) => {
        try {
            const chat = await Chat.findById(req.params.id);
            if (!chat) {
                return res.status(404).json({ "statusCode": 404, "message": "Not Found Chat", payload: null });
            }
            const messages = await Message.find({ 'chat': chat.id }).sort({ createdAt: -1 }).limit(1);
            const sender = await User.findOne({ '_id': messages[0].sender }, { '_id': 1, 'name': 1 });
            const mess = {
                id: messages[0].id,
                type: messages[0].type,
                content: messages[0].content,
                recall: messages[0].recall,
                imageHeight: messages[0].imageHeight,
                sender: {
                    id: sender.id,
                    name: sender.name,
                },
                createdAt: messages[0].createdAt
            }
            if (chat.type == 0) {
                for (const j in chat.users) {
                    if (String(req.body.currentUserId) != String(chat.users[j])) {
                        const receiver = await User.findOne({ '_id': chat.users[j] });
                        const d = {
                            id: chat.id,
                            createBy: chat.createBy,
                            type: chat.type,
                            chatName: chat.chatName,
                            receiver: {
                                id: receiver.id,
                                name: receiver.name,
                                avatar: receiver.avatar
                            },
                            lastMessage: mess
                        }
                        return res.status(200).json({ "statusCode": 200, "message": "Get Chat Successfully", payload: d });
                    }
                }
            } else {
                const d = {
                    id: chat.id,
                    createBy: chat.createBy,
                    type: chat.type,
                    chatName: chat.chatName,
                    lastMessage: mess
                }
                return res.status(200).json({ "statusCode": 200, "message": "Get Chat Successfully", payload: d });
            }
        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    getAllChatOfUser: async (req, res) => {
        try {
            const chat = await Chat.find({ 'users': req.body.currentUserId }).sort({ 'updatedAt': -1 }).populate("messages");
            if (chat.length == 0) {
                return res.status(200).json({ "statusCode": 200, "message": "Not Found Chats", payload: null });
            }
            const payload = [];
            for (const i in chat) {
                const messages = await Message.find({ 'chat': chat[i].id }).sort({ createdAt: -1 }).limit(1);
                const sender = await User.findOne({ '_id': messages[0].sender }, { '_id': 1, 'name': 1 });
                const mess = {
                    id: messages[0].id,
                    type: messages[0].type,
                    content: messages[0].content,
                    recall: messages[0].recall,
                    imageHeight: messages[0].imageHeight,
                    sender: {
                        id: sender.id,
                        name: sender.name,
                    },
                    createdAt: messages[0].createdAt
                }
                if (chat[i].type == 0) {
                    for (const j in chat[i].users) {
                        if (String(req.body.currentUserId) != String(chat[i].users[j])) {
                            const receiver = await User.findOne({ '_id': chat[i].users[j] });
                            const d = {
                                id: chat[i].id,
                                createBy: chat[i].createBy,
                                type: chat[i].type,
                                chatName: chat[i].chatName,
                                receiver: {
                                    id: receiver.id,
                                    name: receiver.name,
                                    avatar: receiver.avatar
                                },
                                lastMessage: mess
                            }
                            payload.push(d);
                        }
                    }
                } else {
                    const d = {
                        id: chat[i].id,
                        createBy: chat[i].createBy,
                        type: chat[i].type,
                        chatName: chat[i].chatName,
                        lastMessage: mess
                    }
                    payload.push(d);
                }
            }

            return res.status(200).json({ "statusCode": 200, "message": "Get Chats Successfully", payload });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    getAllMessageByChatId: async (req, res) => {
        try {
            const messages = await Message.find({ 'chat': req.params.chatId }).sort({ createdAt: 1 });

            if (messages.length == 0) {
                return res.status(404).json({ "statusCode": 404, "message": "Not Found Messages", payload: null });
            }

            const payload = [];

            for (const i in messages) {
                const sender = await User.findOne({ '_id': messages[i].sender }, { '_id': 1, 'name': 1, 'avatar': 1 });
                const d = {
                    id: messages[i].id,
                    type: messages[i].type,
                    content: messages[i].content,
                    chatId: messages[i].chat,
                    recall: messages[i].recall,
                    imageHeight: messages[i].imageHeight,
                    sender: {
                        id: sender.id,
                        name: sender.name,
                        avatar: sender.avatar
                    },
                    createdAt: messages[i].createdAt,
                };
                payload.push(d);
            }
            return res.status(200).json({ "statusCode": 200, "message": "Get Messages Successfully", payload });
        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    //Add Method===========================================================================================================

    addChat: async (req, res) => {
        try {
            if (req.body.type == 1) {
                req.body.createBy = req.body.currentUserId;
            }
            const newChat = new Chat(req.body);
            const savedChat = await newChat.save();
            if (await chatController.addUserToChat(savedChat.id, req.body.currentUserId) == 0) {
                req.body.users.forEach(async (item) => {
                    await User.updateOne({ '_id': item }, { $push: { chats: savedChat.id } });
                });
                const rs = await Chat.findOne({ '_id': savedChat.id });
                const payload = {
                    id: rs.id,
                    type: rs.type,
                    createBy: rs.createBy,
                    chatName: rs.chatName
                };
                return res.status(200).json({ "statusCode": 200, "message": "Add Chat Successfully", payload });
            }
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error", payload: null });
        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    addUserToChat: async (chatId, userId) => {
        try {
            const chat = await Chat.findOne({ '_id': chatId, 'users': userId });
            if (chat) {
                return 2;
            }
            await Chat.updateOne({ '_id': chatId }, { $push: { users: userId } });
            await User.updateOne({ '_id': userId }, { $push: { chats: chatId } });
            return 0;
        } catch (error) {
            return 1;
        }
    },

    removeUserInChat: async (chatId, userId) => {
        try {
            const chat = await Chat.findOne({ '_id': chatId, 'users': userId });
            if (!chat) {
                return 2;
            }
            await Chat.updateOne({ '_id': chat.id }, { $pull: { users: userId } });
            await User.updateOne({ '_id': userId }, { $pull: { chats: chatId } });
            return 0;
        } catch (error) {
            return 1;
        }
    },

    addMessage: async (message) => {
        try {
            const mess = new Message({
                type: message.type,
                content: message.content,
                chat: message.chatId,
                sender: message.sender,
                imageHeight: message.imageHeight,
                replyMessage: message.replyMessageId
            });
            const newMessage = await mess.save();
            if (!newMessage) {
                throw new Error("Khong them message dc, request co van de !!!");
            }
            const c = await Chat.aggregate([{ $match: { '_id': newMessage.chat } }, { $project: { count: { $size: "$messages" } } }]);
            await Chat.updateOne({ '_id': newMessage.chat }, { $push: { 'messages': newMessage.id } });
            const user = await User.findOne({ '_id': message.sender }, { 'name': 1, '_id': 1, 'avatar': 1 });
            newMessage.sender = user;
            const count = c[0].count;
            if (newMessage.replyMessage) {
                const replyMessage = await Message.findOne({ '_id': newMessage.replyMessage });
                const rsReply = {
                    id: replyMessage.id,
                    type: replyMessage.type,
                    content: replyMessage.content,
                    recall: replyMessage.recall,
                    imageHeight: replyMessage.imageHeight,
                    sender: {
                        id: newMessage.sender.id,
                        name: newMessage.sender.name,
                        avatar: newMessage.sender.avatar
                    }
                }
                newMessage.reply = rsReply;
            }
            return { newMessage, count };
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    //Delete Mothod

    deleteChat: async (req, res) => {
        try {

        } catch (error) {
            res.status(500).json(error);
        }
    },

};

module.exports = chatController;