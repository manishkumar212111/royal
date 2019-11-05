const modelController = require('./modelController');

const commonHelper = {
    sendResponseData : function(req , res ,data , messages , error) {
        if(!error){
            res.send({
                status : 200,
                data : data,
                messages : messages    
            })
        } else{
            res.send({
                status : 500,
                messages : messages    
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
    }
}


module.exports = commonHelper;