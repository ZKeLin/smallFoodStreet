var request = require('request');

var apiOptions = {
  	server : "http://localhost:80"
};

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
/*将字符串转换成数组
*
*@param(string) 需要想转换的字符串
*@param(seperator) 分隔符
*return Array
*/
function stringToArray(string,seperator){
	var seperator = seperator || ';';
	if(!string) return [];
	return string.split(seperator);
}

module.exports.addLocation = function(req,res,next){
	if(req.body){
		if(req.body.name && req.body.address && req.body.facilities && req.body.lng && req.body.lat && req.body.opentime){
			var location = {};
			//[{"days":"星期一-星期五","opening":"7:00","closing":"19:00","closed":false},{"days":"星期六","opening":"7:00","closing":"19:00","closed":false},{"days":"星期天","closed":true}]
			location.name = req.body.name;
			location.address = req.body.address;
			location.facilities = stringToArray(req.body.facilities,/;|；/);
			location.coords = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
			try{
				location.openingTimes = JSON.parse(req.body.opentime);
			}catch(e){
				res.render('admin/location-add-form',{
					warningContent: "*开放时间请严格按照标准格式填写*"
				});
			}
			var path = '/api/locations';
			var requestOption = {
				url: apiOptions.server + path,
				method: 'POST',
				json: location
			}
			//console.log(location);
			request(requestOption,function(error,response,body){
				res.redirect('/admin/root/1234/show');
			});
			
		}else{
			res.render('admin/location-add-form',{
				warningContent: "*请将内容填写完整*"
			});
		}
	}
}

module.exports.locations = function(req,res,next){
	var requestOption,locationArray,path,manager,managerpwd;
	managerpwd = '1234';
	manager = 'root';
	console.log(req.params);
	if(manager === req.params.manager && managerpwd === req.params.managerpwd){
		path = '/api/locationsAll';
		requestOption = {
			url: apiOptions.server + path,
			method: 'GET',
			json: {}
		}
		var _formatBody = function(array){
			for(var i = 0; i<array.length; i++){
				array[i]._N = i+1;
			}
			return array;
		}
		request(requestOption,function(error,response,body){
			var datas = _formatBody(body);
			//console.log('data',datas);
			res.render('admin/admin',{datas: datas});
		});
	}else{
		res.render('admin/error',{ content: "管理员和密码不匹配" })
	}
	
}

module.exports.deleteLocation = function(req,res,next){
	var locationid,requestOption,path;
	locationid = req.params.locationid;
	path = '/api/locations/'+locationid;
	requestOption = {
		url: apiOptions.server + path,
		method: 'DELETE'
	}
	console.log(path);
	request(requestOption,function(error, response, body){
		if(response.statusCode == 200 || response.statusCode == 204){
			res.redirect('/admin/show');
		}else{
			_showError(req,res,response.statusCode);
		}
	});
}