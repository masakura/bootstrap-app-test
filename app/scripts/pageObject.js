var PageObject = (function (_) { // jshint ignore:line
  'use strict';

    var PageObject = function ($el) {
    this.$el = $el || $(document);
  };

  _.extend(PageObject.prototype, {
    $: function () {
      return this.$el.find.apply(this.$el, arguments);
    }
  });

  _.extend(PageObject, {
    extend: function (properties, optClassProperties) {
      var parent = this;
      var child = function () { return parent.apply(this, arguments); };

      _.extend(child.prototype, PageObject.prototype, properties);
      _.extend(child, optClassProperties);

      return child;
    }
  });

  return PageObject;
})(_);
