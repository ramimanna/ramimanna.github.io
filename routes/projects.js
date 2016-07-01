var express = require('express');
var projectsRouter = express.Router();
var projectPagesRouter = express.Router({mergeParams: true});

projectsRouter.use('/',projectPagesRouter);

/* GET users listing. */
projectsRouter.get('/', function(req, res, next) {
  res.render('projects', {title:'Projects'});
});

projectPagesRouter.get('/painteditor', function(req,res,next){
	res.render('painteditor',{title:'Paint Editor'});
});

projectPagesRouter.get('/tracking', function(req,res,next){
	res.render('tracking',{title:'Tracking'});
});

module.exports = projectsRouter;