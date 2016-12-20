$(".login_box .btn_login").on("click", function() { fnLogin(); });

var blank_pattern = /^\s+|\s+$/g;
var input_pattern = /^[A-Za-z0-9+]{4,12}$/;

function fnLogin() {
	if ($('input[name="username"]').val().replace(blank_pattern, "") == "") {
		alert("아이디를 입력해주세요.");
		return;
	}

	if ($('input[name="password"]').val().replace(blank_pattern, "") == "") {
		alert("패스워드를 입력해주세요.");
		return;
	}

	$("form").submit();
}

$(function() {
	$('input[name="username"]').focus();
	$('input[name="password"]').keyup(function(e) {
		if (e.keyCode == 13) fnLogin();
	});
});