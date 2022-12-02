const chatController = require("../controller/chatController");
const router = require("express").Router();
const middlewareController = require("../middleware/middlewareController");

//Get all chat
// router.get("/", middlewareController.verifyToken, chatController.getAllChats);

//Get a chat by id
router.get("/:id", middlewareController.verifyToken, chatController.getChatById);

//Get chats by user id
router.get("/", middlewareController.verifyToken, chatController.getAllChatOfUser);

//Get Chat By Other User Id
router.get("/getByOtherUser/:otherUserId", middlewareController.verifyToken, chatController.getChatWithOtherUserId);

//Get All Message By Chat Id
router.get("/messages/:chatId", middlewareController.verifyToken, chatController.getAllMessageByChatId);

//Add a chat
router.post("/", middlewareController.verifyToken, chatController.addChat);

module.exports = router;