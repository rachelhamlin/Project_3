var express    = require('express'),
    morgan     = require('morgan'),
    path       = require('path'),
    mongoose   = require('mongoose'),
    bodyParser = require('body-parser');
    // dotEnv     = ('dotenv').config();

var app = express();

app.use(morgan('dev'));
app.set('view engine', 'ejs');

app.set('views', path.join(__dirname, 'client/public/views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('client/public'));

var indexRouter = require('./server/routes/index.js')

app.use('/', indexRouter);

app.listen( 8080, function() {
  console.log("project 3 on 8080");
});
