const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const Dishes=require('../models/dishes');
const dishRoute=express.Router();
const authenticate=require('../authenticate');

dishRoute.use(bodyParser.json());

dishRoute.route('/')
.get((req,res,next)=>{
	Dishes.find({})
	.then((dishes)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dishes);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	Dishes.create(req.body)
	.then((dish)=>{
		console.log('dish created');
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dish);		
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.put(authenticate.verifyUser,(req,res,next)=>{
	
	res.statusCode=404;
	res.end("put method is not supported. you cannot modify the list");
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Dishes.remove({})
	.then((result)=>{
		res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
		res.json(result);	
	},(err)=>next(err))
	.catch((err)=>next(err));

});



dishRoute.route('/:dishId')
.get((req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dish);
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.post(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=404;
	res.end("post method is not supported");
})
.put(authenticate.verifyUser,(req,res,next)=>{
	Dishes.findByIdAndUpdate(req.params.dishId,{$set:req.body},{new:true}).exec()
	.then((dish)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dish);
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Dishes.findByIdAndRemove(req.params.dishId)
	.then((dish)=>{
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dish);
	},(err)=>next(err))
});

dishRoute.route('/:dishId/comments')
.get((req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null){
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dish.comments);
		}
		else{
			err=new Error("Dish with the dish Id"+req.params.dishId+"not found");
			err.statusCode=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null){
		dish.comments.push(req.body);
		dish.save()
		.then((dish)=>{
			res.statusCode=200;
			res.setHeader('Content-Type','application/json');
			res.json(dish);
		},(err)=>next(err));
		}
		else{
			err=new Error("Dish with the dish Id"+req.params.dishId+"not found");
			err.statusCode=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.put(authenticate.verifyUser,(req,res,next)=>{
	
	res.statusCode=404;
	res.end("put method is not supported. you cannot modify the list");
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish !=null){
			for(var i=dish.comments.length-1;i>=0;i--){
				dish.comments.id(dish.comments[i]._id).remove();
			}
			dish.save()
			.then((dish)=>{
				res.statusCode=200;
				res.setHeader('Content-Type', 'application/json');
				res.json(dish);
			},(err)=>next(err));	
		}
		else{
			err=new Error("Dish with the dish Id"+req.params.dishId+"not found");
			err.statusCode=404;
			return next(err);
		}	
	},(err)=>next(err))
	.catch((err)=>next(err));

});



dishRoute.route('/:dishId/comments/:commentId')
.get((req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null && dish.comments.id(req.params.commentId)!=null){
		res.statusCode=200;
		res.setHeader('Content-Type','application/json');
		res.json(dish.comments.id(req.params.commentId));
		}
		else if(dish==null) {
			err=new Error("Dish with the dish Id"+req.params.dishId+"not found");
			err.statusCode=404;
			return next(err);
		}
		else {
			err=new Error("comment with the comment Id"+req.params.commentId+"not found");
			err.statusCode=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));

})
.post(authenticate.verifyUser,(req,res,next)=>{
	res.statusCode=404;
	res.end("post method is not supported");
})
.put(authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null && dish.comments.id(req.params.commentId)!=null){
			if(req.body.rating){
				dish.comments.id(req.params.commentId).rating=req.body.rating;
			}
			if(req.body.comment){
				dish.comments.id(req.params.commentId).comment=req.body.comment;
			}
			dish.save()
			.then((dish)=>{
			res.statusCode=200;
			res.setHeader('Content-Type','application/json');
			res.json(dish);
		},(err)=>next(err));
		}
		else if(dish==null) {
			err=new Error("Dish with the dish Id"+req.params.dishId+"not found");
			err.statusCode=404;
			return next(err);
		}
		else {
			err=new Error("comment with the comment Id"+req.params.commentId+"not found");
			err.statusCode=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));
})
.delete(authenticate.verifyUser,(req,res,next)=>{
	Dishes.findById(req.params.dishId)
	.then((dish)=>{
		if(dish != null && dish.comments.id(req.params.commentId)!=null){
			dish.comments.id(req.params.commentId).remove();
			dish.save()
			.then((dish)=>{
				res.statusCode=200;
				res.setHeader('Content-Type', 'application/json');
				res.json(dish);
			},(err)=>next(err));
		}
		else if(dish==null) {
			err=new Error("Dish with the dish Id"+req.params.dishId+"not found");
			err.statusCode=404;
			return next(err);
		}
		else {
			err=new Error("comment with the comment Id"+req.params.commentId+"not found");
			err.statusCode=404;
			return next(err);
		}
	},(err)=>next(err))
	.catch((err)=>next(err));
});



module.exports=dishRoute;

//before connecting to the database(mongodb)

// dishRoute.route('/')
// .all((req,res,next)=>{
// 	res.statusCode=200;
// 	res.setHeader("Content-Type","text/html");
// 	next();
// })
// .get((req,res,next)=>{
// 	res.end("we will send all the dishes to you!");
// })
// .post((req,res,next)=>{
	
// 	res.end("we will add the dish "+req.body.name+" with "+req.body.description+" descriptions");
// })
// .put((req,res,next)=>{
	
// 	res.statusCode=404;
// 	res.end("put method is not supported. you cannot modify the list");
// })
// .delete((req,res,next)=>{

// 	res.end("all the dishes will be deleted!");
// });



// dishRoute.route('/dishes/:dishId')
// .all((req,res,next)=>{
// 	res.statusCode=200;
// 	res.setHeader("Content-Type","text/html");
// 	next();
// })
// .get((req,res,next)=>{
// 	res.end("we will send the details of the "+req.params.dishId+" dish to you!");
// })
// .post((req,res,next)=>{
// 	res.statusCode=404;
// 	res.end("post method is not supported");
// })
// .put((req,res,next)=>{
// 	res.write("Updating the dish "+req.params.dishId+"\n");
// 	res.end("the updating will happen to "+req.body.name+" by adding "+req.body.description+" to it");
// })
// .delete((req,res,next)=>{
// 	res.end("dish with dish Id "+req.params.dishId+" will be deleted!");
// });