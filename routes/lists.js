var express  = require('express');
var fs       = require('fs'); // To clean up multer temp storage
var multer   = require('multer');
var storage  = require('./list_storage_local');

var router = express.Router();


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
  storage.list_lists(withErrHandler(res, 500, function(lists) {
    res.render('lists', { title: "Lists", lists: lists });
  }));
});

/* Add list */
router.get('/add', function(req, res) {
  res.render('add_list');
});

router.post('/add', function(req, res) {
  storage.add_list(req.body.listName, withErrHandler(res, 500, function(list_name) {
    res.send(list_name);
  }));
});

/* Remove list */
router.post('/remove', function(req, res) {
  storage.remove_list(req.body.listName, withErrHandler(res, 500, function(list_name) {
    res.send(list_name);
  }));
});

/* Show list page */
router.get('/:listname/:selection', function(req, res) {
  storage.show_list(req.params.listname, req.params.selection, withErrHandler(res, 500, function(files) {
    res.render('files', { title: req.params.listname + ' ' + req.params.selection, files: files });
  }));
});

module.exports = router;