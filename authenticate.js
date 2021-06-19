var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var User=require('./models/user');

passport.use(User.createStrategy()); //passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());