const express = require('express');
require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const cron = require('node-cron');
const fs = require('fs');
const port = process.env.PORT || 8000;


const option = {
    key: fs.readFileSync('/server.key'),
    cert: fs.readFileSync('/server.crt')
};


// Load SSL certificate
const sslCA = fs.readFileSync(path.join(__dirname, 'global-bundle.pem'));

// MongoDB connection string
const mongodbConnectionString = `mongodb://bria:12345678@briaunisexsalon.cluster-cj8kwaosypww.ap-south-1.docdb.amazonaws.com:27017/?tls=true&tlsCAFile=global-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;

// MongoDB connection options
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsCAFile: sslCA,
    replicaSet: 'rs0',
    readPreference: 'secondaryPreferred',
    retryWrites: false,
    serverSelectionTimeoutMS: 60000, // Increase this to a higher value
    socketTimeoutMS: 60000,        // Increase this to a higher value
};

// Connect to MongoDB with retry logic
const connectWithRetry = () => {
    console.log('MongoDB connection with retry');
    mongoose.connect(mongodbConnectionString, options).then(() => {
        console.log('MongoDB is connected');
    }).catch(err => {
        console.log('MongoDB connection unsuccessful, retry after 5 seconds. Error:', err);
        setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

// MongoDB connection events
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');

    // Schedule the cron job to run every 5 minutes after MongoDB is connected
    cron.schedule('* * * * *', scheduleReminder);
});

// CORS options
const corsOptions = {
    origin: function (origin, callback) {
        console.log('Origin:', origin); // Log the origin for debugging
        callback(null, true); // Allow all origins
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Increase the limit for bodyParser
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Schedule Reminder Job
const { scheduleReminder } = require("./cronjob");

// Routes
const booking = require("./router/booking");
const offer = require("./router/offer");
const service = require("./router/service");
const user = require("./router/user");
const dashboard = require("./router/dashboard");
const adminLogin = require("./router/admin");

// Use routes
app.use("/user", user);
app.use("/service", service);
app.use("/offer", offer);
app.use("/booking", booking);
app.use("/dashboard", dashboard);
app.use("/adminLogin", adminLogin);

// Home route
app.get("/", async (req, res) => {
    try {
        res.json("working");
    } catch (error) {
        res.json(error);
    }
});

// Error handling middleware
app.use(function (err, req, res, next) {
    console.error(err.stack); // Log the error stack
    res.status(500).json({ error: 'Something went wrong!', details: err.message });
});

// Start server
// app.listen(port, function () {
//     console.log(`CORS-enabled web server listening on port ${port}`);
// });
https.createServer(option, app).listen(port, () => {
    console.log(`Server is running on https://localhost:${port}`);
});