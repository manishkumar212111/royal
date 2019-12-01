const commonHelper = require('./commonHelper');
const modelController = require('./modelController');
var moment = require('moment');

const couponController = {
    check : async (req , res) => {
        if(!req.query.coupon && !req.query.mobile){
            return res.send({error : true , message: "coupon code and mobile both required"});
        }
        let mobile = req.query.mobile;
        let coupon = req.query.coupon;
        if(!(coupon.indexOf(COUPON_VALIDATE[0]) != -1 || coupon.indexOf(COUPON_VALIDATE[1]) != -1)){
            await commonHelper.sendMessage(mobile , "Message format is incorrect, Kindly try with proper message format");
            return res.send({error : true , message: "Message format is incorrect, Kindly try with proper message format"});
        }
        coupon = coupon.split('+')[2];
        // validate mobile
        if(!commonHelper.validate_mobile(mobile)){
            return res.json({error : true , message : "Mobile number is not valid"});
        }
        // validate coupon
        let couponValidateObj = await commonHelper.validate_coupon(coupon);
        if(!couponValidateObj.status){
            await commonHelper.sendMessage(mobile , couponValidateObj.message);                                        
            return res.json({ error : true , message : couponValidateObj.message});
        }
        let offOnTrackFlag = coupon[8];
        if(offOnTrackFlag == '1'){
            // validate if mobile number already redeemed for max
            let mobileCountStatus = await commonHelper.checkMaxRedeemed(mobile); 
            if(!mobileCountStatus.status){
                await commonHelper.sendMessage(mobile , mobileCountStatus.message);                            
                return res.json({error : true , message : mobileCountStatus.message });
            }

            // Now populate ontrade smsin table anf get SN
            let smsInSN = await commonHelper.insertSMSIn(coupon , mobile , 'smsin_ontrade');
            if(smsInSN){
                // now fetch code from paypal system from same SN
                let finalCodeObject = await commonHelper.getFinalCode(smsInSN , "paypal_ontrade" , mobile , coupon);
                if(finalCodeObject && finalCodeObject.code){   
                    let message = "Sucessfull submission - Thank you for participating, your Paytm coupon code is "+finalCodeObject.code+" of Rs 10. Use Paytm app to redeem your code. For terms and condition go to http://royalstagraj.in/";
                    await commonHelper.sendMessage(mobile , message);                            
                    return res.json({ error : false , code : finalCodeObject.code , message : message })
                }     
                else {
                    return res.json({error : true , code : "No coupon code available" })     
                }
            }

        } else {
            // handle offTrack coupon
            // validate if mobile number already redeemed for max
            let mobileCountStatus = await commonHelper.checkMaxRedeemed(mobile); 
            if(!mobileCountStatus.status){
                await commonHelper.sendMessage(mobile , mobileCountStatus.message);                                            
                return res.json({error : true , message : mobileCountStatus.message });
                
            }

            // Now populate ontrade smsin table anf get SN
            let smsInSN = await commonHelper.insertSMSIn(coupon , mobile , 'smsin_offtrade');
            if(smsInSN){
                // now fetch code from paypal system from same SN
                let finalCodeObject = await commonHelper.getFinalCode(smsInSN , "paypal_offtrade" , mobile , coupon);
                if(finalCodeObject && finalCodeObject.code){
                    let message = "Sucessfull submission - Thank you for participating, your Paytm coupon code is "+finalCodeObject.code+" of Rs 10. Use Paytm app to redeem your code. For terms and condition go to http://royalstagraj.in/";
                    await commonHelper.sendMessage(mobile , message);                            
                    return res.json({ error : false , code : finalCodeObject.code })                         
                }
                else {
                    return res.json({error : true , code : "No coupon code available" })     
                }
            }
        }

        return res.json({error : false , coupon : "Something went wrong"});
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
            code : "TESTING1uhgkh",
            status : "yes",
            date : "2019-11-27",

        }
        let result = await modelController.insertIntoDb( 'paypal_offtrade' , data );


        res.send({data});
    }        
}

module.exports = couponController;