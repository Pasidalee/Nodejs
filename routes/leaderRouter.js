const express=require('express');
const bodyParser=require('body-parser');

const leaderRoute=express.Router();
const Leaders=require('../models/leaders');

leaderRoute.use(bodyParser.json());



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
.post((req,res,next)=>{
	Leaders.create(req.body)
	.then((leader)=>{
		console.log('dish created');
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);		
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.put((req,res,next)=>{
	
	res.statusCode=404;
	res.end("put method is not supported. you cannot modify the list");
})
.delete((req,res,next)=>{
	Leaders.remove({})
	.then((result)=>{
		res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
		res.json(result);	
	},(err)=>next(err))
	.catch((err)=>next(err));

});



dishRoute.route('/:leaderId')
.get((req,res,next)=>{
	Dishes.findById(req.params.leaderId)
	.then((leader)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.post((req,res,next)=>{
	res.statusCode=404;
	res.end("post method is not supported");
})
.put((req,res,next)=>{
	Dishes.findByIdAndUpdate(req.params.leaderId,{$set:req.body},{new:true}).exec()
	.then((leader)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.delete((req,res,next)=>{
	Dishes.findByIdAndRemove(req.params.leaderId)
	.then((leader)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(leader);
	},(err)=>next(err))
});


module.exports=leaderRoute;