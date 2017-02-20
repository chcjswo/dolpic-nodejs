$(document).ready(function() {
	fnResize();
	$('.vbox').dblclick(function(e) {
		fnImageLike();
	});
});

function fnResize() {
	$('.gbox').on({
		mouseenter: function() {$('.gbox_thumb',this).fadeIn(300);$('.gbox_thumb',this).parent("div").addClass('transition');},
		mouseleave: function() {$('.gbox_thumb',this).fadeOut(100);$('.gbox_thumb',this).parent("div").removeClass('transition');}
	});
	$('.dolpic_lbox').on({
		mouseenter: function() {$(this).children('.dolpic_limg').addClass('ihover');},
		mouseleave: function() {$(this).children('.dolpic_limg').removeClass('ihover');}
	});

}