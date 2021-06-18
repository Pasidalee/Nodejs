var express = require('express');
const bodyParser=require('body-parser');
var UserRouter = express.Router();

const Users=require('../models/user');

UserRouter.use(bodyParser.json());

UserRouter.get('/signUp', (req, res, next) => {
  res.send('respond with a resource');
});

UserRouter.post('/signUp', (req, res, next) => {
    Users.findOne({username:req.body.username})
    .then((user)=>{
      if(user!=null){
        var err=new Error('User '+req.body.username+' already exists');
        err.status=403;
        next(err);
      }
      else{
        return Users.create({
          username:req.body.username,
          password:req.body.password
        });
      }
    })
    .then((user)=>{
      res.statusCode=200,
      res.setHeader('Content-Type','application/json');
      res.json({status:'Registration Successful!',user:user});
    },(err)=>next(err))
    .catch((err)=>next(err));
});

UserRouter.post('/login',(req,res,next)=>{
  if(!req.session.user){
      var authHeader=req.headers.authorization;

      if(!authHeader){
        var err= new Error("You are not authenticated");
        res.setHeader('WWW-Authenticate','Basic');
        err.status=401;
        return next(err);
      }

      var auth=new Buffer.from(authHeader.split(' ')[1],'base64').toString().split(':');

      var userName=auth[0];
      var password=auth[1];

      Users.findOne({username:userName})
      .then((user)=>{
        if(user===null){
          var err=new Error('User '+req.body.username+' does not exists');
          err.status=403;
          next(err);
        }
        else if(user.password!==password){
          var err=new Error('password is incorrect');
          err.status=403;
          next(err);
        }
        else if(user.username===userName && user.password===password){
          req.session.user='authenticated';
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.end('You are authenticated!');
        }
      })
      .catch((err)=>next(err));
     

  }
  else{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.end('you are already logged in');

  }
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
