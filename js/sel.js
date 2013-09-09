var sel_rot = 0;
var selarr = [];
var gsel = -1;
var isspinning = false;
sel_start = L.word("start",30,50);
pointers.push([sel_start,"sel_ww+200","sel_wh+420",function() {
	return vis.sel;
}]);
clicks.push([sel_start,"sel_ww+200","sel_wh+420",function() {
	if (vis.sel && !isspinning) {
		num = (bugs.length-Math.round(sel_rot/(2*Math.PI/bugs.length)))%bugs.length;
		unl = c.g(bugs[num]+"_unl");
		if (unl) {
			startGame(num);
		}
	}
}]);

var chalon = "";
var CHAL = [
	{
		name : "None",
		a : "",
		des : "No challenge. Normal gameplay."
	}, {
		name : "Power Free",
		a : "powerfree",
		des : "No powerup rooms."
	}, {
		name : "Heart Breaker",
		a : "heartbreak",
		des : "No health rooms."
	}, {
		name : "The Miser",
		a : "miser",
		des : "No shops."
	}, {
		name : "Stunned",
		a : "stun",
		des : "10% of shots do half damage."
	}, {
		name : "The Duo",
		a : "duo",
		des : "What if the bosses paired up?"
	}, {
		name : "Self Destruct",
		a : "self",
		des : "Powerups also damage you for half your health."
	}, {
		name : "Lost Hope",
		a : "losthope",
		des : "It's just harder. Much. Harder."
	}, {
		name : "Big Game Hunter",
		a : "biggame",
		des : "There are never enough bosses."
	}
];
for(var i=0;i<CHAL.length;i++) {
	$("#chal .box").append(
		$("<div></div>").html("<b>"+CHAL[i].name+"</b><br>"+CHAL[i].des).attr("chal",i).click(function() {
			var ind = parseInt($(this).attr("chal"));
			chalon = CHAL[ind].a;
			$(this).parent().parent().animate({
				opacity:0
			},300,function() {
				$(this).css("display","none");
				challengesopen = false;
			});
		})
	);
}


