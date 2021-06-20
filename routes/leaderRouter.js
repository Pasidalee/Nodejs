const express=require('express');
const bodyParser=require('body-parser');

const leaderRoute=express.Router();
const Leaders=require('../models/leaders');

leaderRoute.use(bodyParser.json());
var authenticate=require('../authenticate');



leaderRoute.route('/')
.get((req,res,next)=>{
	Leaders.find({})
	.then((leader)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Leaders.create(req.body)
	.then((leader)=>{
		console.log('dish created');
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);		
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	
	res.statusCode=404;
	res.end("put method is not supported. you cannot modify the list");
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Leaders.remove({})
	.then((result)=>{
		res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
		res.json(result);	
	},(err)=>next(err))
	.catch((err)=>next(err));

});



leaderRoute.route('/:leaderId')
.get((req,res,next)=>{
	Dishes.findById(req.params.leaderId)
	.then((leader)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	res.statusCode=404;
	res.end("post method is not supported");
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.findByIdAndUpdate(req.params.leaderId,{$set:req.body},{new:true}).exec()
	.then((leader)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
	Dishes.findByIdAndRemove(req.params.leaderId)
	.then((leader)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=>next(err))
});


module.exports=leaderRoute;