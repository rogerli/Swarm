var mx=0,my=0,mdx,mdy;
function getMouse(e) {
	mx = e.pageX;
	my = e.pageY;
}
function inBox(x,y,w,h) {
	return mx>=x&&mx<=x+w&&my>=y&&my<=y+h;
}
$(window).bind('mouseup',function(e) {
	if(barclicked) {
		barclicked = false;
	}
	if (mstat.indexOf('bar') > -1) {
		mstat = '';
		updateVolume();
	}
});
var pointers = new Array();
var overach = -1;
var overachx,overachy;
$(window).bind('mousemove',function(e) {
	getMouse(e);
	if (vis.ach) {
		mx -= ach_ww;
		my -= ach_wh;
		overach = -1;
		for(var i=Math.floor(unloff/39);i<unlocks.length&&i<Math.ceil(unloff/39)+8;i++) {
			if (inBox(22,76+i*39-unloff,27,27)) {
				overach = i;
				overachx = mx;
				overachy = my;
			}
		}
		drawAch();
		if (barclicked) {
			barypos = baryposo + my - barcmy;
			mx += ach_ww;
			my += ach_wh;
			if (barypos > 317 - barh) barypos = 317 - barh;
			if (barypos < 0) barypos = 0;
			drawAch();
		}
		mx += ach_ww;
		my += ach_wh;
	}
	var curs = 'default';
	for(var i=0;i<pointers.length;i++) {
		pnt = pointers[i];
		L.w[i].mouseover = false;
		if (pnt[3]()) {
			dm = L.dim(pnt[0]);
			if (inBox(eval(pnt[1]),eval(pnt[2]),dm[0],dm[1])) {
				curs = 'pointer';
				L.w[i].mouseover = true;
			}
		}
	}
	$('html body').css('cursor',curs);
	if (vis.sel) {
		for(i in selarr) {
			box = selarr[i];
			box[5] = false;
			if (inBox(sel_ww+box[1],sel_wh+box[2],box[3],box[4])) {
				for(j in selarr) {
					selarr[j][5] = false;
				}
				box[5] = true;
			}
		}
	}
	if (vis.opt) {
		mx -= opt_ww;
		my -= opt_wh;
		if (mstat.indexOf('bar') > -1) {
			changex = mx - mdx;
			barn = mstat.substring(3);
			window['o'+barn] = obarx + changex / 125;
			if (window['o'+barn] > 2) window['o'+barn] = 2;
			if (window['o'+barn] < 0) window['o'+barn] = 0;
			drawOptions();
		}
	}
});
var clicks = new Array();
var barclicked = false;
var barcmy = 0;
var baryposo = 0;
var mstat = '';
var obarx;
$(window).bind('mousedown',function(e) {
	getMouse(e);
	if (vis.opt) {
		mx -= opt_ww;
		my -= opt_wh;
		if (inBox(380,5,15,15)) {
			hideOptionsMenu();
		}
		for(var i=0;i<totaloptpages;i++) {
			if (inBox(i*40,82,40,22)) {
				optionpage = i+1;
				drawOptions();
			}
		}
		if (optionpage == 3) {
			if (inBox(60,180,280,140)) {
				if (confirm("Are you sure you want to\nclear all data?")) {
					c.clear();
					window.location = location.href;
				}
			}
		} else if (optionpage == 2) {
			for(i in keydata.key_blocks) {
				pos = keydata.key_blocks[i];
				if (inBox(pos[0],pos[1],30,30)) {
					if (keydata.active == -1) {
						keydata.active = i;
					} else if (keydata.active == i) {
						keydata.active = -1;
					}
					drawOptions();
				}
			}
		} else if (optionpage == 1) {
			my -= 10;
			for(var i=0;i<4;i++) {
				if (inBox(17+i*95,128,80,65)) {
					currentsize = sizes[i];
					c.s("size",currentsize);
					drawOptions();
					resizeit();
				}
			}
			for(var i=0;i<4;i++) {
				if (inBox(17+i*95,200,80,65)) {
					currentsize = sizes[i+4];
					c.s("size",currentsize);
					drawOptions();
					resizeit();
				}
			}
			if (inBox(17+125*ovol,289,30,18)) {
				mdx = mx;
				mstat = 'barvol';
				obarx = ovol;
			}
			if (inBox(17+125*obgvol,329,30,18)) {
				mdx = mx;
				mstat = 'barbgvol';
				obarx = obgvol;
			}
			if (inBox(17,358,200,20)) {
				c.s("tutorial",!c.g("tutorial"));
				drawOptions();
			}
		}
		
		
		return;
	} else if (vis.ach) {
		mx -= ach_ww;
		my -= ach_wh;
		if (inBox(480,5,15,15)) {
			hideAchMenu();
		}
		if (inBox(470,68+barypos,20,barh)) {
			barclicked = true;
			barcmy = my;
			baryposo = barypos;
		}
		return;
	}
	getMouse(e);
	for(var i=0;i<clicks.length;i++) {
		pnt = clicks[i];
		L.w[i].mouseover = false;
		dm = L.dim(pnt[0]);
		if (inBox(eval(pnt[1]),eval(pnt[2]),dm[0],dm[1])) {
			pnt[3]();
		}
	}
	if (vis.game) {
		mx -= game_ww;
		my -= game_wh;
		mx /= scale;
		my /= scale;
		if (inBox(570,470,20,20)) {
			if (!B.paused && B.dead) return;
			B.dead = B.paused = !B.paused;
		}
		if (inBox(540,470,20,20)) {
			if (vis.game) {
				if (B.dead && !B.paused) return;
				if(!B.paused) {
					B.dead = B.paused = !B.paused;
				}
			}
			showOptionMenu();
		}
		mx *= scale;
		my *= scale;
		mx += game_ww;
		my += game_wh;
	}
	if (vis.sel) {
		if (challengesopen) {
			if (inBox(223,143,130,12) && $("#chal").css("display") == "none") {
				challengesopen = true;
				$("#chal").css("opacity",0).css("display","block").animate({
					opacity : 1
				}, 500);
			}
		} else {
			mx -= sel_ww;
			my -= sel_wh;
			if (inBox(223,143,130,12)) {
				challengesopen = true;
				$("#chal").css("opacity",0).css("display","block").animate({
					opacity : 1
				}, 500);
			}
			if (inBox(5,5,70,12)) {
				hideSel(showMenu);
			}
			if (c.g('qs') && inBox(435,5,170,12)) {
				startFromQS();
			}
			for(var i=0;i<3;i++) {
				if (inBox(440,390+i*30,150,20)) {
					difficulty = i+1;
				}
			}
			mx += sel_ww;
			my += sel_wh;
			coff = Math.round(sel_rot/(2*Math.PI/bugs.length));
			for(i in selarr) {
				if (selarr[i][5]) {
					if ((bugs.length-coff)%bugs.length == selarr[i][0]) {
						num = selarr[i][0];
						unl = c.g(bugs[num]+"_unl");
						if (unl) {
							startGame(num);
						}
						break;
					}
					gsel = selarr[i][0];
					break;
				}
			}
		}
	}
});
var ak = [false,false,false,false];
var bk = [false,false,false,false];
var bkeys = [65,87,68,83];
var minimapkey = -1;
var travelmm = false;
var tmmx,tmmy;
var tmmar = [[-1,0],[0,-1],[1,0],[0,1]];
$(window).bind('keyup',function(e) {
	key = (e.keyCode?e.keyCode:e.which);
	if (vis.game) {
		for(var i=0;i<dkeynames.length;i++) {
			if (keys["move_"+dkeynames[i]] == key) {
				bk[i] = false;
			}
		}
		for(var i=0;i<dkeynames.length;i++) {
			if (keys["shoot_"+dkeynames[i]] == key) {
				ak[i] = false;
			}
		}
		if (key == keys.minimap) {
			if (!travelmm) minimap.expand = !minimap.expand;
		}
	}
	if (key == keys.minimap) {
		minimapkey = -1;
	}
});

