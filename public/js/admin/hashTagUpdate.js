var bExec = false;
$(function () {
  $('.make').click(function () { fnHashTagUpdate(); });
  $('.tag').focus();
});

function fnHashTagUpdate() {
  if (bExec) {
    BootstrapDialog.show('작업중', '요청을 처리중입니다.<br>잠시만 기다려주세요.',
                          BootstrapDialog.TYPE_DANGER, 'size-normal', false, false, '');
    return;
  }
  if ($('.twitterHashTag').val() == "") {
    BootstrapDialog.show('확인', '태그를 입력하세요', BootstrapDialog.TYPE_WARNING,
                         'size-small', false, false, '');
    return;
  }
  bExec = true;

  $.ajax({
	  url     : "/dolpic-admin/hashTagUpdate",
	  type    : "PUT",
	  dataType: "json",
	  data    : {
		  "hashTagSeq"    : $('input[name=hashTagId]').val(),
		  "initial"       : $('.initial').val(),
		  "twitterHashTag": $('.twitterHashTag').val(),
		  "instaHashTag"  : $('.instaHashTag').val()
	  }
  })
  .done(function (data) {
    BootstrapDialog.show('해쉬태그 수정', data.message, BootstrapDialog.TYPE_INFO,
                          'size-small', false, true,
                          function () {
                            if (data.code == 0) {
                              window.opener.parent.location.reload();
                              self.close();
                            }
                          });
  })
  .fail(function () {
    BootstrapDialog.show('에러', '실행중 에러가 발생했습니다.', BootstrapDialog.TYPE_DANGER,
                          'size-small', false, false, '');
  })
  .always(function () {
    bExec = false;
  });
}