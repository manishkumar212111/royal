const commonHelper = require('./commonHelper');
const modelController = require('./modelController');
var moment = require('moment');

const couponController = {
    check : async (req , res) => {
        if(!req.query.coupon && !req.query.mobile){
            res.send({error : true , message: "coupon code and mobile both required"});
            return;
        }
        let mobile = req.query.mobile;
        let coupon = req.query.coupon;
        if(!(coupon.indexOf(COUPON_VALIDATE[0]) != -1 || coupon.indexOf(COUPON_VALIDATE[1]) != -1)){
            res.send({error : true , message: "Invalid coupon code"});
        }
        coupon = coupon.split(' ')[2];
        // validate mobile
        if(!commonHelper.validate_mobile(mobile)){
            res.json({error : true , message : "Mobile number is not valid"});
        }
        // validate coupon
        let couponValidateObj = await commonHelper.validate_coupon(coupon);
        if(!couponValidateObj.status){
            res.json({ error : true , message : couponValidateObj.message});
            return;
        }
        let offOnTrackFlag = coupon[8];
        if(offOnTrackFlag == '1'){
            // validate if mobile number already redeemed for max
            let mobileCountStatus = await commonHelper.checkMaxRedeemed(mobile); 
            if(!mobileCountStatus.status){
                res.json({error : true , message : mobileCountStatus.message });
                return;
            }

            // Now populate ontrade smsin table anf get SN
            let smsInSN = await commonHelper.insertSMSIn(coupon , mobile , 'smsin_ontrade');
            if(smsInSN){
                // now fetch code from paypal system from same SN
                let finalCodeObject = await commonHelper.getFinalCode(smsInSN , "paypal_ontrade" , mobile , coupon);
                if(finalCodeObject && finalCodeObject.code)
                    res.json({ error : false , code : finalCodeObject.code })     
                else
                    res.json({error : true , code : "No coupon code available" })     
                    return;
            }

        } else {
            // handle offTrack coupon
            // validate if mobile number already redeemed for max
            let mobileCountStatus = await commonHelper.checkMaxRedeemed(mobile); 
            if(!mobileCountStatus.status){
                res.json({error : true , message : mobileCountStatus.message });
                return;
            }

            // Now populate ontrade smsin table anf get SN
            let smsInSN = await commonHelper.insertSMSIn(coupon , mobile , 'smsin_offtrade');
            if(smsInSN){
                // now fetch code from paypal system from same SN
                let finalCodeObject = await commonHelper.getFinalCode(smsInSN , "paypal_offtrade" , mobile , coupon);
                if(finalCodeObject && finalCodeObject.code)
                    res.json({ error : false , code : finalCodeObject.code })     
                else
                    res.json({error : true , code : "No coupon code available" })     
                    return;
            }
        }

        res.json({error : false , coupon : "Something went wrong"});
    },

    addCoupon : async function(req , res){
        // const data = {
        //     code : "JPR123450ST",
        //     active : "yes",
        //     redeemed : "no"
        // }

        // let result = await modelController.insertIntoDb( 'coupon' , data );
        
        // const data = {
        //     mobile : "8005804379"
        // }

        // let result = await modelController.insertIntoDb( 'daily_count' , data );
        const data = {
            code : "TESTING1",
            status : "yes",
            date : "2019-11-27",

        }
        let result = await modelController.insertIntoDb( 'paypal_ontrade' , data );


        res.send({data});
    }        
}

module.exports = couponController;