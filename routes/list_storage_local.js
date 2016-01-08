var storage  = require('./storage_local');

var root = './uploads/lists'
var list_storage = storage(root);

module.exports = {
  list_lists: function(callback) {
    list_storage.make_root(function() {
      list_storage.list(callback);
    });
  },

  add_list: function(list_name, callback) {
    add_sublist = this.add_sublist;
    var store = storage(root + '/' + list_name);
    store.make_root(function() {
      add_sublist(list_name, 'todo', function (err, data) {
        add_sublist(list_name, 'keep', function (err, data) {
          add_sublist(list_name, 'toss', function (err, data) {
            callback(null, list_name);
          });
        });
      });
    });
  },

  add_sublist: function(list_name, sublist_name, callback) {
    var store = storage(root + '/' + list_name + '/' + sublist_name);
    store.make_root(function() {
      callback(null, root + '/' + list_name + '/' + sublist_name);
    })
  },

  remove_list: function(list_name, callback) {
    callback(null, list_name)
  },

  show_list: function(list_name, selection, callback) {
    var store = storage(root + '/' + list_name + '/' + selection);
    store.list(callback);
  }
}