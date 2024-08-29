const express = require('express');
const app = express();
const http = require('http');
const path = require("path");

const socketio = require("socket.io");

const server = http.createServer(app);

const io = socketio(server);

app.set('views', './views');
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    socket.on("send-loaction", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    console.log("connected")
    socket.on("disconnected",function(){
        io.emit("user-disconnected",socket.id);
    })
});

app.get("/", (req, res) => {
    res.render('index');
});

server.listen(3000, () => {
    console.log(`server is listening at 3000`);
});
