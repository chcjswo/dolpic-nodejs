$(document).ready(function() {
	fnResize();
});

function fnResize() {
	var gboxDefault = ($('.gbox_gallery').width() - 24) / 3;
	var gboxWide = ($('.gbox_gallery').width() - 40) / 5;
	var lboxDefault = ($('.dolpic_warp .wrapper').width() - 12) / 2;
	var lboxWide = ($('.dolpic_warp .wrapper').width() - 12) / 3;

	if(window.innerHeight > window.innerWidth){
		$('.nowide').hide();
		$('.gbox').css({
			width: gboxDefault,
			height: gboxDefault
		});
		$('.dolpic_lbox').css({
			width: lboxDefault
		});
		$('.hot_box').removeClass('wide');
		$('.ad_wrap').removeClass('wide');
	} else {
		$('.nowide').show();
		$('.gbox').css({
			width: gboxWide,
			height: gboxWide
		});
		$('.dolpic_lbox').css({
			width: lboxWide
		});
		$('.hot_box').addClass('wide');
		$('.ad_wrap').addClass('wide');
	}

	// 화면 전환시 새로고침
	var windowWidth = $(window).width();
	$(window).resize(function() {
		if(windowWidth != $(window).width()){
			location.reload();
		}
	});
}