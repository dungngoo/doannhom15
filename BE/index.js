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
const multer = require("multer");
const { memoryStorage } = require("multer");
const middlewareController = require("./middleware/middlewareController");
const { getUserPresignedUrls, uploadToS3 } = require("./s3.js");
// const AWS = require('aws-sdk');
// var s3 = new AWS.S3({ apiVersion: '2006-03-01' });
// const config = new AWS.Config({
//   accessKeyId: 'AKIATQZP6D7EDCR432W4',
//   secretAccessKey: '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',
//   region: 'ap-southeast-1',
// })
// AWS.config = config;
// const { v4: uuid } = require('uuid');
// const path = require('path');
// const { getUserPresignedUrls, uploadToS3 } = require("./s3");
// const docClient = new AWS.DynamoDB.DocumentClient();
// const storage = multer.memoryStorage({
//   destination(req, file, callback) {
//     callback(null, "");
//   }
// })
// const upload = multer({
//   storage,
//   limits: { fileSize: 2000000 },
//   fileFilter(req, file, cb) {
//     checkTilefype(file, cb)
//   }
// })
//model
// const { User, Chat, Request, Message } = require("./model/model");
// const { uploadToS3, getImageKeyByUser, getUserPresignedUrls } = require("./s3.js");
const storage = memoryStorage();
const upload = multer({ storage });


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
// post


// function checkTilefype(file, cb) {
//   const fileTypes = /jpeg|jpg|png|gif/;

//   const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
//   const minetype = fileTypes.test(file.mimetype);
//   if (extname && minetype) {
//     return cb(null, true);
//   }
//   return cb("Error: Image only")
// }





// app.post("/images", upload.single("image"), (req, res) => {
//   const { file } = req;
//   const user = req.headers["x-user-id"];
//   console.log(user);
//   console.log(file);
//   if (!file || !user) return res.status(400).json({ message: "Bad request" });

//   const { error, key } = uploadToS3({ file, user });
//   if (error) return res.status(500).json({ message: error.message });
//   return res.status(201).json({ key });
// });

// app.get("/images", async (req, res) => {
//   const user = req.headers["x-user-id"];
//   if(user)
//   return res.send("thanh công");
// });

server.listen(port, () => {
  console.log("Server is runing at port " + port);
});

// const CLOUD_FRONT_URL = 'https://da48l8u6cc7lx.cloudfront.net';
// app.get('/', (req, res) => {
//   const params = {
//     Bucket: "uploads3-toturial-bucket12",
//     Key: filePath,
//     Body: req.file.buffer
//   }
//   s3.scan(params, (err, data) => {
//     if (err) {
//       res.send("Loi");
//     } else {
//       return res.send({ item: data.Items })
//     }
//   })
// })


// app.post('/images', upload.single('image'), (req, res) => {
//   const image = req.file.originalname.split(".");
//   const fileType = image[image.length - 1];
//   const filePath = `${uuid() + Date.now().toString()}.${fileType}`;
//   const params = {
//     Bucket: "uploads3-toturial-bucket12",
//     Key: filePath,
//     Body: req.file.buffer
//   }

//   s3.upload(params, (err, data) => {
//     if (err) {
//       console.log(err);
//       return req.send("Loi");
//     } else {
//       const newItem = {
//         Item: {
//           "image_url": `${CLOUD_FRONT_URL}/${filePath}`
//         }
//       }
//       if (err) return res.send(err);
//       if (newItem.Item) return res.send({ item: newItem.Item });
//       console.log(data);
//     }
//   })
// })
// app.get("/images", (req, res) => {
//   const image = req.file.originalname.split(".");
//   const fileType = image[image.length - 1];
//   const filePath = `${uuid() + Date.now().toString()}.${fileType}`;
//   const newItem = {
//     Item: {
//       "image_url": `${CLOUD_FRONT_URL}/${filePath}`
//     }
//   }
//   if (err) return res.send(err);
//   if (newItem.Item) return res.status(401).json({ item: newItem.Item });
// })