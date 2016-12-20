var bExec = false;
$(function () {
  $('.delete').click(function () {
    fnDeleteUser($(this).data("seq"));
  });
});

function fnDeleteUser(seq) {
  if (bExec) {
    BootstrapDialog.show('작업중', '요청을 처리중입니다.<br>잠시만 기다려주세요.',
                          BootstrapDialog.TYPE_DANGER, 'size-normal', false, false, '');
    return;
  }

  BootstrapDialog.confirm(
          '회원 삭제!!', '정말 삭제할꺼야????', BootstrapDialog.TYPE_DANGER,
          'normal', '삭제 무서워~ 하지마~~', 'glyphicon-stop',
          '삭제해버려!', 'glyphicon-trash',
          function () {
            deleteUser(seq);
          }
  );
}

function deleteUser(seq) {
  bExec = true;

  $.ajax({
	  url     : "user",
	  type    : "DELETE",
	  dataType: "json",
	  data    : {
		  "username": seq
	  }
  })
  .done(function (data) {
    BootstrapDialog.show('유저 삭제', data.message, BootstrapDialog.TYPE_INFO,
                        'size-small', false, true,
                        function () {
                          if (data.code == 0) {
                            window.location.reload();
                          }
                        });
  })
  .fail(function () {
    BootstrapDialog.show('에러', '실행중 에러가 발생했습니다.', BootstrapDialog.TYPE_DANGER,
                        'size-small', false, false,
                        function() {
                          window.location.reload();
                        });
  })
  .always(function () {
    bExec = false;
  });
}