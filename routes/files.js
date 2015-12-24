var express  = require('express');
var fs       = require('fs-extra');
var multer   = require('multer');

var router = express.Router();

var upload_dir = './uploads';
var keep_dir   = './uploads/keep';
var toss_dir   = './uploads/toss';

var upload = multer({ dest: upload_dir });

/* GET home page. */
router.get('/new', function(req, res) {
  res.render('upload');
});


router.post('/new', upload.single('image'), function(req, res) {
  if (req.file) {
    var parts = req.file.originalname.split(".") 
    var ext = parts && parts[parts.length - 1] || null;
    if (ext) {
        fs.rename(req.file.path, req.file.path + "." + ext, function (err) {
          console.log(err);
          res.send('');
        });
    } else {
        res.status(400);
    }
  } else {
    res.status(400);
  }
});

var moveFile = function(source, target, filename, callback) {
  var mode = 0744;
  fs.exists(target, function (exists) {
    if (!exists) {
      console.log("Doesnt exist!");
      fs.mkdirSync(target, mode);
    }
    fs.move(source + "/" + filename, target + "/" + filename, function (err) {
      console.log('renamin');
      console.log(target + "/" + filename);
      console.log(err);
      callback(err);
    });
  });
}

router.post('/:filename/keep', function(req, res) {
  moveFile(upload_dir, keep_dir, req.params.filename, function (err) {
    if (err) {
      res.status(500).send('');
    } else {
      res.send('');
    }
  });
});

router.post('/:filename/toss', function(req, res) {
  moveFile(upload_dir, toss_dir, req.params.filename, function (err) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send('');
    }
  });
});

router.get('/kept', function(req, res) {
  // list of files in ./uploads/keep
  fs.readdir(keep_dir, function(err, files) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.render('files', { title: "Kept Files", files: files });
    }
  });
});

router.get('/todo', function(req, res) {
  // list of files in ./uploads
  fs.readdir(upload_dir, function(err, files) {
    if (err) {
      res.status(500).send(err);
    } else {
      res.render('files', { title: "Files to look at", files: files });
    }
  });
});

router.get('/tossed', function(req, res) {
  // list of files in ./uploads/toss
  fs.readdir(toss_dir, function(err, files) {
    if (err) {
      res.status(500).send(err);
    } else {
        console.log(files);
      res.render('files', { title: "Tossed Files", files: files });
    }
  });
});

//NOTE: order matters...this has to be last
router.get('/:filename', function(req, res) {
  res.sendFile(upload_dir + "/" + req.params.filename);
});

module.exports = router;
