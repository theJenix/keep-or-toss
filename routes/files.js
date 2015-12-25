var express  = require('express');
var fs       = require('fs'); // To clean up multer temp storage
var multer   = require('multer');
var storage  = require('./storage_local');

var router = express.Router();

var upload_dir = './uploads';

var todo = storage('./uploads/todo');
var keep = storage('./uploads/keep');
var toss = storage('./uploads/toss');

var upload = multer({ dest: upload_dir });

/* GET home page. */
router.get('/new', function(req, res) {
  res.render('upload');
});

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
var client_err = function(res, err) {
  res.status(400).send(err);
}
router.post('/new', upload.single('image'), function(req, res) {
  if (req.file) {
    var parts = req.file.originalname.split(".") 
    var ext = parts && parts[parts.length - 1] || null;
    if (ext) {
      todo.save(req.file.filename + "." + ext, req.file.path, withErrHandler(res, 500, function (name) {
        console.log(name);
        fs.unlink(req.file.path, withErrHandler(res, 500, function() {
          res.send(name);
        }));
      })); 
    } else {
      client_err(res, err);
    }
  } else {
    client_err(res, err);
  }
});

router.post('/:filename/keep', function(req, res) {
  todo.transfer(req.params.filename, keep, withErrHandler(res, 500, function (new_name) {
    res.send(new_name);
  }));
});

router.post('/:filename/toss', function(req, res) {
  todo.transfer(req.params.filename, toss, withErrHandler(res, 500, function (new_name) {
    res.send(new_name);
  }));
});

router.get('/kept', function(req, res) {
  // list of files in ./uploads/keep
  keep.list(withErrHandler(res, 500, function(files) {
    res.render('files', { title: "Kept Files", files: files });
  }));
});

router.get('/todo', function(req, res) {
  // list of files in ./uploads
  todo.list(withErrHandler(res, 500, function(files) {
    res.render('files', { title: "Files to look at", files: files });
  }));
});

router.get('/tossed', function(req, res) {
  // list of files in ./uploads/toss
  toss.list(withErrHandler(res, 500, function(files) {
    res.render('files', { title: "Tossed Files", files: files });
  }));
});

//NOTE: order matters...this has to be last
router.get('/:filename', function(req, res) {
  todo.load(req.params.filename, function (err, file) {
      res.sendfile(file);
  })
});

module.exports = router;
