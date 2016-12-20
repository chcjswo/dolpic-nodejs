$(function () {
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
  for (var i = 0; i < data.length; i++) {
    var url = '/pics/view/'
            + data[i].hashTagId.twitterHashTag + '/'
            + data[i].hashTagId._id + '/'
            + data[i]._id + '/1';

    html += "<div class='gbox transition' style='background:url(";
    html += data[i].url;
    html += ") center center no-repeat;background-size:cover' ";
    html += "onclick='location.href=\"" + url + "\"'>";
    html += "<div class='gbox_thumb g_t_twitter' style='display: none;'>";
    html += "<div class='gbox_t_title'>@" + data[i].hashTagId.twitterHashTag;
    html += "</div><div class='gbox_t_text'><img src='/images/icon_like.png' height='9' alt='like'>";
    html += data[i].likeCount;
    html += "</div></div></div>";
  }
  html += "<div class='clear'></div>";
  $('.dolpiclist').append(html);
}