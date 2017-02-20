$(function () {
  fnShowRecommendImageList();
  fnPrev();
  fnNext();
  $('ul.gbox_list li:eq(0)').on('click', function() {
    location.href='/';
  });
  $('ul.gbox_list li:eq(2)').on('click', function() {
    location.href='/pics/list/' + $('input[name=hashTag]').val() + '/' + $('input[name=hashTagId]').val();
  });
  $('.vbox div:eq(0)').hide();
	$('.tbox').on('click', function () {
   fnAddSubscribe($(this).data('hashtagid'));
 	});
});

function fnShowRecommendImageList() {
  bExec = true;
  var hashTagId = $('input[name=hashTagId]').val();
  var page = $('input[name=page]').val();
  $.ajax({
	  url     : '/api/recommendImages',
	  type    : 'POST',
	  dataType: "json",
	  data    : {
		  'hashTagId': hashTagId
    }
  })
  .done(function (data) {
    for (var i=0; i<data.length; i++) {
      var gotoUrl = "/pics/view/" +
                    data[i].hashTagId.twitterHashTag + "/" +
                    hashTagId + "/" +
                    data[i].id + "/" +
                    page;
      var html = "";
      html += "<div data-gotoUrl='" + gotoUrl + "' class='gbox' style='background:url(" + data[i].url + ") ";
      html += "center center no-repeat;background-size:cover'>";
      if (data[i].urlType == 1)
        html += "<div class='gbox_thumb g_t_twitter'>";
      else
        html += "<div class='gbox_thumb g_t_instagram'>";
      html += "<div class='gbox_t_title'>@" + data[i].hashTagId.twitterHashTag + "</div>";
      html += "<div class='gbox_t_text'>";
      html += "<img src=''/images/icon_like.png' height='9'>" + data[i].likeCount + "</div>";
      html += "</div>";
      html += "</div>";
      $('.gbox_recommend').append(html);
    }
    $('.gbox_recommend .gbox').on('click', function() {
      location.href = $(this).data('gotourl');
    });
    fnResize();
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
    $('.gbox_recommend div:eq(0)').hide();
  });
}

function fnImageLike() {
  bExec = true;
  $.ajax({
	  url     : '/api/addImageLike',
	  type    : 'POST',
	  dataType: "json",
	  data    : {
		  'hashTag'  : $('input[name=hashTag]').val(),
		  'hashTagId': $('input[name=hashTagId]').val(),
		  'imageId'  : $('input[name=imageId]').val()
    }
  })
  .done(function (data) {
    if (data.code == 1) {
      alert(data.message);
      location.href='/users/login?returnUrl=' + $(location).attr('pathname');
    } else if (data.code == 9) {
			alert(data.message);
			return;
		} else {
      $('.like_box').fadeIn('swing').delay(200).fadeOut('fast');
      $('.btn_good').addClass('on');
      $('.btn_good').attr('onclick', '').unbind('click');
    }
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
  });
}

function fnPrev() {
  bExec = true;
  $.ajax({
	  url     : '/api/getImagePrev',
	  type    : 'POST',
	  dataType: "json",
	  data    : {
		  'hashTag'  : $('input[name=hashTag]').val(),
		  'hashTagId': $('input[name=hashTagId]').val(),
		  'imageId'  : $('input[name=imageId]').val()
	  }
  })
  .done(function (data) {
    if (data.prev == 'null') {
      $('ul.gbox_list li:eq(1)').addClass('on');
    } else {
      $('ul.gbox_list li:eq(1)').on('click', function () {
        var url = '/pics/view/' + $('input[name=hashTag]').val() + '/';
        url += $('input[name=hashTagId]').val() + '/' + data.prev + '/';
        url += $('input[name=page]').val();
        location.href = url;
      });
    }
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
  });
}

function fnNext() {
  bExec = true;
  $.ajax({
	  url     : '/api/getImageNext',
	  type    : 'POST',
	  dataType: "json",
	  data    : {
		  'hashTag'  : $('input[name=hashTag]').val(),
		  'hashTagId': $('input[name=hashTagId]').val(),
		  'imageId'  : $('input[name=imageId]').val()
	  }
  })
  .done(function (data) {
    if (data.next == 'null') {
      $('ul.gbox_list li:eq(3)').addClass('on');
    } else {
      $('ul.gbox_list li:eq(3)').on('click', function () {
        var url = '/pics/view/' + $('input[name=hashTag]').val() + '/';
        url += $('input[name=hashTagId]').val() + '/' + data.next + '/';
        url += $('input[name=page]').val();
        location.href = url;
      });
    }
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
  });
}

function fnImageReport() {
  bExec = true;
  $.ajax({
	  url     : '/api/imageReport',
	  type    : 'POST',
	  dataType: "json",
	  data    : {
		  'hashTag'  : $('input[name=hashTag]').val(),
		  'hashTagId': $('input[name=hashTagId]').val(),
		  'imageId'  : $('input[name=imageId]').val()
	  }
  })
  .done(function (data) {
    alert(data.message);
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
  });
}

function fnAddSubscribe(hashTagId) {
  bExec = true;
  $.ajax({
	  url     : '/api/addSubscribe',
	  type    : 'POST',
	  dataType: "json",
    data: {
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