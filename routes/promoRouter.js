const express=require('express');
const bodyParser=require('body-parser');
const promotionRoute=express.Router();
const mongoose=require('mongoose');
const Promotions=require('../models/promotions');
var authenticate=require('../authenticate');

promotionRoute.use(bodyParser.json());



promotionRoute.route('/')
.get((req,res,next)=>{
	Promotions.find({})
	.then((promotions)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promotions);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Promotions.create(req.body)
	.then((promotion)=>{
		console.log('dish created');
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promotion);		
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	
	res.statusCode=404;
	res.end("put method is not supported. you cannot modify the list");
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Promotions.remove({})
	.then((result)=>{
		res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
		res.json(result);	
	},(err)=>next(err))
	.catch((err)=>next(err));

});



promotionRoute.route('/:promoId')
.get((req,res,next)=>{
	Dishes.findById(req.params.promoId)
	.then((promotion)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promotion);
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode=404;
	res.end("post method is not supported");
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.findByIdAndUpdate(req.params.promoId,{$set:req.body},{new:true}).exec()
	.then((promotion)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promotion);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.findByIdAndRemove(req.params.promoId)
	.then((promotion)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(promotion);
	},(err)=>next(err))
});



module.exports=promotionRoute;