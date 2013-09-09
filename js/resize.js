var mm_ww=0,mm_wh=0,sel_ww,sel_wh,game_ww,game_wh,scale=1,opt_ww,opt_wh,ach_ww,ach_wh,cv_w,cv_h;
var fullscreen = true;
var currentsize = c.g("size");

function resizeit() {
	g.setScale(function() {
		scale = c.g("size");
		if (c.g("size") == -1) {
			var wr = $(window).width() / 600;
			var hr = $(window).height() / 500;
			scale = wr>hr?hr:wr;
		}
		$('#cv').attr('width', cv_w = 600 * scale);
		$('#cv').attr('height', cv_h = 500 * scale);
		return scale;
	}());
	$('#options canvas').css("left",opt_ww=($(window).width()-parseInt($('#options canvas').attr('width')))/2).
						 css("top",opt_wh=($(window).height()-parseInt($('#options canvas').attr('height')))/2);
	$('#ach canvas').css("left",ach_ww=($(window).width()-parseInt($('#ach canvas').attr('width')))/2).
					 css("top",ach_wh=($(window).height()-parseInt($('#ach canvas').attr('height')))/2);
	$('#mm').css("left",mm_ww=($(window).width()/2-300)).css("top",mm_wh=($(window).height()/2-250));
	$('#sel').css("left",sel_ww=($(window).width()/2-300)).css("top",sel_wh=($(window).height()/2-250));
	$('#game').css("left",game_ww=(($(window).width()-cv_w)/2))
			  .css("top",game_wh=(($(window).height()-cv_h)/2));
	$('#game').css("width",cv_w).css("height",cv_h);
	$('#pause').css("left",(600*scale-300)/2).css("top",(500*scale-200)/2);
	$('.ach').css("left",(($(window).width()-500)/2))
			 .css("top",(($(window).height()-400)/2));
	
}
$(window).resize(resizeit);