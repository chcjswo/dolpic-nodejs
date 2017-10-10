const LoadingBar = {
  none: function () {
    $("#divLoadingBar").hide();
  },
  block: function () {
    $("#divLoadingBar").dialog({
	    width        : 240,
	    height       : 90,
	    draggable    : false,
	    resizable    : false,
	    modal        : true,
	    closeOnEscape: false,
      open: function(event, ui) {
        $(".ui-dialog-titlebar-close", ui.dialog | ui).hide();
      }
    });
    $("div[aria-labelledby = 'ui-dialog-title-divLoadingBar'] a.ui-dialog-titlebar-close").remove();
  }
};

$(function () {
  //Ajax 시작시 로딩바 보여 줌.
  $(document).ajaxStart(function () {
      //LoadingBar.block();
      fnShowLoadingBar();
  });

  //Ajax 완료시 로딩바 감춤.
  $(document).ajaxStop(function () {
      //LoadingBar.none();
      fnHideLoadingBar();
  });
});
let dialog;
function fnShowLoadingBar() {
  //LoadingBar.block();
  dialog = bootbox.dialog({
     message: '<p class=\'text-center\'>잠시만 기다려 주세요...</p>',
     closeButton: false
  });
  return true;
}
function fnHideLoadingBar() {
  //LoadingBar.none();
  dialog.modal('hide');
  return true;
}

$(window).on('beforeunload', function() {
  fnShowLoadingBar();
});

$(window).load(function() {
  fnHideLoadingBar();
});

function fnValidUrl(str) {
  const pattern = new RegExp('^(http|https|market)\://?' + // 프로토콜
  '((([a-z\d](([a-z\d-]*[a-z\d])|([ㄱ-힣]))*)\.)+[a-z]{2,}|' + // 도메인명 <-이부분만 수정됨
  '((\\d{1,3}\\.){3}\\d{1,3}))' + // 아이피
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // 포트번호
  '(\\?[;&a-z\\d%_.~+=-]*)?' + // 쿼리스트링
  '(\\#[-a-z\\d_]*)?$', 'i'); // 해쉬테그들

  return pattern.test(str);
}

/**
 * Confirm  window
 *
 * @param {type} title
 * @param {type} message
 * @param {type} type
 * @param {type} size
 * @param {type} canCelLabel
 * @param {type} cancelIcon
 * @param {type} okLabel
 * @param {type} okIcon
 * @param {type} callback
 * @returns {undefined}
 */
BootstrapDialog.confirm = function (title, message, type, size,
                                    canCelLabel, cancelIcon,
                                    okLabel, okIcon, callback) {
  new BootstrapDialog({
	  title   : title,
	  type    : type,
	  message : message,
	  closable: false,
	  data    : {
		  'callback': callback
	  },
	  size    : 'size-' + size,
	  buttons : [{
		  icon    : 'glyphicon ' + cancelIcon,
		  label   : canCelLabel,
		  cssClass: 'btn-warning',
		  hotkey  : 13,
		  action  : function (dialog) {
			  dialog.close();
		  }
	  }, {
		  icon    : 'glyphicon ' + okIcon,
		  label   : okLabel,
		  cssClass: 'btn-primary',
		  action  : function (dialog) {
			  typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
			  dialog.close();
		  }
	  }]
  }).open();
};

/**
 * Alert window
 *
 * @param {type} title
 * @param {type} message
 * @param {type} buttonType
 * @param {type} size
 * @param {type} animate
 * @param {type} closable
 * @param {type} callback
 * @returns {undefined}
 */
BootstrapDialog.show = function(title, message, buttonType, size, animate, closable, callback) {
  new BootstrapDialog({
	  title   : title,
	  message : message,
	  size    : size,
	  animate : animate,
	  closable: closable,
	  type    : buttonType,
	  data    : {
		  'callback': callback
	  },
	  buttons : [{
		  label : '닫기',
		  hotkey: 13,
		  action: function (dialog) {
			  typeof dialog.getData('callback') === 'function' && dialog.getData('callback')(true);
			  dialog.close();
		  }
	  }]
  }).open();
};