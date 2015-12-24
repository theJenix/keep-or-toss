var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('upload');
});

router.post('/new', function(req, res, next) {
  console.log(req)
});

module.exports = router;
