(function () {
  'use strict';

  var GroupPagge = PageObject.extend({
    names: {
      1: '#collapseOne',
      2: '#collapseTwo',
      3: '#collapseThree'
    },
    switchParent: function () {
      return this.parent;
    },
    clickAt: function (number) {
      this.click('[href="' + this.names[number] + '"][data-toggle="collapse"]');
      return this;
    }
  });

  var DialogPage = PageObject.extend({
    switchParent: function () {
      return this.parent;
    },
    clickClose: function () {
      this.click('#close');
      return this.switchParent();
    },
    isShown: function () {
      return this.$el.hasClass('in');
    }
  });

  var AppPage = PageObject.extend({
    switchModal: function () {
      return new DialogPage({
        el: this.$('#myModal'),
        parent: this
      });
    },
    switchGroup: function () {
      return new GroupPagge({
        el: this.$('#accordion'),
        parent: this
      });
    },
    clickOpenModal: function () {
      this.click('#open-dialog');
      return this.switchModal();
    }
  });

  var app = new AppPage();

  var makeWrapper = function (target, makeProxy) {
    return _.chain(target)
      .functions()
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
      return function () {
        var args = _.toArray(arguments);

        return wrap(automator.action(function (target) {
          var method = target[name];
          if (!method) {
            throw new Error('Cannot find "' + name + '" method in "' + target + '".');
          }
          var result = target[name].apply(target, args);
          return (result && result.then) || $(document).promiseTransition(result);
        }), page);
      };
    };

    var makeAutomatorProxy = function (name) {
      return function () {
        var args = _.toArray(arguments);
        var filter = args[0];
        args[0] = function () {
          var result = filter.apply(filter, arguments);
          return (result && result.automator_) || result;
        };
        return wrap(automator[name].apply(automator, args), page);
      };
    };

    var pageWrapper = makeWrapper(page, makePageProxy);
    var automatorWrapper = makeWrapper(automator, makeAutomatorProxy);

    return _.extend(wrapped, pageWrapper, automatorWrapper);
  };

  var automator2 = function (page) {
    return wrap(automator(page), page);
  };

  $(document).on('click', '#test6', function () {
    automator2(app)
      .test(function (app) {
        console.log(!app.switchModal().isShown());
      })
      .clickOpenModal()
      .scope(function (dialog) {
        return automator2(dialog)
          .test(function () {
            console.log(dialog.isShown());
          })
          .clickClose();
      })
      .test(function (app) {
        console.log(!app.switchModal().isShown());
      })
      .clickOpenModal()
      .scope(function (dialog) {
        return automator2(dialog)
          .clickClose();
      })
      .switchGroup()
      .scope(function (group) {
        return automator2(group)
          .clickAt(1)
          .clickAt(2)
          .clickAt(1)
          .switchParent();
      })
      .done(function () {
        console.log('DONE');
      });
  });
})();
