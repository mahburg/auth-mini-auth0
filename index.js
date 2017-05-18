const express = require('express'),
    session = require('express-session'),
    passport = require('passport'),
    Auth0Strategy = require('passport-auth0'),
    config = require('./config');

const app = express();
const port = 3000;
app.use(session(config.session));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new Auth0Strategy({
    domain: 'grubham.auth0.com',
    clientID: 'u00_qDbrHpgACyndcjr-WJSpVXIKPWiE',
    clientSecret: 'vvZ_ra8vo2lTwc4NYn4nq0M40uoJk_-fU00V5bA7T1vUk_XaZb1WqaKpe-mI8BSV',
    callbackURL: '/auth/callback'
}, function (accessToken, refreshToken, extraParams, profile, done) {
    //Normally find user in DB then invoke done
    return done(null, profile);
}));


app.get('/auth', passport.authenticate('auth0'));


app.get('/auth/callback',
    passport.authenticate('auth0', {successRedirect: '/me',failureRedirect:'/failed_login'}), function (req,res) {
        res.status(200).send(req.user);
    });

passport.serializeUser(function (user, done) {//this gets whatever new Auth0Strategy is returning
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
})

app.get('/me', function (req,res) {
    res.send(req.user);
})

app.listen(port, () => {
    console.log('Listening on port:' + port)
});