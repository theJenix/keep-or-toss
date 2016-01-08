var fs = require('fs-extra');

module.exports = function(root) {
  return {

    list: function(callback) {
      fs.readdir(root, callback);
    },

    load: function(name, callback) {
      fs.readFile(root + "/" + name, callback);
      // callback(null, root + "/" + name);
    },

    save: function(name, path, callback) {
      this.make_root(function () {
        fs.readFile(path, function (err, data) {
          if (err) {
            callback(err, null);
          } else {
            fs.writeFile(root + "/" + name, data, function (err) {
              callback(err, name);
            });
          }
        });
//        fs.rename(path, root + "/" + name, function (err) {
  //        callback(err, name);
    //    });
      });
    },

    transfer: function(name, store, callback) {
      this.make_root(function () {
        var path = root + "/" + name;
        store.save(name, path, function (err, new_name) {
          if (!err) {
            fs.unlink(path, function (err) {
                console.log(err);
                callback(err, new_name);
            });
          } else {
            callback(err, null);
          }
        });
    /*    fs.move(source + "/" + filename, target + "/" + filename, function (err) {
          console.log('renamin');
          console.log(target + "/" + filename);
          console.log(err);
          callback(err);
        });*/
      });
    },

    make_root: function(callback) {
      var mode = 0744;
      fs.exists(root, function (exists) {
        if (!exists) {
          fs.mkdirSync(root, mode);
        }
        callback();
      });
    }
  }
}
