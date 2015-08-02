'use strict';

var Backbone = require('backbone');
var _ = require('underscore');
var TimetableModuleCollection = require('../../common/collections/TimetableModuleCollection');
var SelectedModulesController = require('../../common/controllers/SelectedModulesController');

// Common terminology throughout project is to refer to lessons instead of
// classes, as class is a keyword in JavaScript.
module.exports = Backbone.Model.extend({
  validate: function (attributes) {
    if (attributes.name.length + attributes.url.length < 1) {
      return 'record cannot be blank';
    }
  },
  initialize: function () {
    if (this.get('timetable')) {
      var selectedModules = TimetableModuleCollection.fromQueryStringToJSON(this.get('timetable').queryString);
      var that = this;
      var selectedModulesController = new SelectedModulesController({
        semester: this.get('timetable').semester,
        saveOnChange: false
      });

      _.each(selectedModules, function (module) {
        selectedModulesController.selectedModules.add({
          ModuleCode: module.ModuleCode,
          Semester: that.get('timetable').semester
        }, module);
      });

      this.set('moduleInformation', selectedModulesController.selectedModules);
      
      selectedModulesController.selectedModules.on('change', function () {
        that.collection.trigger('change');
      });
    }
  }
});
