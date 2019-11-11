const modelController = require('./modelController');

const commonHelper = {
    sendResponseData : function(req , res ,data , messages , error , status) {
        if(status == 200){
            res.send({
                status : 200,
                data : data,
                messages : messages    
            })
        } else if(status == 500){
            res.send({
                status : 500,
                messages : messages    
            })
        }else if( status == 302){
            res.send({
                status : 302,
                messages : messages,
                redirect : data.redirect    
            })
        }
    },
    getPaginationObject : async function(tableName , limit , currentPage){
        const countObj = await modelController.fetchCountDb(tableName);
        const totalCount = countObj[0].count;

        let obj ={
            pageCount : totalCount/limit,
            perPage : limit,
            currentPage : currentPage
        }        
        return obj;
    },
    validateArray(req,data,validationRule){
        let obj = {
            status : true,
            message : ""
        }
        for(var i in data){
            if(typeof req[data[i]] == 'undefined' || (typeof req[data[i]] !== 'number' && req[data[i]].length === 0)){
                obj.status = false;
                obj.message = data[i] + " required";
                break;
            }
        }
        return obj;
    }
}


module.exports = commonHelper;