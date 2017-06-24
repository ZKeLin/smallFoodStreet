var request = require('request');

var apiOptions = {
  	server : "http://localhost:80"
};

/* GET 'home' page */
var renderHomepage = function(req,res,responsebody){
	var message;
	if(!(responsebody instanceof Array)){
		message = "API error";
		responsebody = [];
	}else{
		if(!responsebody.length){
			message = "客官，没有找到地儿";
		}
	}
	res.render('locations-list',{ 
		title: '小食街 - 充满美食的地儿',
		pageHeader: {
			title: '小食街',
			strapline: '充满美食的地儿!'
		},
		sidebar: "走过路过，不要错过，小食街充满美食和美女的地儿。。。。",
		locations: responsebody,
		message: message
	});
}

module.exports.homelist = function(req,res,next){
	var requestOptions,path;
	path = '/api/locations';
	requestOptions = {
		url: apiOptions.server+path,
		method: 'GET',
		json: {},
		qs: {
			lng: 117.1088778,
			lat: 36.1931139,
			maxDistance: 20000
		}
	};
	var _formatDistance = function(distance){
		var numDistance,unit;
		if(distance>1){
			numDistance = parseFloat(distance).toFixed(1);
			unit = "km";			
		}else{
			numDistance = parseInt(distance * 1000,10);
			unit = "m";
		}
		return numDistance + unit;
	}
	request(requestOptions,function(err,response,body){
		console.log(body);
		var i,data;
		data = body;
		console.log(response.statusCode);
		if(response.statusCode == 200 && data.length){
			for(i=0;i<data.length;i++){
				data[i].distance = _formatDistance(data[i].distance);
			}
		}
		renderHomepage(req,res,data);
	});
};

/* GET 'Location info' page */
var getLocationInfo = function(req,res,cb){
	var requestOptions,path;
	path = '/api/locations/'+req.params.locationid;
	requestOptions = {
		url: apiOptions.server + path,
		method: 'GET',
		json: {}
	}
	request(requestOptions,function(err,response,body){
		console.log(body);
		if(response.statusCode == 200){
			cb(req,res,body);
		}else{
			_showError(req,res,response.statusCode);
		}
	});
}
var renderDetailPage = function(req,res,body){
	var data = body;
	res.render('location-info',{
		title: 'location info',
		id: data._id,
		name: data.name,
		coords: data.coords,
		//coords: { lat: 51.455041,lng: -0.9690884 },
		rating: data.rating,
		address: data.address,
		openingTime:data.openingTimes,
		Facilities: data.facilities,
		customerReviews: data.reviews
	});
	console.log('data',data);
}
var _showError = function(req,res,status){
	var title,content;
	if(status == 404){
		title = '404,页面不知道跑哪去了';
		content = '很抱歉，我们没法找到它';
	}else{
		title = status + ',发生了不可预料的错误';
		content = '不可预料的错误';
	}
	res.render('generic-text',{
		title: title,
		content: content
	});
}
module.exports.locationInfo = function(req,res){
	getLocationInfo(req,res,function(req,res,responseData){
		renderDetailPage(req,res,responseData);
	});
};

/* GET 'addReview' page */
var renderReviewForm = function(req,res,responseData){
	var data = responseData;
	res.render('location-review-form',{
		title: 'Review '+ data.name +' on Loc8r',
		pageHeader: {
			title: 'Review '+ data.name
		},
		error: req.query.err
	});
}
module.exports.addReview = function(req,res){
	getLocationInfo(req,res,function(req,res,responseData){
		renderReviewForm(req,res,responseData);
	});
};


/* POST doAddReview */
module.exports.doAddReview = function(req,res){
	var requestOptions,path,locationid,postdata;
	locationid = req.params.locationid;
	path = '/api/locations/'+locationid+'/reviews';
	postdata = {
		author: req.body.name,
		rating: parseInt(req.body.rating,10),
		reviewText: req.body.review
	}
	console.log(postdata);
	requestOptions = {
		url: apiOptions.server + path,
		method: 'POST',
		json: postdata
	}
	request(requestOptions,function(err,response,body){
		if (response.statusCode === 201) {
			res.redirect('/location/' + locationid);
		}else if(response.statusCode === 400 && body.name && body.name ==="ValidationError"){
			res.redirect('/location/'+locationid+'/reviews/new?err=val');
		} else {
			console.log(err);
			_showError(req, res, response.statusCode);
		}
	})
};
