var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Project Ramroom' });
});

// router.get('/projects', function(req, res, next) {
//   console.log("projects is here");
//   res.render('projects', {title:'Projects'});
// });


module.exports = router;
