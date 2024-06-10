const express = require('express')
require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000;
const db_name = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;

// middleware connection
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${db_name}:${password}@cluster0.6oyupqe.mongodb.net/bria_unisex_salon`, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

app.get("/", async (req, res) => {
    try {
        res.json("working")
    } catch (error) {
        res.json(error)
    }
})

// router import
const booking = require("./router/booking");
const offer = require("./router/offer");
const service = require("./router/service");
const user = require("./router/user");
const dashboard = require("./router/dashboard")

// middleware connection
app.use("/user", user);
app.use("/service", service);
app.use("/offer", offer);
app.use("/booking", booking);
app.use("/dashboard", dashboard);

// Error handling middleware
app.use(function (err, req, res, next) {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(port, function () {
    console.log(`CORS-enabled web server listening on port ${port}`)
})