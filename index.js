const express = require('express')
require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors')
const app = express()
const path = require('path');
const fetch = require('node-fetch');
const cron = require('node-cron');
const port = process.env.PORT || 8000;
const db_name = process.env.DB_NAME;
const password = process.env.DB_PASSWORD;


// middleware connection
// Configure CORS
const corsOptions = {
    origin: function (origin, callback) {
        console.log('Origin:', origin); // Log the origin for debugging
        callback(null, true); // Allow all origins
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Increase the limit for bodyParser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

const {scheduleReminder} = require("./cronjob");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 60000, // Increase this to a higher value
    socketTimeoutMS: 60000,        // Increase this to a higher value
};

// Connect to MongoDB
mongoose.connect(`mongodb+srv://${db_name}:${password}@cluster0.6oyupqe.mongodb.net/bria_unisex_salon`, options);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');

    // Schedule the cron job to run every 5 minutes after MongoDB is connected
    cron.schedule('* * * * *', scheduleReminder);
});

const connectWithRetry = () => {
    console.log('MongoDB connection with retry');
    mongoose.connect(`mongodb+srv://${db_name}:${password}@cluster0.6oyupqe.mongodb.net/bria_unisex_salon`, options).then(() => {
        console.log('MongoDB is connected');
    }).catch(err => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds.');
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

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
const adminLogin = require("./router/admin")

// middleware connection
app.use("/user", user);
app.use("/service", service);
app.use("/offer", offer);
app.use("/booking", booking);
app.use("/dashboard", dashboard);
app.use("/adminLogin", adminLogin);

// Error handling middleware
app.use(function (err, req, res, next) {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

app.listen(port, function () {
    console.log(`CORS-enabled web server listening on port ${port}`)
})