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
      return this.wrap(this.promise_.then, Automator.invokeAction.apply(null, arguments));
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
    invokeAction: function () {
      var args = _.toArray(arguments);
      var first = args.shift();

      if (_.isFunction(first)) {
        return Automator.invokeFunctionAction(first);
      } else {
        return Automator.invokeNameAction(first, args);
      }
    },
    invokeFunctionAction: function(func) {
      return function (target) {
        return func.call(target, target);
      };
    },
    invokeNameAction: function(name, args) {
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
