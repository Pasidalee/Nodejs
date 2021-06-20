var express = require('express');
const bodyParser=require('body-parser');
var UserRouter = express.Router();
const passport=require('passport');
const User=require('../models/user');
var authenticate=require('../authenticate');

UserRouter.use(bodyParser.json());



UserRouter.get('/',authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  User.find({})
  .then((users)=>{
    res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(users);
  },(err)=>next(err))
  .catch((err)=>next(err));
});

UserRouter.post('/signUp', (req, res, next) => {
    User.register(new User({username:req.body.username}),req.body.password,(err,user)=>{
      if(err){
        res.statusCode=500,
        res.setHeader('Content-Type','application/json');
        res.json({err:err});
      }
      else{
        if(req.body.firstname){
          user.firstname=req.body.firstname;
        }
        if(req.body.lastname){
          user.lastname=req.body.lastname;
        }
        user.save((err,user)=>{
          if(err){
            res.statusCode=500,
            res.setHeader('Content-Type','application/json');
            res.json({err:err});
            return;
          }
          passport.authenticate('local')(req,res,()=>{
            res.statusCode=200,
            res.setHeader('Content-Type','application/json');
            res.json({success:true,status:'Registration Successful!'});
          }); 
        })              
      }
    });
});

UserRouter.post('/login',passport.authenticate('local',{ failureRedirect: '/login' }),(req,res)=>{
  var token=authenticate.getToken({_id:req.user._id});
  res.statusCode=200,
  res.setHeader('Content-Type','application/json');
  res.json({success:true,token:token,status:'Login Successful!'});
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
