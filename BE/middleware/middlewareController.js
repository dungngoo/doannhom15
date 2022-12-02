const jwt = require("jsonwebtoken");

const middlewareController = {

    verifyToken: (req, res, next) => {
            const token = req.headers.token;
        if (token) {
            const accessToken = token.split(" ")[1];
            jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
                if (err) {
                    return res.status(403).json({ "statusCode": 403, "message": "Token is invalid", payload: null });
                }
                req.body.currentUserId = user.id;
                next();
            });
        } else {
            return res.status(401).json({ "statusCode": 401, "message": "You're not authenticated", payload: null });
        }
    },

    socketVerifyToken: (data) => {
        try{
            const accessToken = data.split(" ")[1];
            const rs = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
            return rs.id;
        }catch(err){
            return null;
        }
    },

    socketVerifyAuth: (socket, data) => {
        try {
            if(socket.user._id){
                if(middlewareController.socketVerifyToken(data)){
                    return 0;
                }else{
                    return 1;
                }
            }else{
                return 2;
            }
        } catch (error) {
            return 2;
        }
    }
}

module.exports = middlewareController;