// modules =================================================
require('dotenv').config('');
var userRoutes = require('./routes/userAccount.routes');
var phoneListRoutes = require('./routes/phoneList.routes');
var path = require('path');
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var cors = require('cors');
const cookieParser = require("cookie-parser");


var app = express();
var port = process.env.PORT || 5000;


//app.set('views', path.join(__dirname,'/app/views'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

// app.use(cors());
app.use(
    cors({
      origin: [
        "http://localhost:3000",
      ],
      credentials: true,
    })
  );
app.use(express.json());
app.use(cookieParser());

app.use(session({
    secret: 'ssshhhhh',
    cookie: {maxAge: 60000},
    resave: true,
    saveUninitialized: true
}));


app.use('/account',userRoutes);
app.use('/home',phoneListRoutes);

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });



//profile 
var profileRoutes = require('./routes/profileEdit.js');
app.use('/profile',profileRoutes);


//Mongo SetUp
var mongoose = require('mongoose');
// const local_url = 'mongodb://localhost/phonezone';
                                      //skip warning :)
mongoose.connect(process.env.CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true}) 
  .then(() => app.listen(port, () => console.log(`Server running on port: ${port}, and connected to DB`) ))
  .catch((error) =>console.log(error.message));

// make sure we do not get any warnings
mongoose.set('useFindAndModify', false);




