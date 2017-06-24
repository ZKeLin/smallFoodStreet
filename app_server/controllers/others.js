/* GET 'about' page */
module.exports.about = function(req,res){
	res.render('about',{
		title: '关于我们',
		content: ['小食街是一个专门用来吃着小食寻找wifi，美女，帅哥的地方',
			'在这里，有你想吃的，有你想看的^_^^_^^_^'
		]
	});
};
