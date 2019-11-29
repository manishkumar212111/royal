var express = require('express');
var router = express.Router();
var couponController = require('../App/controller/couponController');
const testWare = (req, res, next) => {
    next();
} 
router.get('/submit' , testWare , couponController.check);

router.get('/add_coupon' , testWare , couponController.addCoupon);

module.exports = router ;