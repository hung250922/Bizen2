require('dotenv').config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
var passport = require('passport');
var expressSession = require('express-session');
const basicAuth = require("express-basic-auth");
const https = require("https");
var fs = require('fs');
const moment = require('moment');

const app = express();
const router = express.Router();
const { connectDB } = require('./mongodb');

app.use(cors());
// app.use(bodyParser.json());
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));
app.use('/api', router);
app.use('', router);
// app.use(bodyParser.urlencoded({ extended: true ,limit:'50mb'}));


// use passport
// app.use(passport.initialize());
// app.use(passport.session());

app.use(express.static("public"));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Headers", "*");
    res.header("*", "*");
    next();
});

/////////////////////////////////////////

// // test them 1 xiu ve cookie-parser
// var cookieParser = require('cookie-parser');
// app.use(cookieParser('82e4e438a0705fabf61f9854e3b575af'));

require('./routes/authorizeRoutes')(router);
require('./routes/userRoutes')(router);
require('./routes/larkSuiteRoutes')(router);
require('./routes/bizencateringRoutes')(router);
require('./routes/exportExcelFileRoutes')(router);
require('./routes/kiemthu3BuocRoutes')(router);

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));

    const path = require('path');
}

const PORT = process.env.PORT || 4130;

app.listen(PORT, async () => {
    console.log("---- process.env.DATABASE_URL", process.env.DATABASE_URL);
    connectDB(process.env.DATABASE_URL).catch(err => console.log('Database connection error:', err));

    console.log(`app running on port ${PORT}`);
});