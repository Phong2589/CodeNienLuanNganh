const path = require('path');
const express = require('express');
const app = express();
const morgan = require('morgan');
const handlebars = require('express-handlebars');

//new
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.use(cookieParser('secret'));

app.use(session({
        secret : 'something',
        resave :true,
        saveUninitialized: true,
        cookie : {maxAge:null}      
    }));
app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
  })

//body-parser
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

//database
const db = require('./config/db')
db.connect()

app.use(morgan('combined'));
//template engine
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.engine(
    'hbs',
    handlebars({
        extname: '.hbs',
        helpers: {
            sum: function(a,b) {return a+b;},
            equals: function(a,b) {return a==b;},
        }
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//set public
app.use(express.static(path.join(__dirname, 'public/')));


// set view 
app.set('view options', { layout: 'customer' });
app.set('view options', { layout: 'admin' });
app.set('view options', { layout: 'staff' });


//test
require('./util/google')
require('./util/facebook')
const passport = require('passport');
app.use(passport.initialize());
app.use(passport.session());

//
//xac dinh tuyen duong
const route = require('./routes');
route(app);

app.listen(process.env.PORT || 8080);

