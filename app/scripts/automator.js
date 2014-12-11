var automator = (function ($, _) { // jshint ignore:line
  'use strict';

  var Automator = function (promise) {
    this.promise_ = promise;
  };

  _.extend(Automator.prototype, {
    done: function () {
      return this.wrap(this.promise_.done, arguments);
    },
    test: function (testFilter) {
      return this.wrap(this.promise_.then, Automator.returnTarget(testFilter));
    },
    action: function () {
      var args = _.toArray(arguments);
      var name = args.shift();

      return this.wrap(this.promise_.then, Automator.invokeAction(name, args));
    },
    wrap: function (func, args) {
      var promise = this.promise_;
      args = _.isArray(args) ? args : [args];

      return Automator.wrap(func.apply(promise, args));
    }
  });

  _.extend(Automator, {
    wrap: function (promise) {
      return new Automator(promise);
    },
    returnTarget: function (filter) {
      return function () {
        var args = _.toArray(arguments);
        filter.apply(filter, args);
        return _.first(args);
      };
    },
    invokeAction: function (name, args) {
      return function (target) {
        return target[name].apply(target, args);
      };
    }
  });

  var automator = function (target) {
    var promise = $.Deferred().resolve(target).promise();

    return Automator.wrap(promise);
  };

  return automator;
})($, _);
