const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const session = require("express-session");
const authorization = require("./middleware/auth");
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

//setting up configuration for flash
const port = process.env.PORT || 8000;

//Setup for rendering static pages
//for static page
const static_path = path.join(__dirname, "../public");
app.use(express.static(static_path));
//     or
// app.use(express.static("public"));

// using dotenv module for environment
require("dotenv").config();

//Setting EJS view engine
app.set("view engine", "ejs");
//setting jwt
app.set("jwtTokenSecret", process.env.JWT_SECRET);

require("./db/conn");
const { Console } = require("console");

//body parser

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

//setting up methods
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//flash part==================={use to display success or error in coloured manner}
app.use(cookieParser("secret_passcode"));
app.use(
  session({
    secret: "secret_passcode",
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use((req, res, next) => {
    res.locals.flashMessages = req.flash();
    next();
  });
 
//Routes===========================================
var userRoutes = require("../routes/user");
app.use("/user", userRoutes);

//socket
var users={};
io.on("connection", (socket) => {
    // console.log("socket Connected...")
    socket.on("new-user-joined", (username) => {
        users[socket.id]=username;
        // console.log(users);
        //calling a function for showing user connected user
        socket.broadcast.emit('user-connected',username);
    });
  //for disconnected user
  socket.on("disconnect",()=>{
    socket.broadcast.emit('user-disconnected',user=users[socket.id]);
    delete users[socket.id];
  })
  //sending message
  socket.on('message',(data)=>{
  socket.broadcast.emit("message",{user:data.user,msg:data.msg})
  })
});
//routing portion

app.get("/", (req, res) => {
    res.send('welcome to opening page ,it will show initially');
  });
  
  http.listen(port, () => {
    console.log(`server is running at port ${port}`);
})
//   app.listen(port, () => {
//     console.log(`server is running at port ${port}`);
//   });
  