const express = require("express");
const app = express();
const http = require("http");
const morgan = require("morgan"); //Thong bao cac request vao terminal
const mongoose = require("mongoose"); //Ket noi voi mongo
var bodyParser = require("body-parser"); //parse du lieu thanh chuoi Json
const cookieParser = require("cookie-parser");
var cors = require('cors')
const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat");
const authRoute = require("./routes/auth");
const requestRoute = require("./routes/request");
const { Server } = require('socket.io');
const socketio = require("./socketio/socket");

require("dotenv").config();
// Cors
app.use(cors());
const server = http.createServer(app);

mongoose.connect(process.env.MONGODB_URL, () => {
  console.log("Connected to MongoDB");
});

const port = process.env.PORT;


app.use(bodyParser.json({ limit: "50mb" })); //Gioi han dung luong cua chuoi Json
app.use(morgan("common"));
app.use(cookieParser());

//User
app.use("/users", userRoute);

//Chat
app.use("/chats", chatRoute);

//auth
app.use("/auth", authRoute);

//request
app.use("/requests", requestRoute);


// Socket.io

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST"],
    transports: ['websocket', 'polling'],
    credentials: true,
  },
  allowEIO3: true
})

socketio.socketServer(io);

server.listen(port, () => {
  console.log("Server is runing at port " + port);
});
