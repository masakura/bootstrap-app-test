var PageObject = (function (_, $) { // jshint ignore:line
  'use strict';

  var PageObject = function (options) {
    var el;
    if (options instanceof PageObject.$ || options instanceof HTMLElement) {
      el = options;
    } else if (options && options.el) {
      el = options.el;
    } else if (this.el) {
      el = this.el;
    } else {
      el = document;
    }

    if (_.isFunction(el)) {
      el = el.call(this, options);
    } else if (el instanceof PageObject.$) {
      el = el[0];
    }

    this.el = el;
    this.$el = $(el);
    this.parent = options ? options.parent : undefined;
  };

  _.extend(PageObject.prototype, {
    $: function () {
      return this.$el.find.apply(this.$el, arguments);
    },
    click: function (selector) {
      this.$(selector).trigger('click');
    }
  });

  _.extend(PageObject, {
    $: $,
    extend: function (properties, optClassProperties) {
      var parent = this;
      var child = function () { return parent.apply(this, arguments); };

      _.extend(child.prototype, PageObject.prototype, properties);
      _.extend(child, optClassProperties);

      return child;
    }
  });

  return PageObject;
})(_, $);
