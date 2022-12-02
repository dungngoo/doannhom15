const userController = require("../controller/userController");
const middlewareController = require("../middleware/middlewareController");

const router = require("express").Router();

//Get All User
router.get("/", middlewareController.verifyToken, userController.getAllUser);

//Get user by id
router.get("/:id", middlewareController.verifyToken, userController.getUserById);

//Get user by phoneNumber
router.get("/phoneNumber/:phone", middlewareController.verifyToken, userController.getUserByPhoneNumber);

//Get user by chat id
router.get("/getByChat/:chatId", middlewareController.verifyToken, userController.getUserByChatId);

//Get friend by User id
router.get("/friends/getAllFriends", middlewareController.verifyToken, userController.getFriendsOfUser);

//Get User By Phone Or Name
router.get("/search/:searchString", middlewareController.verifyToken, userController.getUsersByTextSearch);

//Update User
router.put("/updateInfo", middlewareController.verifyToken, userController.updateUser);

//Delete User
router.delete("/:id", middlewareController.verifyToken, userController.deleteUser);

module.exports = router;