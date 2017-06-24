var express = require('express');
var router = express.Router();
//var ctrlMain = require('../controllers/main');
var ctrlLocations = require('../controllers/locations');
var ctrlOthers = require('../controllers/others');

/* GET home page. */
//router.get('/', ctrlMain.index);

/* Locations Pages */
router.get('/',ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/:locationid/review/new',ctrlLocations.addReview);
router.post('/location/:locationid/review/new',ctrlLocations.doAddReview);

/* Other Pages */
router.get('/about',ctrlOthers.about);



module.exports = router;
