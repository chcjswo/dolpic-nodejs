var bExec = false;
$(function () {
  // $('.make').click(function () {
  //   window.open("/dolpic-admin/hashTagMake", "popupWindow", "width=440,height=240,scrollbars=no");
  // });
  $('.json-make').click(function () {
    fnMakeToJson();
  });
  $('.update').click(function () {
    fnHaghTagUpdate($(this).data("seq"));
  });
  $('.delete').click(function () {
    fnHaghTagDelete($(this).data("seq"));
  });
  $('#hashTagMake').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget);// Button that triggered the modal
    var recipient = button.data('whatever');// Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here,
    // but you could use a data binding library or other methods instead.
    var modal = $(this);
    modal.find('.modal-title').text('해쉬태그 만들기');
    //modal.find('.modal-body input').val(recipient);
    modal.find(".modal-dialog").css("width", "400px");
  });
});

function fnMakeToJson() {
  if (bExec) {
    BootstrapDialog.show('작업중', '요청을 처리중입니다.<br>잠시만 기다려주세요.',
                        BootstrapDialog.TYPE_DANGER, 'size-normal', false, false, '');
    return;
  }

  BootstrapDialog.confirm('json 파일 만들기!!', 'json 파일로 만들깝쇼????',
                          BootstrapDialog.TYPE_INFO, 'small',
                          '아직 만들지마~~', 'glyphicon-stop',
                          'OK', 'glyphicon-floppy-save',
                          function() { makeToJson(); }
  );
}

function makeToJson() {
  bExec = true;

  $.ajax({
	  url     : "/dolpic-admin/makeHashTagToJson",
	  type    : "POST",
	  dataType: "json"
  })
  .done(function (data) {
    BootstrapDialog.show('json 만들기', data.message, BootstrapDialog.TYPE_INFO,
                        'size-small', false, false, function() {
      window.location.reload();
    });
  })
  .fail(function () {
    BootstrapDialog.show('에러', '실행중 에러가 발생했습니다.', BootstrapDialog.TYPE_DANGER,
                        'size-small', false, false, function() {
      window.location.reload();
    });
  })
  .always(function () {
    bExec = false;
  });
}

function fnHaghTagUpdate(seq) {
  window.open("/dolpic-admin/hashTagUpdate/" + seq, "popupWindow", "width=440,height=240,scrollbars=no");
}

function fnHaghTagDelete(seq) {
  if (bExec) {
    BootstrapDialog.show('작업중', '요청을 처리중입니다.<br>잠시만 기다려주세요.',
                          BootstrapDialog.TYPE_DANGER, 'size-normal', false, false, '');
    return;
  }

  BootstrapDialog.confirm(
          '해쉬태그 삭제!!', '정말 삭제할꺼야????<br>삭제하면 이미지도 전부 지워지는데???',
          BootstrapDialog.TYPE_DANGER, 'normal',
          '삭제 무서워~ 하지마~~', 'glyphicon-stop',
          '삭제해버려!', 'glyphicon-trash',
          function () {
            deleteTag(seq);
          }
  );
}

function deleteTag(seq) {
  bExec = true;

  $.ajax({
	  url     : "/dolpic-admin/hashTagDelete",
	  type    : "DELETE",
	  dataType: "json",
	  data    : {
		  "hashTagSeq": seq
	  }
  })
  .done(function (data) {
    BootstrapDialog.show('해쉬태그 삭제', data.message, BootstrapDialog.TYPE_INFO,
                          'size-small', false, true, function() {
      window.location.reload();
    });
  })
  .fail(function () {
    BootstrapDialog.show('에러', '실행중 에러가 발생했습니다.', BootstrapDialog.TYPE_DANGER,
                          'size-small', false, false, function() {
      window.location.reload();
    });
  })
  .always(function () {
    bExec = false;
  });
}

$(function () {
  $('.addHashTag').click(function () { fnHashTagInsert(); });
  $('.twitterHashTag').focus();
});

function fnHashTagInsert() {
  if (bExec) {
    BootstrapDialog.show('작업중', '요청을 처리중입니다.<br>잠시만 기다려주세요.',
                          BootstrapDialog.TYPE_DANGER, 'size-normal', false, false, '');
    return;
  }
  if ($('.twitterHashTag').val() == "") {
    BootstrapDialog.show('확인', '트위터 태그를 입력하세요', BootstrapDialog.TYPE_WARNING,
                          'size-small', false, false, '');
    return;
  }
  bExec = true;

  $.ajax({
	  url     : "/dolpic-admin/hashTagMake",
	  type    : "POST",
	  dataType: "json",
	  data    : {
		  "initial"       : $('.initial').val(),
		  "twitterHashTag": $('.twitterHashTag').val(),
		  "instaHashTag"  : $('.instaHashTag').val()
	  }
  })
  .done(function (data) {
    BootstrapDialog.show('해쉬태그 등록', data.message, BootstrapDialog.TYPE_INFO,
                          'size-small', false, true,
                          function () {
                            if (data.code == 0) {
                              window.location.reload();
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