var bExec = false;
$(function() {
  var message = $('input[name="infoMessage"]').val();
  if (message !== '') {
    alert(removeTag(message));
  }
  if ($('#initials').length) {
    fnShowInitialList();
  }
  if ($('ul.hot_box').length) {
    fnShowHotDolpic();
  }

  $(".search").keydown(function (key) {
    if (key.keyCode == 13) {
      fnSearch();
    }
  });
});

function removeTag(html) {
  return html.replace(/(<([^>]+)>)/gi, "");
}

function numberString(number) {
  //if (typeof number == 'undefined') return 0;
  return number.toLocaleString();
}

function fnShowInitialList() {
  bExec = true;
  $.ajax({
	  url : '/api/initials',
	  type: 'POST'
  })
  .done(function (data) {
		var result = data.result;
		var userId = data.userId;
    for (var i=0; i<result.length; i++) {
			var isMatch = false;
      var html = "";
      var url = '/pics/list/' + result[i].twitterHashTag + '/' + result[i]._id;
      html += "<div class='dolpic_lbox'>";
      html += "<div class='dolpic_limg' style='background:url(";
      html += result[i].image + ") ";
      html += "center center no-repeat;background-size:cover' onclick='location.href=\"" + url + "\"'></div>";
      html += "<div class='dolpic_lname'>" + result[i].twitterHashTag + "</div>";
      html += "<div class='dolpic_lsscpt'><span class='s_count'>" + numberString(result[i].subscriberCount);
      html += "</span> 구독 중</div>";
      html += "<span id='subscribe_" + i + "' ";
      for(var j=0; j<result[i].subscriber.length; j++) {
      	if (result[i].subscriber[j].userId == userId) {
					isMatch = true;
      		break;
      	}
      }
      if (isMatch) {
				html += "class='tbox disable'>구독 신청</span></div>";
      } else {
				html += "class='tbox' onclick='fnSubscribReg(\"" + result[i]._id + "\", " + i + ")'>구독 신청</span></div>";
      }
      $('#initials').append(html);
    }
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
    $('#initials div:eq(0)').hide();
  });
}

function fnShowHotDolpic() {
  bExec = true;
  $.ajax({
	  url : '/api/hotdolpics',
	  type: 'POST'
  })
  .done(function (data) {
    for (var i=0; i<data.length; i++) {
      var html = "";
      html += "<li><img src='/images/num_" + (i+1) + ".png' width='16' height='16' alt='1'> ";
      html += "<a href='/pics/list/" + data[i].twitterHashTag + "/";
      html += data[i]._id + "'>" + data[i].twitterHashTag + "</a><span>";
      html += numberString(data[i].likeCount);
      html += " <img src='/images/icon_like.png' height='16'></span></li>";
      $('ul.hot_box').append(html);
    }
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
    $('ul.hot_box li:eq(1)').hide();
  });
}

function fnSubscribReg(hashTagId, index) {
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
    if (code == 0) {
      var subscibeCount = uncomma($('.s_count').eq(index).html());
      subscibeCount++;
      $('.s_count').eq(index).html(numberString(subscibeCount));
      $('#subscribe_' + index).attr('class', 'tbox disable');
      $('#subscribe_' + index).attr('onclick', '').unbind('click');
    }
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
  });
}

function uncomma(str) {
  str = String(str);
  return str.replace(/[^\d]+/g, '');
}

function comma(str) {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
}

function fnSearch() {
  if ($(".search").val() == "") {
      alert('검색어를 입력해주세요');
      return;
  }

  location.href = '/pics/search/' + $(".search").val();
}