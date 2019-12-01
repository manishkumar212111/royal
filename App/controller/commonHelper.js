const modelController = require('./modelController');
var moment = require('moment');
const axios = require('axios')

const commonHelper = {
    validate_mobile : (mobile) => {
        if(!(/^(?![9]{10})(?:[6|7|8|9][0-9]{9})$/).test(mobile)){
            return false;
        }
        return true;
    },

    validate_coupon : async (coupon) => {
        let result = await modelController.findInDb({code : coupon , Active : 'yes'} , 'coupon' , ['*'] , ' AND ');
        if(result.length > 0){
            if(result[0].redeemed == 'yes'){
                return {status : false , message : "Coupon already used"}
            }
                return {status : true }
        }else{
                return { status : false , message : "Coupon is invalid"}
        }
    },
    checkMaxRedeemed : async (mobile) => {
        let result = await modelController.findInDb({mobile : mobile} , 'daily_count' , ['*']);
        let count_daily = 0;
        let count_monthly = 0;
        if(result.length > 0 ){
            result.forEach((item) => {
                let stored_date = moment(item.date).format('YYYY-MM-DD');
                
                if(stored_date === moment().format('YYYY-MM-DD')){
                    count_daily = count_daily + 1;
                }
                if(stored_date >= moment(LIMIT_START_DATE).format('YYYY-MM-DD') && stored_date <= moment(LIMIT_END_DATE).format('YYYY-MM-DD')){
                    count_monthly = count_monthly + 1;
                }
            })
        }
        
        if(count_daily >= DAILY_LIMIT){
            return ({status : false , message : "Your daily limit crossed"})
        }
        if(count_monthly >= MONTHLY_LIMIT){
            return ({status : false , message : "Your monthly limit crossed"})
        }
        return ({status : true})
    },
    
    insertSMSIn : async (coupon , mobile , tableName) => {
        let data = {
            mobile : mobile ,
            code : coupon ,
            date : moment().format('YYYY-MM-DD')
        }
        let insertId = await modelController.insertIntoDb( tableName , data );
        return insertId;
    },

    getFinalCode : async (SN , tableName , mobile , coupon ) => {
        let result = await modelController.findInDb({ sr : SN , status : 'yes' } , tableName , ['*'] , ' AND ');
        if(result.length > 0){
            await modelController.updateTable({status : "no"} , tableName , SN , 'sr');
            await modelController.updateTable({redeemed : "yes"} , 'coupon' , coupon , 'Code');
            await modelController.insertIntoDb( 'daily_count' , {mobile : mobile} );
            await modelController.insertIntoDb( 'redeem' , {
                mobile : mobile ,
                date: moment().format('YYYY-MM-DD HH-MM-SS'),
                coupon : coupon,
                paytmcode : result[0].code
            } );
            
            return result[0];
        }

        return false;
    },
    sendMessage : async (mobile , message) => {
        let url= "http://www.smsjust.com/sms/user/urlsms.php?username=pernod&pass=pernod@2019&senderid=RSMEGA&dest_mobileno="+mobile+"&message="+message+"&response=Y";
        await axios.get(url);
        return;
    }

}


module.exports = commonHelper;