var sd = false;
function drawSel() {
	$("#chal .box").scrollLeft(0);
	if (!vis.sel) return;
	selg.clearRect(0,0,600,500);
	var plist = [], ply = [], plx = [], curunl = false, selcur = -1;
	if (gsel > -1) {
		offset = (bugs.length-gsel) * 2*Math.PI/bugs.length % (2*Math.PI);
		change = offset - sel_rot;
		if (change < Math.PI) change += 2*Math.PI;
		if (change > Math.PI) change -= 2*Math.PI;
		if (change == 0) change += 0.001;
		dir = Math.abs(change)/change;
		sel_rot += dir*4*Math.PI/180;
	}
	isspinning = ((Math.abs(sel_rot-sel_rot.roundToNearest(2*Math.PI/bugs.length))).roundToNearest(0.01) != 0);
	if (isspinning) {
		selarr = [];
	} else {
		selcur = sel_rot.roundToNearest(2*Math.PI/bugs.length)/(2*Math.PI/bugs.length);
	}
	if (isNaN(sel_rot)) sd = true;
	if (sel_rot < 0) sel_rot += 2*Math.PI;
	if (sel_rot >= 2*Math.PI) sel_rot -= 2*Math.PI;
	for(var i=0;i<bugs.length;i++) {
		rotoff = i * (2*Math.PI / bugs.length);
		ang = Math.PI/2+sel_rot + rotoff;
		co = cc(210,ang);
		co[1] *= 120/210;
		cent = [300+co[0],175+co[1]];
		ny = cent[1];
		if (plist.length == 0) {
			plist.push(i);
			ply.push(ny);
			plx.push(cent[0]);
		} else {
			inserted = false;
			for(var j=0;j<plist.length;j++) {
				if (ny > ply[j]) {
					plist.splice(j,0,i);
					ply.splice(j,0,ny);
					plx.splice(j,0,cent[0]);
					inserted = true;
					break;
				}
			}
			if (!inserted) {
				plist.push(i);
				ply.push(ny);
				plx.push(cent[0]);
			}
		}
	}
	popselarr = (!isspinning && selarr.length==0);
	for(var i=plist.length-1;i>=0;i--) {
		elnum = plist[i];
		bug = bugs[elnum];
		size = (ply[i]-55)/240*100 + 100;
		unl = c.g(bug+"_unl");
		if (!isspinning && (bugs.length-selcur)%bugs.length == elnum && unl) {
			curunl = true;
		}
		active = unl && size>195;
		x = plx[i]-size/2; y = ply[i]-size/2;
		selg.strokeStyle("rgb(255,255,255)");
		selg.translate(x,y);
		selg.fillStyle("rgb(100,100,100)");
			selg.fillRect(0,0,size,size);
			selg.strokeRect(0,0,size,size);
		selg.fillStyle("rgb(255,255,255)");
		for(var j=0;j<bugobjs[bug].length;j++) {
			b = bugobjs[bug][j];
			if (active) b.a += b.dir * (0+Math.random()*4)*Math.PI/180;
			if (active) b.r += Math.random()*0.014 - 0.007;
			if (b.r < 0.01) b.r = 0.01;
			if (b.r > 0.07) b.r = 0.07;
			cx = b.cx + Math.cos(b.a) * b.r;
			cy = b.cy + Math.sin(b.a) * b.r;
			selg.translate(cx*size,cy*size);
			r = size/200;
			switch(bug) {
				case "flies":
					if (b.lwing == -1 || b.cycle == 0 && active) {
						b.lwing=4+Math.random()*4;
						b.rwing=4+Math.random()*4;
					}
					b.cycle = b.cycle==3?0:b.cycle++;
					draw.flies(selg,!unl,-10*r,-10*r,20*r,20*r,b.lwing,b.rwing);
				break;
				case "bees":
					if (b.lwing == -1 || b.cycle == 0 && active) {
						b.lwing=4+Math.random()*4;
						b.rwing=4+Math.random()*4;
					}
					b.cycle = b.cycle==5?0:b.cycle++;
					draw.bees(selg,!unl,-10*r,-10*r,20*r,20*r,b.lwing,b.rwing);
				break;
				case "ladybugs":
					if (b.lwing == -1 || b.lwing > Math.PI/7+Math.PI/12 || b.cycle == 0 && active) {
						b.lwing = Math.random()*Math.PI/7+Math.PI/12;
					}
					b.cycle = b.cycle==7?0:b.cycle++;
					draw.ladybugs(selg,!unl,-10*r,-10*r,20*r,20*r,b.lwing);
				break;
				case "butterflies":
					if (b.lwing == -1 || b.cycle == 0 && active) {
						b.lwing=1+Math.random()*3;
						b.rwing=1+Math.random()*3;
					}
					b.cycle = b.cycle==5?0:b.cycle++;
					draw.butterflies(selg,!unl,-10*r,-10*r,20*r,20*r,b.lwing,b.rwing);
				break;
				case "moths":
					if (b.lwing == -1 || b.cycle == 0 && active) {
						b.lwing=1+Math.random()*3;
						b.rwing=1+Math.random()*3;
					}
					b.cycle = b.cycle==5?0:b.cycle++;
					draw.moths(selg,!unl,-10*r,-10*r,20*r,20*r,b.lwing,b.rwing);
				break;
				case "locusts":
					if (b.lwing == -1 || b.cycle == 0 && active) {
						b.lwing=1+Math.random()*3;
						b.rwing=1+Math.random()*3;
					}
					b.cycle = b.cycle==5?0:b.cycle++;
					draw.locusts(selg,!unl,-10*r,-10*r,20*r,20*r,b.lwing,b.rwing);
				break;
			}
			selg.translate(-cx*size,-cy*size);
		}
		if(!unl) {
			// lock picture
			selg.fillStyle("rgba(0,0,0,0.6)");
				selg.fillRect(0,0,size,size);
			selg.fillStyle("rgb(150,150,150)");
			selg.strokeStyle("rgb(150,150,150)");
				selg.fillRect(50*r,85*r,100*r,75*r);
				selg.translate(50*r,85*r);
					selg.beginPath();
						selg.moveTo(20*r,-30*r);
						selg.lineTo(20*r,0);
						selg.lineTo(30*r,0);
						selg.lineTo(30*r,-30*r);
						selg.arc(50*r,-30*r,20*r,Math.PI,0,false);
						selg.lineTo(70*r,0);
						selg.lineTo(80*r,0);
						selg.lineTo(80*r,-30*r);
						selg.arc(50*r,-30*r,30*r,0,Math.PI,true);
					selg.fill();
					selg.stroke();
				selg.translate(-50*r,-85*r);
				selg.fillStyle("rgb(0,0,0)");
					selg.beginPath();
						selg.arc(100*r,110*r,10*r,0,2*Math.PI);
						selg.fill();
					selg.fillRect(95*r,110*r,10*r,30*r);
		}
		if (popselarr) {
			selarr.push([elnum,x,y,size,size,false]);
		} else {
			issel = false;
			for(var j=0;j<selarr.length;j++) {
				if (elnum == selarr[j][0] && selarr[j][5]) {
					issel = true;
				}
			}
			if (issel && unl) {
				selg.fillStyle("rgba(0,0,0,0.2)");
					selg.fillRect(0,0,size,size);
			}
		}
		selg.translate(-x,-y);
		selclr = (!isspinning&&curunl)?'rgb(255,255,255)':'rgb(100,100,100)';
		selmoclr = (!isspinning&&curunl)?'rgb(50,50,150)':'rgb(100,100,100)';
		L.draw(sel_start,selg,200,420,selclr+":"+selmoclr);
		if(curunl) {
			bd = bugData[bugs[(bugs.length-selcur)%bugs.length]];
			// heart
			draw.icons.heart(selg,30,371,20,17);
			draw.stats.list(selg,bd.health,'rgb(155,0,0)',40,371,15);
			draw.icons.attack(selg,30,394,20,17);
			draw.stats.list(selg,bd.attack,'rgb(150,150,150)',40,394,15);
			draw.icons.speed(selg,30,417,20,17);
			draw.stats.list(selg,bd.speed,'rgb(0,90,180)',40,417,15);
			draw.icons.firing(selg,30,440,20,17);
			draw.stats.list(selg,bd.firing,'rgb(0,150,0)',40,440,15);
			draw.icons.shotspeed(selg,30,463,20,17);
			draw.stats.list(selg,bd.shotspeed,'rgb(150,150,0)',40,463,15);
		}
		
	}
	if (Math.abs(sel_rot - sel_rot.roundToNearest(2*Math.PI/bugs.length)) < Math.PI/180*4) {
		if (gsel == -1) {
			sel_rot = sel_rot.roundToNearest(2*Math.PI/bugs.length);
		} else {
			if (sel_rot.roundToNearest(2*Math.PI/bugs.length).roundToNearest(0.01) == offset.roundToNearest(0.01)) {
				sel_rot = sel_rot.roundToNearest(2*Math.PI/bugs.length);
				gsel = -1;
			}
		}
	}
	L.drawWord("Easy",selg,470,394,12,12,"rgb(255,255,255)");
	selg.strokeStyle("rgb(255,255,255)");
	selg.strokeRect(440,390,20,20);
	L.drawWord("Medium",selg,470,424,12,12,"rgb(255,255,255)");
	selg.strokeStyle("rgb(255,255,255)");
	selg.strokeRect(440,420,20,20);
	L.drawWord("Hard",selg,470,454,12,12,"rgb(255,255,255)");
	selg.strokeStyle("rgb(255,255,255)");
	selg.strokeRect(440,450,20,20);
	selg.beginPath();
	selg.moveTo(440,360+30*difficulty);
	selg.lineTo(460,380+30*difficulty);
	selg.moveTo(460,360+30*difficulty);
	selg.lineTo(440,380+30*difficulty);
	selg.stroke();
	L.drawWord("Menu",selg,5,5,12,12,"rgb(255,255,255)");
	if (c.g('qs')) L.drawWord("Quick Load",selg,435,5,12,12,"rgb(255,255,255)");
	L.drawWord("Challenges",selg,223,143,12,12,"rgb(255,255,255)");
} setInterval(drawSel,25);
var bugobjs = {};
function generateBugObjs() {
	for(i in bugs) {
		bugobjs[bugs[i]] = new Array();
		for(var j=0;j<6;j++) {
			rad = 0.25 + Math.random()*0.15;
			angle = j * 2*Math.PI/6 - Math.PI/180*10 + Math.random()*20*Math.PI/180;
			bugobjs[bugs[i]].push({
				cx : 0.5+Math.cos(angle) * rad,
				cy : 0.5+Math.sin(angle) * rad,
				r : Math.random()*0.05 + 0.05,
				a : Math.random()*2*Math.PI,
				dir : -1 + 2*Math.floor(Math.random()*2),
				cycle : 0, lwing : -1, rwing : 4+Math.random()*4
			});
		}
		for(var j=0;j<4;j++) {
			rad = 0.15 + Math.random()*0.1;
			angle = j * 2*Math.PI/4 - Math.PI/180*30 + Math.random()*60*Math.PI/180;
			bugobjs[bugs[i]].push({
				cx : 0.5+Math.cos(angle) * rad,
				cy : 0.5+Math.sin(angle) * rad,
				r : Math.random()*0.05 + 0.05,
				a : Math.random()*2*Math.PI,
				dir : -1 + 2*Math.floor(Math.random()*2),
				cycle : 0, lwing : -1, rwing : 4+Math.random()*4
			});
		}
	}
}

