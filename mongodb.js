const mongoose = require('mongoose');
require('dotenv').config();
const connect = mongoose.connect(process.env.MONGO_URL);//mongodb connection


connect.then(() => {
    console.log("Database Connected Successfully");
})
.catch(() => {
    console.log("Database cannot be Connected");
})

// Create Schema
const Login = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


const DATABASECOLLECTION = new mongoose.model("tracking", Login);

module.exports = DATABASECOLLECTION;