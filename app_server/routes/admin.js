var express = require('express');
var router = express.Router();

var adminLocation = require('../controllers/adminLocation');


router.get('/:manager/:managerpwd/show',adminLocation.locations);
router.get('/location',adminLocation.addLocation);
router.post('/location',adminLocation.addLocation );
router.get('/location/:locationid/delete',adminLocation.deleteLocation);



module.exports = router;