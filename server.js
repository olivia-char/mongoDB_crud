var express = require('express');
	bodyParser = require('body-parser');
	path = require('path');
	mongoose = require('mongoose');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.set("views",__dirname + "/views");
app.set("view engine", "ejs"); 

mongoose.connect('mongodb://localhost/basic_mongoose');

var AnimalSchema = new mongoose.Schema({
 name: String,
 age: Number,
 attitude: String,
 color: String
});

mongoose.model('Animal', AnimalSchema); 
var Animal = mongoose.model('Animal');


app.get('/', function(req, res){
	Animal.find({}, function(err, results){
		if(err){
			console.log("results error");
		} else {
			res.render('index', {animals: results});
		};
	});
})

app.get('/mongooses/new', function(req, res){
	res.render('mongoose_form');
}) 

app.post('/mongooses', function(req, res){
	Animal.create(req.body, function(err) {
		if (!err){
			console.log("successfully added new mongoose");
		} else {
			console.log("something went wrong!");
		}
		res.redirect('/');
	}); 
})

app.get('/mongooses/:id', function(req, res){
	console.log("in the mongooses/id")
	Animal.find({_id: req.params.id}, function(err, mongooses){
		if (err){
			console.log("uh oh something's wrong")
		}
		res.render('mongoose_id', { animal: mongooses[0] });
	});
})

app.get('/mongooses/:id/edit', function(req, res){
	Animal.find({ _id: req.params.id }, function(err, mongooses){
    	if (err){ 
    		console.log("something is wrong with edit"); 
    	}
    	res.render('mongoose_edit', { animal: mongooses[0] });
    	console.log("at edit")
  	});
})

app.post('/mongooses/:id/update', function(req, res){
	console.log("in the update", req.params);
  	Animal.update({ _id: req.params.id }, req.body, function(err, result){
    	if (err){ 
    		console.log("error in update"); 
    	} 
    	else {
    		console.log("updated", result);
    		res.redirect('/');
    	}
  	});
})

app.post('/mongooses/:id/delete', function(req, res){
  	Animal.remove({ _id: req.params.id }, function(err, result){
    	if (err){ 
    		console.log("doesn't want to delete"); 
    	}
    	res.redirect('/');
 	});
})


app.listen('8000', function(){
	console.log("All Gooda port 8000: mongoose_dashboard")
})