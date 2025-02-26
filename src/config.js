const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Login-tut")
    .then(() => console.log("Database connected Successfully"))
    .catch(() => console.log("Database cannot be connected"));

const LoginSchema = new mongoose.Schema({
    username: {  // ✅ Ensure it's 'username' (not 'name')
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const collection = mongoose.model("user", LoginSchema);
module.exports = collection;
