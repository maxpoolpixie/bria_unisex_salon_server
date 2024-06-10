const mongoose = require("mongoose");

// creating schema
const adminSchema =  mongoose.Schema({
    email:{
        type: String
    },
    password:{
        type: String
    }
})

// creating model
const Admin = new mongoose.model("Admin", adminSchema);

module.exports = Admin;