var mongoose = require('mongoose');
var Loc = mongoose.model('Location');


var sendJSONresponse = function(res,status,content){
	res.status(status);
	res.json(content);
}
var theEarth = (function(){
	var earthRadius = 6371;
	var getDistanceFromRads = function(rads){
		return parseFloat(rads*earthRadius);
	}
	var getRadsFromDistance = function(distance){
		return parseFloat(distance/earthRadius);
	}
	return {
		getDistanceFromRads:getDistanceFromRads,
		getRadsFromDistance:getRadsFromDistance
	}
})()


module.exports.locationsCreate = function(req,res){
	console.log(req.body);
	Loc.create(req.body,function(err,location){
		if(err){
			sendJSONresponse(res,404,err);
		}else{
			sendJSONresponse(res,200,location);
		}
	});
}
//
module.exports.locationsListByDistance = function(req,res){
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var maxDistance = parseFloat(req.query.maxDistance);
	var point = {
		type: 'Point',
		coordinates: [lng,lat]
	};
	var geoOptions = {
		spherical: true,//sphercal 球面
		num: 10, //the search will bring back no more than the 10 closest results
		maxDistance: theEarth.getRadsFromDistance(maxDistance)
	}
	if(!lng || !lat){
		sendJSONresponse(res,404,{'message':'经纬度是必须的'})
		return;
	}
	Loc.geoNear(point,geoOptions,function(err,results,stats){
		var locations = [];
		if(err){
			console.log('api location'+err);
			sendJSONresponse(res,404,err);
		}else{
			results.forEach(function(doc){
				locations.push({
					distance: theEarth.getDistanceFromRads(doc.dis),
					name: doc.obj.name,
					rating: doc.obj.rating,
					address:doc.obj.address,
					facilities: doc.obj.facilities,
					_id:doc.obj._id
				});
			});
			console.log('results'+results);
			sendJSONresponse(res,200,locations);
		}
	});

}

module.exports.locationsReadOne = function(req,res){
	if(req.params && req.params.locationid){
		var id = mongoose.Types.ObjectId(req.params.locationid);
		console.log(id);
		Loc.findById(id).exec(function(err,location){
			if(!location){
				sendJSONresponse(res,404,{
					'message':'locationid not found'
				});
				return;
			}else if(err){
				sendJSONresponse(res,404,err);
				return;
			}
			sendJSONresponse(res,200,location);
			console.log('location',location);
		});
	}else{
		sendJSONresponse(res,404,{
			'message':'No locationid in request'
		});
	}
}

module.exports.locationsReadAll = function(req,res){
	Loc.
		find({}).
		limit(10).
		exec(function(err,locations){
			if(!locations){
				sendJSONresponse(res,404,{
					'message':'locationid not found'
				});
				return;
			}
			else if(err){
				sendJSONresponse(res,404,err);
				return;
			}else{
				sendJSONresponse(res,200,locations);
			}
		});
}

module.exports.locationsUpdateOne = function(req,res){
	if (!req.params.locationid) {
	    sendJSONresponse(res, 404, {
	      "message": "Not found, locationid is required"
	    });
	    return;
  	}
  	var id = mongoose.Types.ObjectId(req.params.locationid);
  	Loc
	    .findById(id)
	    .select('-reviews -rating')
	    .exec(function(err, location) {
	        if (!location) {
				sendJSONresponse(res, 404, {
				"message": "locationid not found"
				});
				return;
	        } else if (err) {
				sendJSONresponse(res, 400, err);
				return;
	        }
	        location.name = req.body.name;
	        location.address = req.body.address;
	        location.facilities = req.body.facilities.split(",");
	        location.coords = [parseFloat(req.body.lng), parseFloat(req.body.lat)];
	        location.openingTimes = [{
				days: req.body.days1,
				opening: req.body.opening1,
				closing: req.body.closing1,
				closed: req.body.closed1
	        }, {
				days: req.body.days2,
				opening: req.body.opening2,
				closing: req.body.closing2,
				closed: req.body.closed2
	        }];
	        location.save(function(err, location) {
				if (err) {
					sendJSONresponse(res, 404, err);
				} else {
					sendJSONresponse(res, 200, location);
				}
	        });
	    });
}

module.exports.locationsDeleteOne = function(req,res){
	var locationid = req.params.locationid;
	if (locationid) {
  		var id = mongoose.Types.ObjectId(req.params.locationid);
		Loc
			.findByIdAndRemove(id)
			.exec(
				function(err, location) {
					if (err) {
						console.log(err);
						sendJSONresponse(res, 404, err);
						return;
					}
					console.log("Location id " + locationid + " deleted");
					sendJSONresponse(res, 204, "delete success");
				}
			);
	} else {
		sendJSONresponse(res, 404, { "message": "No locationid"});
	}
}
