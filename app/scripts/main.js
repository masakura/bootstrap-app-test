(function () {
  'use strict';

  $(document).ready(function () {
    $(document).initializePromiseTransition();
  });

  $(document).on('click', '#open-dialog', function () {
    $('#open').trigger('click');
    $(document).promiseTransition()
      .done(function () { console.log('animation end'); });
  });

  $(document).on('click', '#kick-close', function () {
    $(document).promiseTransition()
      .done(function () { console.log('animation end'); });

    $('#close').trigger('click');
  });

  $(document).on('click', '#progress', function () {
    $('#progressbar').attr('aria-valuenow', 3).css('width', '3%');
  });

  $(document).on('click', '#collapse', function () {
    $('#context-menu').collapse('toggle');
  });

  $(document).on('click', '#toggle1', function () {
    $('#collapseOne').collapse('toggle');
    console.log($('#collapseOne').attr('class'));
  });

  var makeProgress = function (value) {
    return function () {
      $('#progressbar').attr('aria-valuenow', value).css('width', value + '%');
    };
  };

  $(document).on('click', '#progress-min', makeProgress(1));
  $(document).on('click', '#progress-middle', makeProgress(50));
  $(document).on('click', '#progress-max', makeProgress(100));
})();
