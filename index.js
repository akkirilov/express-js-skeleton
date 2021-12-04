const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const authRouter = require('./handlers/authHandler');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const config = require('./config/config');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: 'neshto-taino!@#$%',
	resave: false,
	saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.engine('.hbs', handlebars.engine({
        partialsDir: path.join(__dirname, "views/partials"),
        extname: '.hbs',
        defaultLayout: "",
        layoutsDir: "",
    }));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, "/views/"));

app.use(express.static(__dirname + '/public/'));

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    let username = 'anonymous';
    let isLogedIn = false;
    if (req.user) {
    	username = req.user;
    	isLogedIn = true;
	}
    const message = req.session.message;
    req.session.message = '';
    res.render('home/index', {
    	isLogedIn,
        message,
        username
    });
});

function isAuthenticated(req, res, next) {
    if (req.user === undefined) {
        return res.redirect('/auth/login');
    }
    next();
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
