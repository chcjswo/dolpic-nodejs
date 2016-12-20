$(function () {
  $('.gbox').on('click', function() {
    location.href = '/pics/view/'
                    + $(this).data('hashtag') + '/'
                    + $(this).data('hashtagid') + '/'
                    + $(this).data('imageid') + '/'
                    + $(this).data('page');
  });
  $('.gbox_list li').on('click', function() {
    location.href = $(this).data('gotourl');
  });
  $('.tbox').on('click', function () {
    fnAddSubscribe($(this).data('hashtagid'));
  });
});

function fnAddSubscribe(hashTagId) {
  bExec = true;
  $.ajax({
	  url     : '/api/addSubscribe',
	  type    : 'POST',
	  dataType: "json",
	  data    : {
		  'hashTagId': hashTagId
	  }
  })
  .done(function (data) {
    var message = data.message;
    var code = data.code;
    if (message) {
      alert(message);
    }
    if (code == 0 || code == 1) {
      $('.tbox').attr('class', 'tbox disable');
      $('.tbox').attr('onclick', '').unbind('click');
    }
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
  });
}