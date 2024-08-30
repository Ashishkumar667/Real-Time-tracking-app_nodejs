const express = require('express');
const app = express();
const http = require('http');
const path = require("path");
const bcrypt = require('bcrypt');
const DATABASECOLLECTION = require("./mongodb");

const socketio = require("socket.io");

const server = http.createServer(app);

const io = socketio(server);


app.use(express.urlencoded({ extended: false }));
app.set('views', './views');
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

io.on("connection", function (socket) {
    socket.on("send-location", function (data) {
        io.emit("receive-location", { id: socket.id, ...data });
    });
    console.log("connected")
    socket.on("disconnected", function () {
        io.emit("user-disconnected", socket.id);
    })
});



app.get("/", (req, res) => {
    res.render("login")
});

app.get("/signup", (req, res) => {
    res.render("signup")
});

app.post("/signup", async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    //check if the username already exist in the database
    const regstuser = await DATABASECOLLECTION.findOne({ name: data.name }, { password: data.password });

    if (regstuser) {
        res.send('User already registered,try with diff name & password');
    }
    else {
        const hashpassword = await bcrypt.hash(data.password, 10);
        data.password = hashpassword;
        const userdata = await DATABASECOLLECTION.insertMany(data);
        console.log(userdata);
        res.render("thank");

    }
});

// user Login purpose

app.post("/login", async (req, res) => {
    try {
        const checkname = await DATABASECOLLECTION.findOne({ name: req.body.username });
        if (!checkname) {
            res.send("Username cannot found");
        }

        const passwordmatch = await bcrypt.compare(req.body.password, checkname.password);
        if (!passwordmatch) {
            res.send("wrong username or password");
        }
        else {
            res.render("index");
        }
    } catch (error) {
        res.status(500).send("Internal server error");
    }
});

server.listen(3000, () => {
    console.log(`server is listening at 3000`);
});
