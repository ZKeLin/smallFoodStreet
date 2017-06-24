var lng = document.getElementById('lng');
var lat = document.getElementById('lat');
//获取当前的地理位置
function getLocation(){
	if(!lng.value || !lat.value){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				//longitude经度latitude纬度
				lng.value = position.coords.longitude;
				lat.value = position.coords.latitude;
			});
		}else{
			alert("你的浏览器不支持地理位置");
		}
	}
}

(function viladateInput(){
	var array = document.getElementsByTagName('input');
	for(var i = 0; i < array.length; i++){
		array[i].addEventListener('blur',function(event){
			if(!event.target.value){
				var className = event.target.parentElement.className;
				if(className.indexOf('has-error') < 0){
					var submitBtn = document.getElementById('submitBtn');
					event.target.parentElement.className = className + ' has-error';
					submitBtn.disabled = true;
				}
			}else{
				var className = event.target.parentElement.className;
				if(className.indexOf(' has-error') > 0){
					var submitBtn = document.getElementById('submitBtn');
					event.target.parentElement.className = className.replace(' has-error','');
					submitBtn.disabled = false;
				}
			}
		});
	}
})()



