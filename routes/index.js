var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project Ramroom' });
});

router.get('/projects', function(req, res, next) {
  console.log("projects is here");
  res.render('projects', {title:'Projects'});
});

router.get('/adventure', function(req, res, next) {
  res.send('This is adventure');
});

router.get('/explore', function(req, res, next) {
  res.send('This is explore');
});


module.exports = router;
