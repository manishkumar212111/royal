var express = require('express');
var router = express.Router();
const pageController = require('./controller/pageController')
const testWare = (req, res, next) => {
    next();
} 
console.log(typeof pageController,pageController)
router.get('/home' , testWare , pageController.home);
router.get('/projects/add' , testWare , pageController.addProject);
router.get('/blogs/add' , testWare , pageController.addBlog);
router.get('/project/list' , testWare , pageController.projectList);
router.get('/blog/list' , testWare , pageController.blogList);

router.get('/blog/detail' , testWare , pageController.blogDetail);
router.get('/project/detail' , testWare , pageController.projectDetail);


module.exports = router ;