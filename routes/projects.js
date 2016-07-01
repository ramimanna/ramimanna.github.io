var express = require('express');
var projectsRouter = express.Router();
var projectPagesRouter = express.Router({mergeParams: true});

projectsRouter.use('/',projectPagesRouter);

/* GET users listing. */
projectsRouter.get('/', function(req, res, next) {
  res.render('projects', {title:'Projects'});
});

projectPagesRouter('/painteditor', function(req,req,next){
	res.render('painteditor',{title:'Paint Editor'});
});

projectPagesRouter('/tracking', function(req,req,next){
	res.render('tracking',{title:'Tracking'});
});

module.exports = projectsRouter;