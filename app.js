var express       = require('express'),
    morgan        = require('morgan'),
    path          = require('path'),
    mongoose      = require('mongoose'),
    bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser');
    // dotEnv     = ('dotenv').config();

// Define new Express app
var app = express();

app.use(morgan('dev'));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'client/public/views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static('client/public'));

// Routing
var indexRouter     = require('./server/routes/index.js');
var apiUsersRouter  = require('./server/routes/api/users.js');
var apiAuthRouter   = require('./server/routes/api/auth.js');

app.use('/', indexRouter);
app.use('/api/users', apiUsersRouter);
app.use('/api/auth', apiAuthRouter);


app.listen( 8080, function() {
  console.log("project 3 on 8080");
});
