(function () {
  'use strict';

  var GroupPage = PageObject.extend({
    clickClose: function () {
      this.click('#close');
      return this.parent;
    }
  });

  var AppPage = PageObject.extend({
    clickOpenModal: function () {
      this.click('#open-dialog');
      return new GroupPage({
        el: this.$('#myModal'),
        parent: this
      });
    }
  });

  var app = new AppPage();

  var makeWrapper = function (target, makeProxy, names) {
    if (!names) {
      names = [];
      for (var n in target) {
        names.push(n);
      }
    }

    return _.chain(names)
      .map(function (name) {
        return [name, makeProxy(name)];
      })
      .object()
      .value();
  };

  var wrap = function (automator, page) {
    var wrapped = {
      automator_: automator
    };

    var makePageProxy = function (name) {
      return wrap(automator.action(function (target) {
        var result = target[name].apply(target, arguments);
        return $(document).promiseTransition(result);
      }));
    };

    var makeAutomatorProxy = function (name) {
      return function () {
        var args = _.toArray(arguments);
        var filter = args[0];
        args[0] = function () {
          var result = filter.apply(filter, arguments).automator_;
          return result.automator_ ? result.automator_ : result;
        };
        return automator[name].apply(automator, args);
      };
    };

    var pageWrapper = makeWrapper(page, makePageProxy);
console.log(pageWrapper);
    var automatorWrapper = makeWrapper(automator,
                                       makeAutomatorProxy,
                                       ['action', 'scope', 'test', 'done']);

    return _.extend(wrapped, pageWrapper, automatorWrapper);
  };

  var automator2 = function (page) {
    return wrap(automator(page), page);
  };

  $(document).on('click', '#test6', function () {
    automator2(app)
      .clickOpenModal()
      .scope(function (dialog) {
        return automator2(dialog)
          .clickClose();
      })
      .done(function () {
        console.log('DONE');
      });
  });
})();
