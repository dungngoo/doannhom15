const { json } = require("body-parser");
const { User, Chat, Request, Message } = require("../model/model");

const userController = {

    //Get Method==================================================================================================

    getAllUser: async (req, res) => {
        try {
            const users = await User.find({}, { 'friends': 0, 'friendRequests': 0, 'chats': 0 });
            return res.status(200).json({ "statusCode": 200, "message": "Get Users Successfully", payload: { user: { users } } });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    getUserById: async (req, res) => {
        try {
            const user = await User.findById(req.params.id);

            if (!user) {
                return res.status(404).json({ "statusCode": 404, "message": "Not Found User", "payload": null });
            }

            const payload = {
                id: user.id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                birthDay: user.birthDay,
            }

            return res.status(200).json({ "statusCode": 200, "message": "Get User Successfully", payload });

        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    getUserByPhoneNumber: async (req, res) => {
        try {
            const user = await User.findOne({ phoneNumber: (req.params.phone) });

            if (!user) {
                return res.status(404).json({ "statusCode": 404, "message": "Not Found User", "payload": null });
            }

            const payload = {
                id: user.id,
                phoneNumber: user.phoneNumber,
                name: user.name,
                birthDay: user.birthDay,
                avatar: user.avatar
            }

            return res.status(200).json({ "statusCode": 200, "message": "Get User Successfully", payload });
        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    getUserByChatId: async (req, res) => {
        try {
            const chat = await Chat.findById(req.params.chatId);
            const users = await User.find({ '_id': chat.users });
            const payload = [];
            users.forEach((item) => {
                const d = {
                    id: item.id,
                    name: item.name,
                    avatar: item.avatar
                }
                payload.push(d);
            });
            if (payload.length == 0) {
                return res.status(404).json({ "statusCode": 404, "message": "Not Found Users", "payload": null });
            }
            return res.status(200).json({ "statusCode": 200, "message": "Get Users Successfully", payload });
        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    getFriendsOfUser: async (req, res) => {
        try {
            const user = await User.findOne({ '_id': req.body.currentUserId }).populate("friends");
            const payload = [];
            if (user.friends.length == 0) {
                return res.status(404).json({ "statusCode": 404, "message": "Not Found Friends", "payload": null });
            }

            user.friends.forEach((item) => {
                const a = {
                    id: item.id,
                    name: item.name
                };
                payload.push(a);
            });

            return res.status(200).json({ "statusCode": 200, "message": "Get Friends Successfully", payload });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    getUsersByTextSearch: async (req, res) => {
        try {
            const lst = await User.find({ $text: { $search: req.params.searchString } });

            if (lst.length == 0) {
                return res.status(404).json({ "statusCode": 404, "message": "Not Found Users", "payload": null });
            }

            const payload = [];

            lst.forEach((item) => {
                if (item.id != req.body.currentUserId) {
                    const a = {
                        id: item._id,
                        phoneNumber: item.phoneNumber,
                        name: item.name,
                        birthDay: item.birthDay,
                        gender: item.gender,
                        avatar: item.avatar
                    };
                    payload.push(a);
                }
            });

            return res.status(200).json({ "statusCode": 200, "message": "Get Users Successfully", payload });
        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },
    //Post Method==================================================================================================

    // addUser: async (req, res) => {
    //     try {
    //         const newUser = new User(req.body);
    //         const savedUser = await newUser.save();
    //         const token = await savedUser.generateAuthToken();
    //         res.status(200).send({ savedUser, token });
    //     } catch (err) {
    //         res.status(500).send(err);
    //     }
    // },

    addFriend: async (userId, friendId) => {
        try {
            await User.updateOne({ '_id': userId }, { $push: { friends: friendId } });
            await User.updateOne({ '_id': friendId }, { $push: { friends: userId } });

            return true;
        } catch (error) {
            return false;
        }
    },

    addFriendRequest: async (request) => {
        try {
            const receiverUser = await User.findOne({ '_id': request.receiver });
            if (!receiverUser) {
                throw new Error();
            }
            const newRequest = new Request(request);
            const saveRequest = await newRequest.save();
            await User.updateOne({ '_id': request.sender }, { $push: { 'friendRequests': saveRequest._id } });
            await User.updateOne({ '_id': request.receiver }, { $push: { 'friendRequests': saveRequest._id } });
            const savedRequest = await Request.findOne({ '_id': saveRequest.id }).populate("sender").populate("receiver");
            const rsRequest = {
                id: savedRequest.id,
                sender: {
                    id: savedRequest.sender.id,
                    name: savedRequest.sender.name
                },
                receiver: {
                    id: savedRequest.receiver.id,
                    name: savedRequest.receiver.name
                }
            };
            return { receiverUser, rsRequest };
        } catch (error) {
            return null;
        }
    },


    //Update Method==================================================================================================

    updateUser: async (req, res) => {

        try {
            const user = req.body;
            await User.updateOne({ '_id': req.body.currentUserId }, {
                $set: {
                    name: user.name,
                    gender: user.gender,
                    avatar: user.avatar
                }
            });
            return res.status(200).json({ "statusCode": 200, "message": "Update User Successfully", payload: null });
        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    //Delete Method=====================================================================================================

    deleteUser: async (req, res) => {
        try {
            await User.deleteOne({ '_id': req.params.id });
            return res.status(200).json("Successfully deleted a user");
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    deleteFriendRquest: async (requestId) => {
        try {
            const request = await Request.findOne({ '_id': requestId });
            if (request) {
                await User.updateOne({ '_id': request.sender }, { $pull: { 'friendRequests': request._id } });
                await User.updateOne({ '_id': request.receiver }, { $pull: { 'friendRequests': request._id } });
                await Request.deleteOne({ '_id': requestId });
                return request;
            } else {
                return null;
            }
        } catch (error) {
            return null;
        }
    },

    deleteFriend: async (userId, friendId) => {
        try {
            const user = await User.findOne({ '_id': userId, 'friends': friendId });
            if (user) {
                await User.updateOne({ '_id': userId }, { $pull: { 'friends': friendId } });
                await User.updateOne({ '_id': friendId }, { $pull: { 'friends': userId } });
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.log(error);
            return false;
        }
    }
};
module.exports = userController;