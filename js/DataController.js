var dataController = (function() {

  var Person = function(name, minutes) {
    this.name = name;
    this.minutes = minutes;
  };

  var data = [];

  return {
    addItem: function(name, minutes) {
      var newItem;
      newItem = new Person(name, minutes);

      data.push(newItem);
    },

    getData: function() {
      return data;
    },

    resetData: function() {
      data = [];
    }
  };

})();