(function () {
  'use strict';

  var GroupPage = PageObject.extend({
    names: ['collapseOne', 'collapseTwo', 'collapseThree'],
    clickAt: function (index) {
      this.$('[href="#' + this.names[index] + '"][data-toggle="collapse"]').trigger('click');
      return $(document).promiseTransition(this);
    },
    clickAt2: function (index) {
      return this.clickAt(index);
    },
    isShownAt: function (index) {
      return $('#' + this.names[index]).hasClass('in');
    },
    switchRoot: function () {
      return rootPage;
    }
  });

  var ModalPage = PageObject.extend({
    isShown: function () {
      return this.$el.hasClass('in');
    },
    switchRoot: function () {
      return rootPage;
    },
    clickClose: function () {
      this.$('#close').trigger('click');
      return $(document).promiseTransition(rootPage);
    }
  });

  var ContextMenuPage = PageObject.extend({
    isShown: function () {
      return this.$el.hasClass('in');
    }
  });

  var ProgressPage = PageObject.extend({
    getValue: function () {
      return this.$el.attr('aria-valuenow');
    }
  });

  var RootPage = PageObject.extend({
    switchCollapseGroup: function () {
      return new GroupPage(this.$('#group-collapse'));
    },
    switchModal: function () {
      return new ModalPage(this.$('#myModal'));
    },
    switchContextMenu: function () {
      return new ContextMenuPage(this.$('#context-menu'));
    },
    switchProgress: function () {
      return new ProgressPage(this.$('#progressbar'));
    },
    clickOpenModal: function () {
      $('#open-dialog').trigger('click');
      return $(document).promiseTransition(this.switchModal());
    },
    clickCollapse: function () {
      $('#collapse').trigger('click');
      return $(document).promiseTransition(this);
    },
    clickProgress: function(label) {
      $('#progress-' + label).trigger('click');
      return $(document).promiseTransition(this);
    }
  });

  var rootPage = new RootPage($(document));

  $(document).on('click', '#test1', function () {
    $.Deferred().resolve(rootPage).promise()
      .then(function (root) {
        return root.switchCollapseGroup();
      })
      .then(function (group) {
        return group.clickAt(0);
      })
      .then(function (group) {
        console.log(!group.isShownAt(0));
        return group;
      })
      .then(function (group) {
        return group.clickAt2(0);
      })
      .then(function (group) {
        console.log(group.isShownAt(0));
        return group;
      })
      .then(function (group) {
        return group.switchRoot();
      })
      .then(function (root) {
        console.log(!root.switchModal().isShown());
        return root;
      })
      .then(function (root) {
        return root.clickOpenModal();
      })
      .then(function (modal) {
        console.log(modal.isShown());
        return modal;
      })
      .then(function (modal) {
        return modal.clickClose();
      })
      .then(function (root) {
        console.log(!root.switchModal().isShown());
        return root;
      })
      .then(function (root) {
        console.log(!root.switchContextMenu().isShown());
        return root;
      })
      .then(function (root) {
        return root.clickCollapse();
      })
      .then(function (root) {
        console.log(root.switchContextMenu().isShown());
      })
      .then(function (root) {
        return root.clickCollapse();
      })
      .then(function (root) {
        console.log(!root.switchContextMenu().isShown());
      })
      .done(function () { console.log('DONE'); });
  });

  $(document).on('click', '#test2', function () {
    automator(rootPage)
      .action('switchCollapseGroup')
      .action('clickAt', 0)
      .test(function (group) {
        console.log('0: ' + !group.isShownAt(0));
      })
      .action('clickAt2',0)
      .test(function (group) {
        console.log('0: ' + group.isShownAt(0));
      })
      .action('switchRoot')
      .test(function (root) {
        console.log(!root.switchModal().isShown());
      })
      .action('clickOpenModal')
      .test(function (modal) {
        console.log(modal.isShown());
      })
      .action('clickClose')
      .test(function (root) {
        console.log(!root.switchModal().isShown());
      })
      .test(function (root) {
        console.log(!root.switchContextMenu().isShown());
      })
      .action('clickCollapse')
      .test(function (root) {
        console.log(root.switchContextMenu().isShown());
      })
      .action('clickCollapse')
      .test(function (root) {
        console.log(!root.switchContextMenu().isShown());
      })
      .action('clickProgress', 'min')
      .test(function (root) {
        console.log(root.switchProgress().getValue() === '1');
      })
      .action('clickProgress', 'max')
      .test(function (root) {
        console.log(root.switchProgress().getValue() === '100');
      })
      .action('clickProgress', 'middle')
      .test(function (root) {
        console.log(root.switchProgress().getValue() === '50');
      })
      .done(function () { console.log('DONE!'); });
  });

  $(document).on('click', '#test3', function () {
    automator(rootPage)
      .action(function (root) { return root.clickOpenModal(); })
      .action(function (dialog) { return dialog.clickClose(); })
      .action(function (root) { return root.switchCollapseGroup(); })
      .action('clickAt', 0)
      .action(function (group) { return group.clickAt(1); })
      .done(function () { console.log('DONE'); });
  });

  $(document).on('click', '#test4', function () {
    automator(rootPage)
      .action(function (root) {
        return automator(root)
          .action('clickOpenModal')
          .test(function (dialog) {
            console.log(dialog.isShown());
          })
          .action(function (dialog) {
            return dialog.clickClose();
          });
      })
      .action(function (root) { return root.switchCollapseGroup(); })
      .action('clickAt', 0)
      .action(function (group) { return group.clickAt(1); })
      .done(function () { console.log('DONE'); });
  });
})();
