$(document).ready(function() {
});
function fnResize() {
	var gboxDefault = ($('.gbox_gallery').width() - 24) / 3;
	var gboxWide = ($('.gbox_gallery').width() - 40) / 5;
	var lboxDefault = ($('.dolpic_warp .wrapper').width() - 12) / 2;
	var lboxWide = ($('.dolpic_warp .wrapper').width() - 12) / 3;
	if(window.innerHeight > window.innerWidth){
		$('.gbox').css({
			width: gboxDefault,
			height: gboxDefault
		});
		$('.dolpic_lbox').css({
			width: lboxDefault
		});
		$('.hot_box').removeClass('wide');
		$('.ad_wrap').removeClass('wide');
		$('#gboxRecmd4, #gboxRecmd5').hide();
	} else {
		$('.gbox').css({
			width: gboxWide,
			height: gboxWide
		});
		$('.dolpic_lbox').css({
			width: lboxWide
		});
		$('.hot_box').addClass('wide');
		$('.ad_wrap').addClass('wide');
		$('#gboxRecmd4, #gboxRecmd5').show();
	}
    if($('.fbar').height() < 75) {
		$('.fbar_wrap').removeClass('more');
		$('.btn_more').hide();
	} else {
		$('.fbar_wrap').addClass('more');
		$('.btn_more').show();
	}
	$('.btn_more').on('click',function() {
		$('.fbar_wrap').removeClass('more');
		$('.btn_more').hide();
	});

	$('.vbox').on('doubletap', function() {
		$('.like_box').fadeIn('swing').delay(200).fadeOut('fast');
	});

	// 화면 전환시 새로고침
	var windowWidth = $(window).width();
	$(window).resize(function() {
		if(windowWidth != $(window).width()){
			location.reload();
		}
	});
}