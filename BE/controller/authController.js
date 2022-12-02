const { User, Chat, Request, Message } = require("../model/model");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const authController = {
    //Register
    register: async (req, res) => {
        try {
            const u = await User.findOne({ 'phoneNumber': req.body.phoneNumber });
            if (u) {
                return res.status(404).json({ "statusCode": 404, "message": "Phone Number Already In Use", payload: null });
            }
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const newUser = new User({
                phoneNumber: req.body.phoneNumber,
                password: hashed,
                name: req.body.name,
                birthDay: req.body.birthDay,
                gender: req.body.gender,
                avatar: req.body.avatar
            });
            const savedUser = await newUser.save();
            const token = authController.generateAccessToken(savedUser);
            const payload = {
                "id": savedUser.id,
                "phoneNumber": savedUser.phoneNumber,
                "password": savedUser.password,
                "name": savedUser.name,
                "birthDay": savedUser.birthDay,
                "gender": savedUser.gender,
                "avatar": savedUser.avatar,
                "token":  token
            };
            return res.status(200).json({ "statusCode": 200, "message": "Register Successfully", payload });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "5h" }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id
            },
            process.env.JWT_REFRESH_KEY,
            { expiresIn: "180d" }
        );
    },

    login: async (req, res) => {
        try {
            const savedUser = await User.findOne({ phoneNumber: req.body.phoneNumber });
            if (!savedUser) {
                return res.status(404).json({ "statusCode": 404, "message": "Wrong phone number", payload: null });
            }
            const validPassword = await bcrypt.compare(
                req.body.password, savedUser.password
            );
            if (!validPassword) {
                return res.status(404).json({ "statusCode": 404, "message": "Wrong password", payload: null });
            }
            const token = authController.generateAccessToken(savedUser);
            const refreshToken = authController.generateRefreshToken(savedUser);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            const payload = {
                "id": savedUser.id,
                "phoneNumber": savedUser.phoneNumber,
                "password": savedUser.password,
                "name": savedUser.name,
                "birthDay": savedUser.birthDay,
                "gender": savedUser.gender,
                "avatar": savedUser.avatar,
                "token": token
            };
            return res.status(200).json({ "statusCode": 200, "message": "Login Successfully", payload });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ "statusCode": 500, "message": "Internal Server Error: " + error, payload: null });
        }
    },

    requestRefreshToken: async (req, res) => {
        const refreshTK = req.cookies.refreshToken;
        if (!refreshTK) {
            return res.status(401).json({ "statusCode": 401, "message": "You're not authenticated", payload: null });
        }

        jwt.verify(refreshTK, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                return res.status(403).json({ "statusCode": 403, "message": "RefreshToken is invalid", payload: null });
            }

            const newAccessToken = authController.generateAccessToken(user);
            const newRefreshToken = authController.generateRefreshToken(user);

            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameSite: "strict",
            });

            return res.status(200).json({ "statusCode": 200, "message": "Refresh Token Successfully", payload: { accessToken: newAccessToken } });

        })

    },

    logout: async (req, res) => {
        res.clearCookie("refreshToken");
        return res.status(200).json({ "statusCode": 200, "message": "Logout Successfully", payload: null });
    }

}

module.exports = authController;