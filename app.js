const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const User = require('./models/user');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/AuthDemo')
    .then(() => {
        console.log('DB connected');
    })
    .catch((err) => {
        console.log("Error in connection with Mongo");
        console.log(err);
    })
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "notagoodsecret" }));

const verifyLogin = (req, res, next) => {
    if (!req.session.User_id) {
        return res.redirect('/login');
    }
    next();
}

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const newUser = new User({
        username, password
    })
    await newUser.save();
    res.redirect('/login');
})

app.get('/login', (req, res) => {
    res.render('login');
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if (foundUser) {
        req.session.User_id = foundUser._id;
        res.redirect('/secret')
    }
    else {
        res.redirect('/secret')
    }
})

app.post('/logout', (req, res) => {
    req.session.User_id = null;
    res.redirect('/login');
})

app.get('/secret', verifyLogin, (req, res) => {
    res.render('secret');
})

app.get('/topsecret', verifyLogin, (req, res) => {
    res.send("This is top Secret");
})

app.listen('4000', () => {
    console.log("Serving your app");
})