var typestr = "";
var diskey = false;

$(window).bind('keydown',function(e) {
	key = (e.keyCode?e.keyCode:e.which);
	if (key == 13) {
		if (typestr == ".72.69.65.76") B.hp = B.maxhp;
		if (typestr == ".71.79.68") _tr_ = 1 - _tr_;
		if (typestr == ".75.73.76.76") for(var i=0;i<cr.m.length;i++) cr.m[i].hp = 0;
		if (typestr == ".78.69.88.84") nextFloor();
		typestr = "";
		diskey = false;
	} else typestr += "."+key;
	if (typestr == ".90.88.67.81.69") {
		diskey = true;
		typestr = "";
	}
	if (diskey) return;
	if (vis.ach) return;
	if (vis.opt) {
		if (key == 79) hideOptionsMenu();
		if (optionpage == 2) {
			if (keydata.active != -1) {
				iskeyok = true;
				if (!keydata.SUPPORTED[key]) iskeyok = false;
				for(i in keys) {
					if (keys[i] == key) {
						keys[i] = keys[keydata.active];
					}
				}
				if (iskeyok) {
					keys[keydata.active] = key;
					c.s("key_"+keydata.active,key);
					keydata.ok = false;
				}
				keydata.active = -1;
				drawOptions();
			}
		}
		return;
	} else {
		if (key == 79) {
			if (vis.game) {
				if (B.dead && !B.paused) return;
				if(!B.paused) {
					B.dead = B.paused = !B.paused;
				}
			}
			showOptionMenu();
		}
	}
	if (vis.game) {
		for(var i=0;i<3;i++) {
			if (key == keys["item_"+(i+1)]) {
				B.onitem = i;
			}
		}
		if (travelmm) {
			for(var i=0;i<dkeynames.length;i++) {
				if (keys["move_"+dkeynames[i]] == key || keys["shoot_"+dkeynames[i]] == key) {
					newrx = tmmx + tmmar[i][0];
					newry = tmmy + tmmar[i][1];
					newr = m[newrx][newry];
					if (newr && newr.complete) {
						tmmx = newrx;
						tmmy = newry;
					}
				}
			}
			if (key == 13) {
				minimap.expand = false;
				travelmm = false;
				B.rx = tmmx;
				B.ry = tmmy;
				newr = m[tmmx][tmmy];
				newpos = newr.findSpot();
				B.x = newpos[0];
				B.y = newpos[1];
			}
		}
		if (key == keys.minimap) {
			if (minimapkey == -1) minimapkey = (new Date()).getTime();
		} else if (key == 80) {
			if (!B.paused && B.dead) return;
			B.dead = B.paused = !B.paused;
		} else if (key == keys.item_use) {
			if (B.items[B.onitem]) {
				if (B.items[B.onitem].bars <= 0) {
					B.items[B.onitem].bars = B.items[B.onitem].recharge;
					B.items[B.onitem].f();
				}
			}
		}
		for(var i=0;i<dkeynames.length;i++) {
			if (keys["move_"+dkeynames[i]] == key) {
				bk[i] = true;
			}
		}
		for(var i=0;i<dkeynames.length;i++) {
			if (keys["shoot_"+dkeynames[i]] == key) {
				ak[i] = true;
			}
		}
	}
	if (vis.sel) {
		if (key == 38 && difficulty > 1) {
			difficulty--;
		} else if (key == 40 && difficulty < 3) {
			difficulty++;
		}
		if (key == 39 && gsel == -1) {
			coff = Math.round(sel_rot/(2*Math.PI/bugs.length));
			gsel = (bugs.length-(coff==bugs.length-1?0:coff+1));
		} else if (key == 37 && gsel == -1) {
			coff = Math.round(sel_rot/(2*Math.PI/bugs.length));
			gsel = (bugs.length-(coff==0?bugs.length-1:coff-1));
		} else if (key == 13 || key == 32) {
			if (!isspinning && !trans) {
				num = (bugs.length-Math.round(sel_rot/(2*Math.PI/bugs.length)))%bugs.length;
				unl = c.g(bugs[num]+"_unl");
				if (unl) {
					startGame(num);
				}
			}
		}
	}
	if (vis.mm) {
		if (key == 13 || key == 32) {
			if (!trans) {
				hideMenu(showSel);
			}
		}
	}
});


















