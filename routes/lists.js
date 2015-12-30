var express  = require('express');
var fs       = require('fs'); // To clean up multer temp storage
var multer   = require('multer');
var storage  = require('./storage_local');

var router = express.Router();

var root = './uploads/lists'
var list_storage = storage(root);


var withErrHandler = function(res, code, callback) {
  return function(err, b) {
    if (err) {
      res.status(code).send(err);
    } else {
      var args = [].slice.apply(arguments);
      args.shift();
      callback.apply(null, args);
    }
  }
}

/* List of lists page */
router.get('/', function(req, res) {
  list_storage.make_root(function() {
    list_storage.list(withErrHandler(res, 500, function(files) {
      res.render('files', { title: "Lists", files: files });
    }));
  });
});

/* Add list */
router.post('/add/:listname', function(req, res) {
  var store = storage(root + '/' + req.params.listname);
  store.make_root(function() {
    res.send(req.params.listname);
  });
});

/* Show list page */
router.get('/:listname/:selection', function(req, res) {
  var store = storage(root + '/' + req.params.listname + '/' + req.params.selection);
  store.list(withErrHandler(res, 500, function(files) {
    res.render('files', { title: req.params.listname + ' ' + req.params.selection, files: files });
  }));
});

module.exports = router;