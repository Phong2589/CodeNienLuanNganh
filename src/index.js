const path = require('path');
const express = require('express');
const app = express();

const morgan = require('morgan');
const handlebars = require('express-handlebars');

//new
// const cookieParser = require('cookie-parser');
// const session = require('express-session');

// const flash = require('express-flash');

// app.use(cookieParser('keyboard cat'));
// app.use(session({ cookie: { maxAge: 60000 }}));
// app.use(flash());
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
    }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));

//set public
app.use(express.static(path.join(__dirname, 'public/')));


// set view 
app.set('view options', { layout: 'customer' });

//xac dinh tuyen duong
const route = require('./routes');
route(app);



app.listen(process.env.PORT || 8080);