var challengesopen = false;
var challengetrans = 0;

var bvs = ['rx','ry','x','y','maxhp','hp','nattack','nspeed','nfiring','nshotspeed','bs','coin','diff','floor','knockback','bosskilled',
		'bug','bugs','ring1','barr','r1','r','items'];
function startFromQS() {
	startGame(0);
	c.s("qs",false);
	B.attachWeapon(c.g("qs_B_wt"));
	for(i in bvs) {
		B[bvs[i]] = c.g("qs_B_"+bvs[i]);
	}
	for(i in minimap) { if(i=="set"){continue;}
		minimap[i] = c.g("qs_mm_"+i);
	}
	for(i in Settings) { if(i=="reset"){continue;}
		Settings[i] = c.g("qs_set_"+i);
	}
	m = c.g("qs_m");
	mw = m.length;
	mh = m[0].length;
	forceAttach = true;
	for(var i=0;i<B.items.length;i++) {
		if (B.items[i]) {
			var i_bars = B.items[i].bars;
			B.onitem = i;
			Powerups[B.items[i].name](B.items[i].n);
			B.items[i].bars = i_bars;
		}
	}
	forceAttach = false;
	hurt = c.g("hurt");
	chalon = c.g("qs_chal");
	difficulty = c.g("qs_difficulty");
}
c.i("qs",false);
c.i("hurt",0);
c.i("qs_m",false);
c.i("qs_B_wt",false);
c.i("qs_chal","");
for(i in bvs) {c.i("qs_B_"+bvs[i],0);}
for(i in minimap) {if(i=="set"){continue;}c.i("qs_mm_"+i,0,i=="s");}
for(i in Settings) {if(i=="reset"){continue;}c.i("qs_set_"+i,0);}
c.i("qs_difficulty",1);
function quickSave() {
	c.s("qs",true);
	c.s("qs_difficulty",difficulty);
	c.s("hurt",hurt);
	c.s("qs_chal",chalon);
	for(i in bvs) {
		c.s("qs_B_"+bvs[i],B[bvs[i]]);
	}
	for(i in minimap) { if(i=="set"){continue;}
		c.s("qs_mm_"+i,minimap[i]);
	}
	for(i in Settings) { if(i=="reset"){continue;}
		c.s("qs_set_"+i,Settings[i]);
	}
	c.s("qs_B_wt",B.weap.type);
	c.s("qs_m",m);
	$('#pause').css('display','none');
	hideGame(showSel);
}
