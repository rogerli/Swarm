
var letters = [], mmflies = [], timer=0;
function mm_start() {
	timer += 25;
	done = true;
	for(var i=0;i<mmflies.length;i++) {
		f = mmflies[i];
		rad = DBP(0,0,$(window).width(),$(window).height())/2;
		np = [Math.cos(f.exa)*rad+$(window).width()/2,Math.sin(f.exa)*rad+$(window).height()/2];
		nang = getAngle(np[0]-f.x,np[1]-f.y);
		f.vx += Math.cos(nang)*2*_st;
		f.vy += Math.sin(nang)*2*_st;
		f.x += f.vx;
		f.y += f.vy;
		$(f.id).css("left",f.x);
		$(f.id).css("top",f.y);
		done = false;
		if (f.x < 0 || f.y < 0 || f.x > $(window).width() || f.y > $(window).height()) {
			$(f.id).remove();
			mmflies.splice(i,1);
			i--;
			continue;
		}
	}
	for(i in letters) {
		l = letters[i];
		goaly = l.goaly + mm_wh;
		if (timer >= l.st && !l.done) {
			if (l.y > goaly) {
				l.y -= 3*_st;
				if (!l.droppedflies) {
					for(_i=0;_i<3;_i++) {
						ll = $('#dropletterfly'+i+'-'+_i).css("left");
						tt = $('#dropletterfly'+i+'-'+_i).css("top");
						mmflies.push({
							x : parseInt(ll),
							y : parseInt(tt),
							vx : 0,
							vy : -8,
							id : '#dropletterfly'+i+'-'+_i,
							exa : Math.random() * 2 * Math.PI
						});
					}
					l.droppedflies = true;
				}
				if (l.y <= goaly) {
					l.y = goaly;
					$(l.id).appendTo('#mm');
					$(l.id).css("left",l.x);
					$(l.id).css("top",l.goaly);
					if (l.func) $(l.id).bind("click",l.func);
					l.done = true;
					continue;
				}
				if (!l.droppedflies) {
					for(_i=0;_i<3;_i++) {
						ll = $('#dropletterfly'+i+'-'+_i).css("left");
						tt = $('#dropletterfly'+i+'-'+_i).css("top");
						mmflies.push({
							x : parseInt(ll),
							y : parseInt(tt),
							vx : 0,
							vy : -8,
							id : '#dropletterfly'+i+'-'+_i,
							exa : Math.random() * 2 * Math.PI
						});
					}
					l.droppedflies = true;
				}
			} else {
				for(_i=0;_i<3;_i++) {
					$('#dropletterfly'+i+'-'+_i).css("top",l.y+l.f[_i][1]-3+Math.random()*6);
					$('#dropletterfly'+i+'-'+_i).css("left",l.x+l.f[_i][0]+mm_ww-3+Math.random()*6);
				}
				l.y += 20*_st;
			}
			$(l.id).css("top",l.y);
		}
		if (!l.done) {
			done = false;
		}
	}
	if (done) return;
	setTimeout("mm_start()",25);
}
function dropLetter(letter,size,x,y,time,func) {
	time = time / _st;
	var nid = letters.length;
	flies = [];
	for(var _i=0;_i<3;_i++) {
		flies.push([Math.random()*25+5,5+Math.random()*65]);
	}
	letters.push({
		id : '#dropletter'+nid,
		x : x,
		y : -size*2,
		goaly : y,
		st : time,
		done : false,
		f : flies,
		droppedflies : false,
		func : func
	});
	$("body").append("<span id='dropletter"+nid+"' class='dropletter'>"+letter+"</span>");
	$('#dropletter'+nid).css("left",mm_ww+x);
	$('#dropletter'+nid).css("top",-size*2);
	$('#dropletter'+nid).css("font-size",size);
	if (func) $('#dropletter'+nid).css("cursor","pointer");
	for(var _i=0;_i<3;_i++) {
		$("body").append("<div id='dropletterfly"+nid+"-"+_i+"' class='mm_fly'></div>");
		$('#dropletterfly'+nid+'-'+_i).css("left",mm_ww+x+flies[_i][0]);
		$('#dropletterfly'+nid+'-'+_i).css("top",-20);
	}
}
$(document).ready(function() {
	SWARM = ("SWARM").split("");
	for(var i=0;i<SWARM.length;i++) {
		dropLetter(SWARM[i],110,123+70*i,60,i*100);
	}
	START = ("START").split("");
	for(var i=0;i<START.length;i++) {
		dropLetter(START[i],60,20+40*i,200,700+i*100,function() {
			hideMenu(showSel);
		});
	}
	START = ("OPTIONS").split("");
	for(var i=0;i<START.length;i++) {
		dropLetter(START[i],60,60+40*i,260,1200+i*100,showOptionMenu);
	}
	START = ("ACHIEVEMENTS").split("");
	for(var i=0;i<START.length;i++) {
		dropLetter(START[i],60,100+40*i,320,1800+i*100,showAchMenu);
	}
	mm_start();
});