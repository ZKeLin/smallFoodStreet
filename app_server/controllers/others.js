/* GET 'about' page */
module.exports.about = function(req,res){
	res.render('about',{
		title: 'about',
		content: ['Loc8r was created to help people find places to sit down and get abit of work done.',
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc sedlorem ac nisi dignissim accumsan.'
		]
	});
};