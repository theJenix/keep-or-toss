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
    var store = storage(root + '/' + list_name);
    store.make_root(function() {
      callback(null, list_name);
    });
  },

  remove_list: function(list_name, callback) {
    callback(null, list_name)
  },

  show_list: function(list_name, selection, callback) {
    var store = storage(root + '/' + list_name + '/' + selection);
    store.list(callback);
  }
}