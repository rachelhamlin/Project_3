var dotenv        = require('dotenv').config(),
    express       = require('express'),
    morgan        = require('morgan'),
    path          = require('path'),
    mongoose      = require('mongoose'),
    bodyParser    = require('body-parser'),
    cookieParser  = require('cookie-parser');

// Define new Express app
var app = express();

app.use(morgan('dev'));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'client/public/views'));

// Connect to Heroku DB or local DB
var db = process.env.MONGODB_URI || "mongodb://localhost/project_3";
mongoose.connect(db);

// Include body-parser and cookie-parser
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

// Set the Port number for Heroku or ocal
var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Project 3 on: " + port);
});
