const modelController = require('./modelController')
const commonHelper = require('./commonHelper');
const seoData = require('../data/seo')


var pageController = {
    home : async function(req , res) {
        try{
            
            let data = {
                projects : await modelController.fetchFromDb('projects' , ['*'] , 4),
                seo : seoData.seo('home'),
                blogs : await modelController.fetchFromDb('blogs' , ['*'] , 4) 
            }    
            return commonHelper.sendResponseData(req , res , data , "Fetched Project list" ,false, 200)
        } catch(error){
            console.log(error);
            return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true , 500)
        }
    },
    addProject : async function(req , res){
        const obj = {
            title : "Test title",
            short_description : "This is short description",
            long_description : "This is long description",
            price : 47564,
            time_taken : "2 years",
            category : "Civil",
            specifications : "Not available",
            client_name : "Manish KUmar",
            contractor_name : "testing",
            contractor_id : "7656",
            isCompleted : 0,
            images : 'images/img1.png,images/img1.png,images/img1.png'
        }

        const insertId = await modelController.insertIntoDb('projects',obj);
        return commonHelper.sendResponseData(req , res , {insertId : insertId } , "Inserted successfully" , false,200)
    },
    addBlog : async function(req , res){
        const obj = {
            title : "Blog Title",
            short_description : "This is short description",
            long_description : "This is long description",
            coverImage : 'images/img1.png',
            author : 'Manish',
            author_id : 12
        }

        const insertId = await modelController.insertIntoDb('blogs',obj);
        return commonHelper.sendResponseData(req , res , {insertId : insertId } , "Inserted successfully")
    },
    projectList: async function(req ,res){
        try{
            let currentPage = 1;
            if(req.query.page)
                currentPage = parseInt(req.query.page);
            
                const data = {
                projects : await modelController.fetchFromDbInRange('projects' , ['*'] , 4 , currentPage-1),
                seo : seoData.seo('projectListing'),
                pagination : await commonHelper.getPaginationObject('projects' , 4 ,currentPage)
            }
                return commonHelper.sendResponseData(req , res , data , "fetched successfully" ,false,200);
            } catch(error){
                console.log(error);
                return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true)
        }
    },
    blogList: async function(req ,res){
        try{
            let currentPage = 1;
            if(req.query.page)
                currentPage = parseInt(req.query.page);
            
                const data = {
                blogs : await modelController.fetchFromDbInRange('blogs' , ['*'] , 4 , currentPage-1),
                seo : seoData.seo('blogListing'),
                pagination : await commonHelper.getPaginationObject('blogs' , 4 ,currentPage)
            }
                return commonHelper.sendResponseData(req , res , data , "fetched successfully" ,false,200);
            } catch(error){
                console.log(error);
                return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true ,500)
        }
    },
    blogDetail: async function(req , res){
        try{
            const validationResult = commonHelper.validateArray(req.query , ['id']);    
            if(!validationResult.status){
                return commonHelper.sendResponseData(req , res , {} , validationResult.message , true ,500)
            }
            let condition = {
                id : parseInt(req.query.id)
            }
            let description = await modelController.findInDb(condition, 'blogs' ,['*']);
            if(!description[0]){
                return commonHelper.sendResponseData(req , res , {redirect : "/blogs/list"} , "Error at backend" , true, 302)
            }
            let data = {
                description : description[0],
                seo : seoData.seo('blogDetail' , {title : description[0].title , pageDescription : description[0].short_description}),                
            }
            return commonHelper.sendResponseData(req , res , data , "fetched successfully" ,false,200);
            } catch(error){
                console.log(error);
                return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true , 500)
        }
    },
    projectDetail: async function(req , res){
        try{
            const validationResult = commonHelper.validateArray(req.query , ['id']);    
            if(!validationResult.status){
                return commonHelper.sendResponseData(req , res , {} , validationResult.message , true ,500)
            }
            let condition = {
                id : parseInt(req.query.id)
            }
            let description = await modelController.findInDb(condition, 'projects' ,['*']);
            if(!description[0]){
                return commonHelper.sendResponseData(req , res , {redirect : "/projects/list"} , "Error at backend" , true, 302)
            }
            let data = {
                description : description[0],
                seo : seoData.seo('blogDetail' , {title : description[0].title , pageDescription : description[0].short_description}),                
            }
            return commonHelper.sendResponseData(req , res , data , "fetched successfully" ,false,200);
            } catch(error){
                console.log(error);
                return commonHelper.sendResponseData(req , res , {} , "Error at backend" , true , 500)
        }
    },
}

module.exports = pageController;