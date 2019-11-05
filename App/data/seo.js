const data = {
    seo : function(type){
        switch(type){
            case 'home':
                return {
                    title : "this is home page",
                    pageDescription : "This contins projects"
                }
            case 'projectListing':
                return {
                    title : "this is project listing page",
                    pageDescription : "This is description of project listing"
                }
            case 'blogListing':
            return  {     
                    title: "this is blog listing page",    
                    pageDescription : "This is description of project listing"
                }
        }
    }
}
module.exports = data;