var express = require('express');
const bodyParser=require('body-parser');
var UserRouter = express.Router();
const passport=require('passport');

const User=require('../models/user');

UserRouter.use(bodyParser.json());

UserRouter.get('/signUp', (req, res, next) => {
  res.send('respond with a resource');
});

UserRouter.post('/signUp', (req, res, next) => {
    User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
      if(err){
        res.statusCode=500,
        res.setHeader('Content-Type','application/json');
        res.json({err:err});
      }
      else{
        passport.authenticate('local')(req,res,()=>{
          res.statusCode=200,
          res.setHeader('Content-Type','application/json');
          res.json({success:true,status:'Registration Successful!'});
        });       
      }
    });
});

UserRouter.post('/login',passport.authenticate('local',{ failureRedirect: '/login' }),(req,res)=>{
  res.statusCode=200,
  res.setHeader('Content-Type','application/json');
  res.json({success:true,status:'Login Successful!'});
});

UserRouter.get('/logout',(req,res,next)=>{
    if(req.session){
      req.session.destroy();
      res.clearCookie('session-id');
      res.redirect('/');
    }
    else{
      var err=new Error('You are nnot logged in');
      err.status=403;
      next(err);
    }
});

module.exports = UserRouter;
