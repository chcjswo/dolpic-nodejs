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
  for (var i=1; i<=6; i++) {
    getList(i);
  }
});

function getList(index) {
  bExec = true;

  var apiUrl = '/api/list';
  if (index == 1)
    apiUrl = '/api/listNew';

  $.ajax({
	  url     : apiUrl,
	  type    : 'POST',
	  dataType: "json",
	  data    : {
		  'index': index
	  }
  })
  .done(function (data) {
    makeList(data, index);
    fnResize();
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
    $('.dolpiclist div:eq(0)').hide();
  });
}

function makeList(data, index) {
  var html = "<div class='dp_title'>";
  if (index == 1) {
    html += "<strong>최신 DolPic</strong>";
    html += "<span class='tbox' onclick='location.href=\"/pics/newList\"'>더 보기</span></div>";
  } else {
    html += "<strong>" + data[0].hashTagId.twitterHashTag + "</strong>";
    html += "<span class='tbox' ";
    html += "onclick='location.href=\"/pics/list/" + data[0].hashTagId.twitterHashTag;
    html += "/" + data[0].hashTagId._id + "\"'>";
    html += "더 보기</span></div>";
  }
  html += "<div class='wrapper'><div class='gbox_gallery'>";
  for (var i = 0; i < data.length; i++) {
    var url = '/pics/view/'
            + data[i].hashTagId.twitterHashTag + '/'
            + data[i].hashTagId._id + '/'
            + data[i]._id + '/1';

    html += "<div class='gbox' style='background:url(";
    html += data[i].url;
    html += ") center center no-repeat;background-size:cover' ";
    html += "onclick='location.href=\"" + url + "\"'></div>";
  }
  html += "<div class='clear'></div>";
  html += "</div></div>";
  $('.dolpiclist').append(html);
}