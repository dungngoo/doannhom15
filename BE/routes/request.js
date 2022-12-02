const requestController = require("../controller/requestController");
const middlewareController = require("../middleware/middlewareController");

const router = require("express").Router();

//Get All User
router.get("/", middlewareController.verifyToken, requestController.getAllRequestsOfUser);

module.exports = router;