$('.listpage').on('click', function () {
  location.href = '/dolpic-admin/hashTagList/' + $(this).data("page");
});

var bExec = false;
$(function () {
  $('.delete').click(function () { fnDeleteImage($(this).data("seq")); })
});

function fnDeleteImage(seq) {
  if (bExec) {
    BootstrapDialog.show('작업중', '요청을 처리중입니다.<br>잠시만 기다려주세요.',
                          BootstrapDialog.TYPE_DANGER, 'size-normal', false, false, '');
    return;
  }

  BootstrapDialog.confirm('이미지 삭제!!', '정말 삭제할꺼야????', BootstrapDialog.TYPE_DANGER,
                          'normal', '삭제 무서워~ 하지마~~', 'glyphicon-stop',
          '삭제해버려!', 'glyphicon-trash',
          function () {
            deleteImage(seq);
          }
  );
}

function deleteImage(seq) {
  bExec = true;

  $.ajax({
	  url     : "/dolpic-admin/image",
	  type    : "DELETE",
	  dataType: "json",
	  data    : {
		  "imageId": seq
	  }
  })
  .done(function (data) {
    BootstrapDialog.show('이미지 삭제', data.message, BootstrapDialog.TYPE_INFO,
                          'size-small', false, true,
                          function () {
                            window.location.reload();
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