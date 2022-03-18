const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const errorHandler = require('./middleware/errors');
const connectDB = require('./config/db.js');


var util = require('util');
var encoder = new util.TextEncoder('utf-8');


//Load env vars
dotenv.config({ path: './config/config.env' });

// Connect to database
connectDB();



// Route files
const bootcamps = require('./routes/bootcamps');

const app = express();
app.use(express.json());



// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}


// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler);




const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`server running in ${process.env.NODE_ENV}`.yellow.bold));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`ERROR : ${err.message}`.red);

    // Close server & exit process
    server.close(() => process.exit(1));
})