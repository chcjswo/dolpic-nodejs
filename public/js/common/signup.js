var errorCode = '#{errorCode}';
if (errorCode == 11000) {
	alert('이미 등록된 아이디입니다.');
	$('input[name="username"]').val('');
}

$(".btn_signup").on("click", function() { fnSignup(); });

var blank_pattern = /^\s+|\s+$/g;
var input_pattern = /^[A-Za-z0-9+]{4,12}$/;

function fnSignup() {
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