$(function() {
	fnShowMySubscibe();

  $('input[name="search"]').keyup(function(e) {
    if (e.keyCode == 13) fnShowMySubscibe();
 	});
});

function fnShowMySubscibe() {
  bExec = true;
  $.ajax({
    url: '/api/mypage',
    type: 'POST',
    dataType: "json",
    data: {
      'hashTag': $('input[name="search"]').val()
    }
  })
  .done(function (data) {
    $('#mylist').empty();
    for (var i=0; i<data.length; i++) {
      var html = "";
      var url = '/pics/list/' + data[i].twitterHashTag + '/' + data[i]._id;
      html+="<div class='dolpic_lbox' id='subscibe-" + i +"'>";
      html+="<div class='dolpic_limg' style='background:url(";
      html+=data[i].image + ") ";
      html+="center center no-repeat;background-size:cover' onclick='location.href=\"" + url + "\"'></div>";
      html+="<div class='dolpic_lname'>" + data[i].twitterHashTag + "</div>";
      html+="<div class='dolpic_lsscpt'><span class='s_count'>" + numberString(data[i].subscriberCount);
      html+="</span> 구독 중</div>";
      html+="<span class='tbox disable' onclick='fnSubscribDelete(\"" + data[i]._id + "\", " + i + ")'>구독 해지</span></div>";
      $('#mylist').append(html);
    }
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
    $('#loading').hide();
  });
}

function fnSubscribDelete(hashTagId, index) {
  bExec = true;
  $.ajax({
    url: '/api/mypage',
    type: 'DELETE',
    dataType: "json",
    data: {
      "hashTagId": hashTagId
    }
  })
  .done(function (data) {
		$('#subscibe-' + index).hide();
  })
  .fail(function () {
    alert('실행중 에러가 발생했습니다.');
  })
  .always(function () {
    bExec = false;
  });
}