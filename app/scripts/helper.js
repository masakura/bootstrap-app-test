(function () {
  'use strict';

  var toArray = function(args) {
    var array = new Array(args.length);
    for (var i = 0; i < args.length; i++) {
      array[i] = args[i];
    }
    return array;
  };

  var emulateTransitionEnd = $.fn.emulateTransitionEnd;
  /*
    $.fn.emulateTransitionEnd = function () {
    return emulateTransitionEnd.call(this, 0);
    };
  */

  var Queue = function () {
    this.count_ = 0;
    this.executers_ = [];
  };

  Queue.prototype.isEmpty = function () {
    return this.count_ <= 0;
  };

  Queue.prototype.start = function () {
    this.count_++;
  };

  Queue.prototype.end = function () {
    if (this.isEmpty()) {
      return;
    }

    this.count_--;

    if (this.isEmpty()) {
      this.executeAll_();
    }
  };

  Queue.prototype.register = function (executer) {
    this.executers_.push(executer);

    if (this.isEmpty()) {
      this.executeAll_();
    }
  };

  Queue.prototype.executeAll_ = function () {
    setTimeout($.proxy(this.executeAllDirect_, this), 11);
  };

  Queue.prototype.executeAllDirect_ = function () {
    var executers = this.executers_;
    this.executers_ = [];

    executers.forEach(function (executer) { executer(); });
  };

  var Waiter = function (optQueue) {
    this.queue_ = optQueue || new Queue();
  };

  Waiter.prototype.start = function () {
    this.queue_.start();
  };

  Waiter.prototype.end = function () {
    this.queue_.end();
  };

  Waiter.prototype.promise = function () {
    var deferred = $.Deferred();

    var args = toArray(arguments);
    this.queue_.register(function () { deferred.resolve(args[0][0]); });

    return deferred.promise();
  };

  $.fn.initializePromiseTransition = function () {
    var waiter = new Waiter();

    $(this).data('promise.transition', waiter);

    var types = ['bs.modal', 'bs.collapse'];
    var names = ['show', 'shown', 'hide', 'hidden'];

    var events = new Array(names.length * types.length);
    var index = 0;
    for (var i = 0; i < types.length; i++) {
      for (var j = 0; j < names.length; j++) {
        events[index] = names[j] + '.' + types[i];
        index++;
      }
    }

    $(document).on(events.join(' '), '*', function (e) {
      console.log('{' + e.type + '}');
      if (e.type === 'show' || e.type === 'hide') {
        waiter.start();
      } else {
        waiter.end();
      }
    });

    return this;
  };

  $.fn.promiseTransition = function () {
    return $(this).data('promise.transition').promise(toArray(arguments));
  };
})();
