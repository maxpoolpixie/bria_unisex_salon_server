const express = require('express')
require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()
const fetch = require('node-fetch');
const cron = require('node-cron');
const port = process.env.PORT || 8000;
const db_name = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;


// middleware connection
// Configure CORS
const corsOptions = {
    origin: 'http://your-frontend-domain.com', // replace with your front-end URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // Enable this if you need to send cookies with CORS requests
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Increase the limit for bodyParser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

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