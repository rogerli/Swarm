trans = false;
tt = 1000;
actions = [];
function addAction(a) {
	for(i in actions) {if (actions[i] == a) return false;}
	actions.push(a); return true;
}
var vis = {
	mm : true,
	sel : false,
	game : false,
	opt : false,
	ach : false
}


var selflies = [], selvy, selhy, selflygo;
function showSel(nfunc) {
	if (!addAction("showsel")) return;
	generateBugObjs();
	vis.sel = true;
	selflies = [];
	$('#sel').css("display","block");
	$('#sel').css("top",-520);
	for(var _i=0;_i<10;_i++) {
		$("body").append("<div id='selfly"+_i+"' class='mm_fly'></div>");
		nx = Math.random()*600;
		selflies.push({x:nx,y:-520,vx:0,vy:10,exa:Math.random()*2*Math.PI,id:'#selfly'+_i});
		$('#selfly'+_i).css("left",sel_ww+nx);
	}
	sely = -520;
	selvy = 0;
	selflygo = false;
}
function showMenu(nfunc) {
	if (!addAction("showmenu")) return;
	generateBugObjs();
	vis.mm = true;
	selflies = [];
	$('#mm').css("display","block");
	$('#mm').css("top",-520);
	for(var _i=0;_i<10;_i++) {
		$("body").append("<div id='selfly"+_i+"' class='mm_fly'></div>");
		nx = Math.random()*600;
		selflies.push({x:nx,y:-520,vx:0,vy:10,exa:Math.random()*2*Math.PI,id:'#selfly'+_i});
		$('#selfly'+_i).css("left",mm_ww+nx);
	}
	sely = -520;
	selvy = 0;
	selflygo = false;
}
function showGame(nfunc) {
	if (!addAction("showgame")) return;
	generateBugObjs();
	vis.game = true;
	selflies = [];
	$('#game').css("display","block");
	sely = -(fullscreen?$(window).height():520);
	$('#game').css("top",sely);
	for(var _i=0;_i<10;_i++) {
		$("body").append("<div id='selfly"+_i+"' class='mm_fly'></div>");
		nx = Math.random()*600;
		selflies.push({x:nx,y:-520,vx:0,vy:10,exa:Math.random()*2*Math.PI,id:'#selfly'+_i});
		$('#selfly'+_i).css("left",sel_ww+nx);
	}
	selvy = 0;
	selflygo = false;
}
var hmflies = [], hvy, hy, hnextfunc;
function hideGame(nfunc) {
	if (!addAction("hidegame")) return;
	hmflies = [];
	for(var _i=0;_i<10;_i++) {
		$("body").append("<div id='hmfly"+_i+"' class='mm_fly'></div>");
		hmflies.push({x:Math.random()*$(window).width(),y:-10,vx:0,vy:10,latched:false,tx:Math.random()*600*scale,id:'#hmfly'+_i});
	}
	hy = false;
	hnextfunc = function() {
		nfunc();
		vis.game = false;
	};
}
function hideMenu(nfunc) {
	if (!addAction("hidemenu")) return;
	hmflies = [];
	for(var _i=0;_i<10;_i++) {
		$("body").append("<div id='hmfly"+_i+"' class='mm_fly'></div>");
		hmflies.push({x:Math.random()*$(window).width(),y:-10,vx:0,vy:10,latched:false,tx:Math.random()*600,id:'#hmfly'+_i});
	}
	hy = false;
	hnextfunc = function() {
		nfunc();
		vis.mm = false;
	};
}
function hideSel(nfunc) {
	if (!addAction("hidesel")) return;
	hmflies = [];
	for(var _i=0;_i<10;_i++) {
		$("body").append("<div id='hmfly"+_i+"' class='mm_fly'></div>");
		hmflies.push({x:Math.random()*$(window).width(),y:-10,vx:0,vy:10,latched:false,tx:Math.random()*600,id:'#hmfly'+_i});
	}
	hy = false;
	hnextfunc = function() {
		nfunc();
		vis.sel = false;
	};
}

