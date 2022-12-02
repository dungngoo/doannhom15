const { json } = require("body-parser");
const { User, Chat, Request, Message } = require("../model/model");

const requestController = {
    getAllRequestsOfUser: async (req, res) => {
        try {
            const user = await User.findOne({ '_id': req.body.userId }).populate("friendRequests");

            if(user.friendRequests.length == 0){
                return res.status(404).json({ "statusCode": 404, "message": "Not Found Requests", payload: null });
            }

            const payload = [];

            user.friendRequests.forEach((item) => {
                const d = {
                    id: item.id,
                    senderId: item.sender,
                    receiverId: item.receiver
                };
                payload.push(d);
            });

            return res.status(200).json({ "statusCode": 200, "message": "Get Requests Successfully", payload });

        } catch (error) {
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },
}

module.exports = requestController;