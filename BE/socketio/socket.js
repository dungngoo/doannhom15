const jwt = require("jsonwebtoken");
const { User, Chat, Request, Message } = require("../model/model");

const userController = require("../controller/userController");
const chatController = require("../controller/chatController");
const middlewareController = require("../middleware/middlewareController");
const { json } = require("body-parser");

const socketio = {

    socketServer: async (io) => {

        const lstSocket = [];

        // const rsAuthFailed = {
        //     statusCode: 500,
        //     functionType: 1,
        //     message: "Auth Failed: Token Is Invalid",
        //     payload: null
        // };

        // const rsNotAuth = {
        //     statusCode: 404,
        //     functionType: 1,
        //     message: "Not Auth",
        //     payload: null
        // }

        // const rsSendRequestFail = {
        //     statusCode: 500,
        //     functionType: 2,
        //     message: "Send Request Error",
        //     payload: null
        // }

        // const rsRefuseRequestFail = {
        //     statusCode: 500,
        //     functionType: 4,
        //     message: "Refuse Request Error",
        //     payload: null
        // };

        // const rsAcceptRequestFail = {
        //     statusCode: 500,
        //     functionType: 3,
        //     message: "Accept Request Error",
        //     payload: null
        // };

        // const rsRemoveFriendFail = {
        //     statusCode: 500,
        //     functionType: 5,
        //     message: "Remove Friend Error",
        //     payload: null
        // };

        // const rsSendMessageFail = {
        //     statusCode: 500,
        //     functionType: 6,
        //     message: "Send Message Error",
        //     payload: null
        // };

        // class SocketError extends Error {
        //     constructor(message) {
        //         super(message);
        //         this.data = rsAuthFailed;
        //     }
        // };

        io.use(async (socket, next) => {
            const id = middlewareController.socketVerifyToken(socket.handshake.headers.token);
            if (id) {
                const user = await User.findOne({ '_id': id });
                socket.user = user;
                for (const i in lstSocket) {
                    if (lstSocket[i].user.id == id) {
                        lstSocket.splice(i, 1);
                    }
                }
                lstSocket.push(socket);
                const chats = await Chat.find({ 'users': id }, { '_id': 1 });

                chats.forEach((item) => {
                    socket.join(item.id);
                });
                socket.emit("Auth-Successfully");
                next();
            } else {
                next(new Error("Socket authentication error"));
            }
        })

        io.on("connection", (socket) => {
            console.log(socket.user.name + "(" + socket.user.id + ")" + " just connected to socket");
            socket.on("disconnect", async () => {
                lstSocket.splice(
                    lstSocket.indexOf(socket), 1
                );
                console.log(socket.user.name + "(" + socket.user.id + ")" + " disconnected");
            });
            // socket.on("User-Send-Request", async (data) => {
            //     const request = {
            //         "sender": socket.user._id,
            //         "receiver": data.receiverId
            //     };
            //     const { receiverUser, rsRequest } = await userController.addFriendRequest(request);
            //     if (receiverUser) {
            //         const rs = {
            //             statusCode: 200,
            //             functionType: 2,
            //             message: "Add Request Succesfully",
            //             payload: {
            //                 id: rsRequest.id,
            //                 sender: {
            //                     id: rsRequest.sender.id,
            //                     name: rsRequest.sender.name
            //                 },
            //                 receiver: {
            //                     id: rsRequest.receiver.id,
            //                     name: rsRequest.receiver.name
            //                 }
            //             }
            //         };

            //         lstSocket.forEach((s) => {
            //             if (s.user._id == data.receiverId) {
            //                 s.emit("Success", rs);
            //             }
            //         });
            //         socket.emit("Success", rs);
            //     } else {
            //         socket.emit("Error", rsSendRequestFail);
            //     }
            // });

            // socket.on("User-Refuse-Request", async (data) => {
            //     const request = await userController.deleteFriendRquest(data.requestId);
            //     if (request) {

            //         const rs = {
            //             statusCode: 200,
            //             functionType: 4,
            //             message: "Remove Request Successfully",
            //             payload: {
            //                 requestsId: data.requestId
            //             }
            //         }

            //         lstSocket.forEach((s) => {
            //             if (String(s.user._id) == String(request.sender)) {
            //                 s.emit("Success", rs);
            //             }
            //         });
            //         socket.emit("Success", rs);
            //     } else {
            //         socket.emit("Error", rsRefuseRequestFail);
            //     }
            // });

            // socket.on("User-Accept-Request", async (data) => {
            //     const request = await userController.deleteFriendRquest(data.requestId);
            //     if (request) {
            //         if (await userController.addFriend(socket.user._id, request.sender)) {
            //             // const user = await User.findOne({'_id':socket.user._id});
            //             const friend = await User.findOne({ '_id': request.sender });

            //             const rsRequest = {
            //                 statusCode: 200,
            //                 functionType: 8,
            //                 message: "Remove Request Successfully",
            //                 payload: {
            //                     requestsId: request.id
            //                 }
            //             };

            //             const rsFriend = {
            //                 statusCode: 200,
            //                 functionType: 7,
            //                 message: "Add Friend Successfully",
            //                 payload: {
            //                     id: socket.user.id,
            //                     name: socket.user.name,
            //                     status: socket.user.status
            //                 }
            //             };

            //             const rsUser = {
            //                 statusCode: 200,
            //                 functionType: 7,
            //                 message: "Add Friend Successfully",
            //                 "payload": {
            //                     id: friend.id,
            //                     name: friend.name,
            //                     status: friend.status
            //                 }
            //             };

            //             lstSocket.forEach((s) => {
            //                 if (String(s.user._id) == String(request.sender)) {
            //                     s.emit("Success", rsRequest);
            //                     s.emit("Success", rsFriend);
            //                 }
            //             });

            //             socket.emit("Success", rsRequest);
            //             socket.emit("Success", rsUser);
            //         } else {
            //             socket.emit("Error", rsAcceptRequestFail);
            //         }
            //     } else {
            //         socket.emit("Error", rsAcceptRequestFail);
            //     }
            // });

            // socket.on("User-Remove-Friend", async (data) => {
            //     if (await userController.deleteFriend(socket.user._id, data.friendId)) {
            //         const rsFriend = {
            //             statusCode: 200,
            //             functionType: 5,
            //             message: "Remove Friend Successfully",
            //             payload: {
            //                 friendId: socket.user.id
            //             }
            //         };
            //         const rsUser = {
            //             statusCode: 200,
            //             functionType: 5,
            //             message: "Remove Friend Successfully",
            //             payload: {
            //                 friendId: data.friendId
            //             }
            //         };
            //         lstSocket.forEach((s) => {
            //             if (String(s.user._id) == String(data.friendId)) {
            //                 s.emit("Success", rsFriend);
            //             }
            //         });
            //         socket.emit("Success", rsUser);
            //     } else {
            //         socket.emit("Error", rsRemoveFriendFail);
            //     }
            // });

            socket.on("User-Send-Message", async (data) => {
                data.sender = socket.user.id;
                const { newMessage, count } = await chatController.addMessage(data);

                // ===========================================User-Create-Chat=============================================================

                if (count == 0) {
                    const chat = await Chat.findOne({ '_id': data.chatId }).populate("users");
                    const rsChat = {};
                    if (chat.type == 0) {
                        const receiver = chat.users[0];
                        const rsChat = {
                            id: chat.id,
                            chatName: chat.chatName,
                            type: chat.type,
                            receiver: {
                                id: receiver.id,
                                name: receiver.name,
                                avatar: receiver.avatar
                            },
                            lastMessage: {
                                id: newMessage.id,
                                type: newMessage.type,
                                content: newMessage.content,
                                recall: newMessage.recall,
                                imageHeight: newMessage.imageHeight,
                                sender: {
                                    id: newMessage.sender.id,
                                    name: newMessage.sender.name
                                },
                                createdAt: newMessage.createdAt
                            }
                        };

                        chat.users.forEach((item) => {
                            lstSocket.forEach((soc) => {
                                if (soc.user.id == item.id) {
                                    soc.join(data.chatId);
                                    soc.emit("User-Create-Chat", rsChat);
                                }
                            });
                        });
                    } else {
                        const rsChat = {
                            id: chat.id,
                            chatName: chat.chatName,
                            type: chat.type,
                            createBy: chat.createBy,
                            lastMessage: {
                                id: newMessage.id,
                                type: newMessage.type,
                                content: newMessage.content,
                                recall: newMessage.recall,
                                imageHeight: newMessage.imageHeight,
                                sender: {
                                    id: newMessage.sender.id,
                                    name: newMessage.sender.name
                                },
                                createdAt: newMessage.createdAt
                            }
                        };

                        chat.users.forEach((item) => {
                            lstSocket.forEach((soc) => {
                                if (soc.user.id == item.id) {
                                    soc.join(data.chatId);
                                    soc.emit("User-Create-Chat", rsChat);
                                }
                            });
                        });

                    }
                }

                //=======================================================User-Send-Message====================================================

                if (newMessage) {
                    const rsMessage = {
                        id: newMessage.id,
                        type: newMessage.type,
                        content: newMessage.content,
                        recall: newMessage.recall,
                        imageHeight: newMessage.imageHeight,
                        // delete: newMessage.delete,
                        // replyMessage: newMessage.reply,
                        sender: {
                            id: newMessage.sender.id,
                            name: newMessage.sender.name,
                            avatar: newMessage.sender.avatar
                        },
                        chatId: newMessage.chat,
                        createdAt: newMessage.createdAt
                    };
                    io.sockets.in(data.chatId).emit("User-Send-Message", rsMessage);
                } else {
                    socket.emit("User-Send-Message", rsSendMessageFail);
                }
            });

            socket.on("User-Add-Member", async (data) => {
                const chatt = await Chat.findOne({ '_id': data.chatId });
                if (!chatt) {
                    console.log("User-Add-Member: Not found chat");
                }
                if (data.usersId.length == 0) {
                    console.log("User-Add-Member: Not users");
                } else {
                    const chat = await Chat.findOne({ '_id': data.chatId });
                    const messages = await Message.find({ 'chat': chat.id }).sort({ createdAt: -1 }).limit(1);
                    const sender = await User.findOne({ '_id': messages[0].sender }, { '_id': 1, 'name': 1 });
                    const lastMess = {
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
                    const rs = {
                        id: chat.id,
                        chatName: chat.chatName,
                        type: chat.type,
                        createBy: chat.createBy,
                        lastMessage: lastMess
                    };
                    for (const i in data.usersId) {
                        if (await chatController.addUserToChat(data.chatId, data.usersId[i]) == 0) {
                            const us = await User.findOne({ '_id': data.usersId[i] }, { 'name': 1 });
                            const msg = new Message({
                                type: 2,
                                content: socket.user.name + " vừa thêm " + us.name + " vào nhóm",
                                chatId: data.chatId,
                                sender: null,
                                chat: data.chatId,
                                sender: socket.user.id
                            });
                            const savedMessage = await msg.save();
                            await Chat.updateOne({ '_id': data.chatId }, { $push: { 'messages': savedMessage.id } });
                            const rsMess = {
                                id: savedMessage.id,
                                type: savedMessage.type,
                                content: savedMessage.content,
                                chatId: savedMessage.chat,
                                createdAt: savedMessage.createdAt
                            }
                            lstSocket.forEach((item) => {
                                if (item.user.id == data.usersId[i]) {
                                    item.join(chat.id)
                                    item.emit("User-Create-Chat", rs); // Thanh Cong
                                }
                            });
                            io.sockets.in(data.chatId).emit("User-Send-Message", rsMess);
                        }
                    }
                }
            });

            socket.on("User-Remove-Member", async (data) => {
                // const user = await User.findOne({ '_id': data.userId });
                // if (!user) {
                //     console.log("Not Found User");
                // }
                // const chatt = await Chat.findOne({ '_id': data.chatId });
                // if (!chatt) {
                //     console.log("Not Found Chat");
                // }
                const chattt = await Chat.findOne({ '_id': data.chatId, 'users': data.userId });
                if (chattt) {
                    if (await chatController.removeUserInChat(data.chatId, data.userId) == 0) {

                        const us = await User.findOne({'_id': data.userId}, {'name': 1});

                        const msg = new Message({
                            type: 2,
                            content: socket.user.name + " vừa loại " + us.name + " khỏi nhóm",
                            chatId: data.chatId,
                            sender: null,
                            chat: data.chatId,
                            sender: socket.user.id
                        });
                        const savedMessage = await msg.save();
                        await Chat.updateOne({ '_id': data.chatId }, { $push: { 'messages': savedMessage.id } });

                        const rsMess = {
                            id: savedMessage.id,
                            type: savedMessage.type,
                            content: savedMessage.content,
                            chatId: savedMessage.chat,
                            createdAt: savedMessage.createdAt
                        }

                        lstSocket.forEach((item) => {
                            if (item.user.id == data.userId) {
                                item.leave(data.chatId);
                                item.emit("User-Remove-Chat", {chatId: data.chatId});
                            }
                        });
                        io.sockets.in(data.chatId).emit("User-Send-Message", rsMess);
                    }
                } else {
                    console.log("User Is Not In Group");
                }
            });

            socket.on("User-Leave-Group", async (data) => {
                const chattt = await Chat.findOne({ '_id': data.chatId, 'users': socket.user.id });
                if (chattt) {
                    if (await chatController.removeUserInChat(data.chatId, socket.user.id) == 0) {
                        const msg = new Message({
                            type: 2,
                            content: socket.user.name + " đã rời khỏi nhóm",
                            chatId: data.chatId,
                            sender: null,
                            chat: data.chatId,
                            sender: socket.user.id
                        });
                        const savedMessage = await msg.save();
                        await Chat.updateOne({ '_id': data.chatId }, { $push: { 'messages': savedMessage.id } });

                        const rsMess = {
                            id: savedMessage.id,
                            type: savedMessage.type,
                            content: savedMessage.content,
                            chatId: savedMessage.chat,
                            createdAt: savedMessage.createdAt
                        }
                        socket.leave(data.chatId);
                        socket.emit("User-Remove-Chat", {chatId: data.chatId});
                        io.sockets.in(data.chatId).emit("User-Send-Message", rsMess);
                    }
                } else {
                    console.log("User Is Not In Group");
                }
            });
            socket.on("User-Select-Admin", async (data) => {
                const chat = await Chat.updateOne({'_id': data.chatId}, {$set: {'createBy': data.userId}});
                if(chat){
                    const us = await User.findOne({'_id': data.userId}, {'name': 1});
                    const msg = new Message({
                        type: 3,
                        content: socket.user.name + " đã chọn " + us.name + " làm nhóm trưởng",
                        chatId: data.chatId,
                        sender: null,
                        chat: data.chatId,
                        sender: socket.user.id
                    });
                    const savedMessage = await msg.save();
                    await Chat.updateOne({ '_id': data.chatId }, { $push: { 'messages': savedMessage.id } });
                    const rsMess = {
                        id: savedMessage.id,
                        type: savedMessage.type,
                        content: savedMessage.content,
                        chatId: savedMessage.chat,
                        createdAt: savedMessage.createdAt,
                        adminId: data.userId
                    };
                    io.sockets.in(data.chatId).emit("User-Send-Message", rsMess);
                }
            });

            socket.on("User-Recall-Message", async (data) => {
                const message = await Message.findOne({ '_id': data.messageId }).populate("chat");
                if (message) {
                    await Message.updateOne({ '_id': data.messageId }, { $set: { content: null, recall: true } });
                    const rs = {
                        messageId: data.messageId,
                        chatId: message.chat.id
                    };
                    io.sockets.in(message.chat.id).emit("User-Recall-Message", rs);
                }
            });

            socket.on("User-Delete-Message", async (data) => {
                const message = await Message.findOne({ '_id': data.messageId });
                if (message) {
                    await Message.updateOne({ '_id': data.messageId }, { $push: { deleteUsers: socket.user.id } });
                    socket.emit(message.chat).emit("User-Delete-Message", { messageId: data.messageId });
                }
            });

        });
    }
};
module.exports = socketio;