function _trans_() {
	trans = false;
	for(var i=0;i<actions.length;i++) {
		trans = true;
		if (actions[i] == "hidesel") {
			latched = true;
			for(var j=0;j<hmflies.length;j++) {
				f = hmflies[j];
				if (!f.latched) {
					latched = false;
					np = [mm_ww+f.tx,mm_wh];
					nang = getAngle(np[0]-f.x,np[1]-f.y);
					f.vx += Math.cos(nang)*2*_st;
					f.vy += Math.sin(nang)*2*_st;
					f.x += f.vx*=0.93;
					f.y += f.vy*=0.93;
					$(f.id).css("left",f.x);
					$(f.id).css("top",f.y);
					if (DBP(f.x,f.y,np[0],np[1]) < 10*_st) {
						f.latched = true;
						$(f.id).css("left",np[0]);
						$(f.id).css("top",mm_wh);
					}
				}
			}
			if (latched) {
				if (hy === false) {hy = mm_wh; hvy = 0;}
				hvy += 1*_st;
				hy -= hvy;
				$('#sel').css("top",hy);
				for(j in hmflies) {
					f = hmflies[j];
					$(f.id).css("top",hy);
				}
				if (hy < -520) {
					for(j in hmflies) {
						f = hmflies[j];
						$(f.id).remove();
					}
					$('#sel').css("display","none");
					actions.splice(i,1);
					i--;
					hnextfunc();
					continue;
				}
			}
		} else if (actions[i] == "hidemenu") {
			latched = true;
			for(var j=0;j<hmflies.length;j++) {
				f = hmflies[j];
				if (!f.latched) {
					latched = false;
					np = [mm_ww+f.tx,mm_wh];
					nang = getAngle(np[0]-f.x,np[1]-f.y);
					f.vx += Math.cos(nang)*2*_st;
					f.vy += Math.sin(nang)*2*_st;
					f.x += f.vx*=0.93;
					f.y += f.vy*=0.93;
					$(f.id).css("left",f.x);
					$(f.id).css("top",f.y);
					if (DBP(f.x,f.y,np[0],np[1]) < 10*_st) {
						f.latched = true;
						$(f.id).css("left",np[0]);
						$(f.id).css("top",mm_wh);
					}
				}
			}
			if (latched) {
				if (hy === false) {hy = mm_wh; hvy = 0;}
				hvy += 1*_st;
				hy -= hvy;
				$('#mm').css("top",hy);
				for(j in hmflies) {
					f = hmflies[j];
					$(f.id).css("top",hy);
				}
				if (hy < -520) {
					for(j in hmflies) {
						f = hmflies[j];
						$(f.id).remove();
					}
					$('#mm').css("display","none");
					actions.splice(i,1);
					i--;
					hnextfunc();
					continue;
				}
			}
		} else if (actions[i] == "hidegame") {
			latched = true;
			for(var j=0;j<hmflies.length;j++) {
				f = hmflies[j];
				if (!f.latched) {
					latched = false;
					np = [game_ww+f.tx,game_wh];
					nang = getAngle(np[0]-f.x,np[1]-f.y);
					f.vx += Math.cos(nang)*2*_st;
					f.vy += Math.sin(nang)*2*_st;
					f.x += f.vx*=0.93;
					f.y += f.vy*=0.93;
					$(f.id).css("left",f.x);
					$(f.id).css("top",f.y);
					if (DBP(f.x,f.y,np[0],np[1]) < 10*_st) {
						f.latched = true;
						$(f.id).css("left",np[0]);
						$(f.id).css("top",game_wh);
					}
				}
			}
			if (latched) {
				if (hy === false) {hy = game_wh; hvy = 0;}
				hvy += 1*_st;
				hy -= hvy;
				$('#game').css("top",hy);
				for(j in hmflies) {
					f = hmflies[j];
					$(f.id).css("top",hy);
				}
				if (hy < -520*scale) {
					for(j in hmflies) {
						f = hmflies[j];
						$(f.id).remove();
					}
					$('#game').css("display","none");
					actions.splice(i,1);
					i--;
					hnextfunc();
					continue;
				}
			}
		} else if (actions[i] == "showsel") {
			if (selflygo) {
				for(j in selflies) {
					f = selflies[j];
					rad = DBP(0,0,$(window).width(),$(window).height())/2;
					np = [Math.cos(f.exa)*rad+$(window).width()/2,Math.sin(f.exa)*rad+$(window).height()/2];
					nang = getAngle(np[0]-f.x,np[1]-f.y);
					f.vx += Math.cos(nang)*2*_st;
					f.vy += Math.sin(nang)*2*_st;
					f.x += f.vx;
					f.y += f.vy;
					$(f.id).css("left",f.x);
					$(f.id).css("top",f.y);
					if (f.x < 0 || f.y < 0 || f.x > $(window).width() || f.y > $(window).height()) {
						$(f.id).remove();
						selflies.splice(j,1);
						j--;
						continue;
					}
				}
				if (selflies.length == 0) {
					actions.splice(i,1);
					i--;
					continue;
				}
			} else {
				selvy += 1*_st;
				sely += selvy;
				$('#sel').css("top",sely);
				for(j in selflies) {
					f = selflies[j];
					$(f.id).css("top",sely);
				}
				if (sely > sel_wh) {
					selvy = -Math.abs(selvy)*0.4;
					sely = sel_wh;
					if (Math.abs(selvy) < 2*_st) {
						$('#sel').css("top",sel_wh);
						selflygo = true;
						for(j in selflies) {
							f = selflies[j];
							f.x += sel_ww;
							f.y = sel_wh;
						}
					}
				}
			}
		} else if (actions[i] == "showmenu") {
			if (selflygo) {
				for(j in selflies) {
					f = selflies[j];
					rad = DBP(0,0,$(window).width(),$(window).height())/2;
					np = [Math.cos(f.exa)*rad+$(window).width()/2,Math.sin(f.exa)*rad+$(window).height()/2];
					nang = getAngle(np[0]-f.x,np[1]-f.y);
					f.vx += Math.cos(nang)*2*_st;
					f.vy += Math.sin(nang)*2*_st;
					f.x += f.vx;
					f.y += f.vy;
					$(f.id).css("left",f.x);
					$(f.id).css("top",f.y);
					if (f.x < 0 || f.y < 0 || f.x > $(window).width() || f.y > $(window).height()) {
						$(f.id).remove();
						selflies.splice(j,1);
						j--;
						continue;
					}
				}
				if (selflies.length == 0) {
					actions.splice(i,1);
					i--;
					continue;
				}
			} else {
				selvy += 1*_st;
				sely += selvy;
				$('#mm').css("top",sely);
				for(j in selflies) {
					f = selflies[j];
					$(f.id).css("top",sely);
				}
				if (sely > mm_wh) {
					selvy = -Math.abs(selvy)*0.4;
					sely = mm_wh;
					if (Math.abs(selvy) < 2*_st) {
						$('#mm').css("top",mm_wh);
						selflygo = true;
						for(j in selflies) {
							f = selflies[j];
							f.x += mm_ww;
							f.y = mm_wh;
						}
					}
				}
			}
		} else if (actions[i] == "showgame") {
			if (selflygo) {
				for(j in selflies) {
					f = selflies[j];
					rad = DBP(0,0,$(window).width(),$(window).height())/2;
					np = [Math.cos(f.exa)*rad+$(window).width()/2,Math.sin(f.exa)*rad+$(window).height()/2];
					nang = getAngle(np[0]-f.x,np[1]-f.y);
					f.vx += Math.cos(nang)*2*_st;
					f.vy += Math.sin(nang)*2*_st;
					f.x += f.vx;
					f.y += f.vy;
					$(f.id).css("left",f.x);
					$(f.id).css("top",f.y);
					if (f.x < 0 || f.y < 0 || f.x > $(window).width() || f.y > $(window).height()) {
						$(f.id).remove();
						selflies.splice(j,1);
						j--;
						continue;
					}
				}
				if (selflies.length == 0) {
					actions.splice(i,1);
					i--;
					continue;
				}
			} else {
				selvy += 1*_st;
				sely += selvy;
				$('#game').css("top",sely);
				for(j in selflies) {
					f = selflies[j];
					$(f.id).css("top",sely);
				}
				if (sely > game_wh) {
					selvy = -Math.abs(selvy)*0.4;
					sely = game_wh;
					if (Math.abs(selvy) < 2*_st) {
						$('#game').css("top",game_wh);
						selflygo = true;
						for(j in selflies) {
							f = selflies[j];
							f.x += game_ww;
							f.y = game_wh;
						}
					}
				}
			}
		}
		
	}
	
} setInterval('_trans_()',25);






