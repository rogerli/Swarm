var g, selg, optg, achg;
$(document).ready(function() {
	g = new canvas("#cv");
	selg = new canvas("#selcv");
	optg = new canvas("#options canvas");
	achg = new canvas("#ach canvas");
	resizeit();
});

c.i("tutorial",true);

var bugs = new Array("flies","butterflies","bees","ladybugs","moths","locusts");
for(var i=0;i<bugs.length;i++) {
	c.i(bugs[i]+"_unl",i<1?true:false);
}

var B = {
	x : 0,
	y : 0,
	rx : 0,
	ry : 0,
	maxhp : 0, hp : 0,
	setMaxHP: function(n) {B.maxhp+=n;B.hp+=n;}, addMaxHP: function(n) {B.maxhp+=n;},
	attack:0,tima:0, tattack : 0, rattack : 0, nattack : 0, setAttack : function(n) {B.nattack=n>0?n:1;},
	speed:0,tims:0, tspeed : 0, rspeed : 0, nspeed : 0, setSpeed	: function(n) {B.nspeed=n>0?n:1;},
	firing:0,timf:0, tfiring : 0, rfiring : 0, nfiring : 0, setFiring : function(n) {B.nfiring=n>0?n:1;},
	shotspeed:0,timss:0, tshotspeed : 0, rshotspeed : 0, nshotspeed : 0, setShotSpeed: function(n) {B.nshotspeed=n>0?n:1;},
	bug : "",
	bugs : 0,
	roomcount : 0,
	changeBugs : function(num) {
		B.bugs = num;
		if (B.bugs > 8) B.bugs = 8;
		B.r1=0;
		nbug = B.bugs;
		B.r = 12;
		if (nbug >= 8) {
			B.r = 23;
			nbug -= (B.r1=8);
			/*if (nbug > 10) {
				//B.r = 35;
				nbug -= (B.r2=10);
			} else {
				//if (nbug == 10) B.r = 35;
				B.r2 = nbug;
			}*/
		} else {
			if (nbug == 8) B.r = 25;
			B.r1 = nbug;
		}
	},
	ring1 : 0, ring2 : 0, ring3 : 0,
	r1 : 0, r2 : 0, r3 : 0,
	barr : [],
	r : 0,
	vx : 0,
	vy : 0,
	weap : null,
	bs : 0,
	coin : 0,
	attachWeapon : function(weap) {
		this.weap = Weapon[weap]();
	},
	dead : false,
	dtrans : 0,
	diff : 1,
	floor : 1,
	inv : 0,
	specialinv : false,
	knockback : 1,
	hit : function(dmg) {
		if (this.inv > 0) return;
		playSound('buzz');
		this.inv = 1500;
		this.specialinv = false;
		hurt += dmg;
		this.hp -= Math.round(dmg);
	},
	heal : function(a) {
		B.hp += a;
		if (B.hp > B.maxhp) B.hp = B.maxhp;
	},
	paused : false,
	items : [],
	onitem : 0,
	killcounter : 0,
	bosskilled : false
};

function startGame(num) {
	if (c.storageType == "localStorage") {
		$("#game #pause").css('height',230);
		$('#game #pause .qsave').css('display','block');
	}
	B.roomcount = 0;
	B.bosskilled = false;
	for(var i in tut) {
		tut[i] = -1;
	}
	lastboss = '';
	generateMap(15);
	B.killcounter = 0;
	B.coin = 10+(c.g("achAvarice")?7:0)+
				(c.g("achFamily Bank")?7:0)+
				(c.g("achWall Street")?9:0)+
				(_tr_?100:0);
	for(var i=0;i<m.length;i++) {
		for(var j=0;j<m[i].length;j++) {
			if (m[i][j] && m[i][j].type == ROOMS.STARTING) {
				B.rx = i;
				B.ry = j;
				minimap.minx = i;
				minimap.miny = j;
				minimap.maxx = i;
				minimap.maxy = j;
				minimap.s = {};
			}
		}
	}
	bullets = [];
	rockets = [];
	num = (bugs.length-Math.round(sel_rot/(2*Math.PI/bugs.length)))%bugs.length;
	B.x = 300;
	B.dead = false;
	B.y = 200;
	B.diff = (difficulty==1)?-4:((difficulty==2)?0:4);
	if (chalon == "losthope") B.diff += 4;
	B.floor = 1;
	B.bug = bugs[num];
	bdata = bugData[B.bug];
	B.maxhp = Math.ceil(bdata.health*
		(c.g("achUntouchable")?1.2:1)*
		(c.g("achEvasive")?1.2:1)*
		(c.g("achNinja Bug")?1.4:1)*
		(c.g("achLost Love")?1.2:1)*
		(c.g("achForever Alone")?1.4:1))+
		(c.g("achLovesick")?5:0);
	B.hp = B.maxhp;
	B.nspeed = bdata.speed;
	B.nattack =  bdata.attack + (c.g("achThe Offensive")?1:0);
	B.nfiring = bdata.firing + (c.g("achRapid Fire")?1:0);
	B.nshotspeed = bdata.shotspeed;
	B.rspeed = B.tspeed = 0;
	B.rattack = B.tattack = 0;
	B.rfiring = B.tfiring = 0;
	B.rshotspeed = B.tshotspeed = 0;
	B.knockback = 1;
	B.r = 0;
	B.inv = 0;
	B.barr = [];
	for(var i=0;i<9;i++) {
		B.barr.push({
			cycle : 0, lwing : 4+Math.random()*4, rwing : 4+Math.random()*4,
			r : i>0?(i<=8?20:(i<=18?30:40)):0, a : 0, x : 0, y : 0
		});
	}
	B.weap = Weapon.shot();
	B.changeBugs(2);
	B.ring1 = B.ring2 = B.ring3 = 0;
	startBG();
	Settings.reset();
	B.paused = false;
	popac = 0;
	unlNewGame();
	hideSel(showGame);
	B.items = [null,null,null];
	B.onitem = 0;
	updateVolume();
	if (chalon != "") {
		for(var i=0;i<CHAL.length;i++) {
			if (CHAL[i].a == chalon) {
				texttoshow = "CHAL- "+CHAL[i].name;
				showtext = 3000;
			}
		}
	}
}
var difficulty = 1;
function nextFloor() {
	B.bosskilled = false;
	B.diff += difficulty;
	if (chalon == "losthope") B.diff += 2;
	if (difficulty == 1 && B.diff > 1) {B.diff++;}
	B.floor++;
	generateMap((15)+B.floor*1);
	for(var i=0;i<m.length;i++) {
		for(var j=0;j<m[i].length;j++) {
			if (m[i][j] && m[i][j].type == ROOMS.STARTING) {
				B.rx = i;
				B.ry = j;
				minimap.minx = i;
				minimap.miny = j;
				minimap.maxx = i;
				minimap.maxy = j;
				minimap.s = {};
			}
		}
	}
	bullets = [];
	B.dead = false;
	B.x = 300;
	B.y = 200;
	B.inv = 0;
	B.barr = [];
	for(var i=0;i<31;i++) {
		B.barr.push({
			cycle : 0, lwing : 4+Math.random()*4, rwing : 4+Math.random()*4,
			r : i>0?(i<=8?20:(i<=18?30:40)):0, a : 0, x : 0, y : 0
		});
	}
	nextBG();
	unlNextFloor();
}



var sq2 = Math.sqrt(2)/2;
var mpos = [[-1,0],[0,-1],[1,0],[0,1],[-sq2,-sq2],[sq2,-sq2],[sq2,sq2],[-sq2,sq2],[0,0]];
var cr,nr,nrmoved,npx,npy,nkeepx,nkeepy;

var minimap = {
	minx : 0,
	miny : 0,
	maxx : 1,
	maxy : 1,
	width : 135,
	height : 90,
	ratio : 1.5,
	s : {},
	expand : false,
	expratio : 1,
	set : function(x,y,s) {
		if (s == 2) {
			minimap.s['r'+x+'-'+y] = 2;
		} else if (!minimap.s['r'+x+'-'+y]) {
			minimap.s['r'+x+'-'+y] = 1;
		} else { return false; } 
		if (x < minimap.minx) {
			minimap.minx = x;
		} else if (x > minimap.maxx) {
			minimap.maxx = x;
		}
		if (y < minimap.miny) {
			minimap.miny = y;
		} else if (y > minimap.maxy) {
			minimap.maxy = y;
		}
	}
};

popac = 0;
function step() {
	if (!vis.game) return;
	g.clearRect(0,0,600,500);
	ocoin = B.coin;
	
	if (!B.dead && B.hp <= 0) {
		// died
		B.hp = 0;
		B.dead = true;
		c.s("deathcount",parseInt(c.g("deathcount"))+1);
		B.dtrans = 0;
		stopBG();
	}
	if (B.dead && !B.paused && popac == 0) {
		// go to selection menu
		B.vx = 0;
		B.vy = 0;
		B.inv = 0;
		B.dtrans += 0.015;
		if (B.dtrans > 1.5) {
			hideGame(showSel);
		}
	}
	// pause menu stuff
	if (B.paused) {
		B.dead = true;
		B.dtrans = 0;
		popac += 0.05;
		if (popac > 1) popac = 1;
		$('#pause').css('display','block');
	} else {
		popac -= 0.05;
		if (popac < 0) {
			popac = 0;
			$('#pause').css('display','none');
		}
	}
	$('#pause').css('opacity',popac);
	
	g.translate(0,100);
		// time out special invincibility
		B.inv -= 25;
		if (B.inv <= 0) {
			if (B.specialinv) B.specialinv = false;
		}
		cr = m[B.rx][B.ry];
		if (!roomtrans) {
			if (!cr.init) {
				cr.initRoom();
			}
		}
		// stat stuff
		B.attack = B.nattack + B.tattack + B.rattack;
		B.firing = B.nfiring + B.tfiring + B.rfiring;
		B.speed = B.nspeed + B.tspeed + B.rspeed;
		B.shotspeed = B.nshotspeed + B.tshotspeed + B.rshotspeed;
		B.tima-=25; if (B.tima<=0) B.tattack = 0;
		B.timf-=25; if (B.timf<=0) B.tfiring = 0;
		B.tims-=25; if (B.tims<=0) B.tspeed = 0;
		B.timss-=25; if (B.timss<=0) B.tshotspeed = 0;
		
		if (travelmm) {
			cr.drawRoom(g);
		} else if (nextfloor) {
			if (nftrans == -1) {
				cr.initRoom();
			}
			cr.drawRoom(g);
		} else if (roomtrans) {
			// room transitioning
			nr = m[nrx][nry];
			if (!nr.init) {
				nr.initRoom();
			}
			rtr += 0.05*(skiproom?3:1);
			npx = mpos[nrdir][0];
			npy = mpos[nrdir][1];
			g.translate(-npx*600*rtr,-npy*400*rtr);
				cr.drawRoom(g);
			g.translate(npx*600*rtr,npy*400*rtr);
			g.translate(npx*600,npy*400);
				g.translate(-npx*600*rtr,-npy*400*rtr);
					nr.drawRoom(g);
				g.translate(npx*600*rtr,npy*400*rtr);
			g.translate(-npx*600,-npy*400);
			if (!nrmoved && rtr >= 0.5) {
				nrmoved = true;
			}
			if (!nrmoved) {
				prog = 1 - rtr * 2;
				B.x = nkeepx ? B.x : (300 + npx*(300-B.r*prog));
				B.y = nkeepy ? B.y : (200 + npy*(200-B.r*prog));
			} else {
				prog = (rtr * 2 - 1);
				B.x = nkeepx ? B.x : (300 - npx*(300-(B.r+5)*prog));
				B.y = nkeepy ? B.y : (200 - npy*(200-(B.r+5)*prog));
			}
			if (rtr >= 1) {
				roomtrans = false;
				bullets = [];
				rockets = [];
				bulletsplash = [];
				B.rx = nrx;
				B.ry = nry;
				cr = m[B.rx][B.ry];
			}
		} else if (!roomtrans) {
			// key/movement
			var mv = mpos[8];
				 if (bk[0] && bk[1]) mv = mpos[4];
			else if (bk[1] && bk[2]) mv = mpos[5];
			else if (bk[2] && bk[3]) mv = mpos[6];
			else if (bk[3] && bk[0]) mv = mpos[7];
			else if (bk[0])			 mv = mpos[0];
			else if (bk[1])			 mv = mpos[1];
			else if (bk[2])			 mv = mpos[2];
			else if (bk[3])			 mv = mpos[3];
			if (!B.dead) {
				B.vx += mv[0] * (B.speed + 12) / 24;
				B.vy += mv[1] * (B.speed + 12) / 24;
				B.vx *= 0.875;
				B.vy *= 0.875;
				B.x += B.vx;
				B.y += B.vy;
			}
			if (B.x <= B.r) {
				if (!roomtrans && cr.complete && cr.adj[0]) {
					if (B.y-B.r>=150 && B.y+B.r<=250) {
						goToRoom(0);
					}
				}
				B.vx = 0;
				B.x = B.r;
			}
			if (B.y <= B.r) {
				if (!roomtrans && cr.complete && cr.adj[1]) {
					if (B.x-B.r>=250 && B.x+B.r<=350) {
						goToRoom(1);
					}
				}
				B.vy = 0;
				B.y = B.r;
			}
			if (B.x >= 600 - B.r) {
				if (!roomtrans && cr.complete && cr.adj[2]) {
					if (B.y-B.r>=150 && B.y+B.r<=250) {
						goToRoom(2);
					}
				}
				B.vx = 0;
				B.x = 600 - B.r;
			}
			if (B.y >= 400 - B.r) {
				if (!roomtrans && cr.complete && cr.adj[3]) {
					if (B.x-B.r>=250 && B.x+B.r<=350) {
						goToRoom(3);
					}
				}
				B.vy = 0;
				B.y = 400 - B.r;
			}
			B.x -= B.r;
			B.y -= B.r;
			B.w = B.r*2;
			B.h = B.r*2;
			if (!B.dead) B.iPart();
			B.x += B.r;
			B.y += B.r;
			
			// step the room + minimap array
			cr.stepRoom();
			cr.drawRoom(g);
			if (!cr.visited) {
				cr.visited = true;
				if (m[B.rx][B.ry].type != ROOMS.SECRET) minimap.set(B.rx,B.ry,2);
				for(var _i=0;_i<cr.adj.length;_i++) {
					if (cr.adj[_i]) {
						rpos = mpos[_i];
						newroomx = B.rx + rpos[0];
						newroomy = B.ry + rpos[1];
						if (m[newroomx][newroomy].type != ROOMS.SECRET) minimap.set(newroomx,newroomy,1);
					}
				}
			}
			
			// bug array stuff
			for(var i=0;i<B.barr.length;i++) {
				if (B.dead) break;
				b = B.barr[i];
				if (B.bug == "flies" || B.bug == "bees") {
					if ((b.cycle=b.cycle==3?0:b.cycle++) == 0) {
						b.lwing=4+Math.random()*4;
						b.rwing=4+Math.random()*4;
					}
				} else if (B.bug == "ladybugs") {
					if ((b.cycle=b.cycle==7?0:b.cycle++) == 0) {
						b.lwing = Math.random()*Math.PI/7+Math.PI/12;
					}
				} else {
					if ((b.cycle=b.cycle==5?0:b.cycle++) == 0) {
						b.lwing=1+Math.random()*3;
						b.rwing=1+Math.random()*3;
					}
				}
			}
			
			// monsters
			for(var i=0;i<cr.m.length;i++) {
				a = cr.m[i];
				a.hitTime -= 25;
				if (a.hitTime > 0) { g.globalAlpha(a.hitTime%100<50?0.4:1); }
				a.draw(g);
				g.globalAlpha(1);
				if (B.dead) continue;
				alive = a.step();
				if (alive===false) {
					if (Settings.vampire > 0) {
						B.killcounter++;
						if (B.killcounter >= 6) {
							B.killcounter = 0;
							B.heal(Settings.vampire);
						}
					}
					if (Math.random() < (0.19-difficulty*0.03) * (isNaN(a.cspawn)?1:a.cspawn)) {
						// generate an item
						if (Math.random() < 0.8) {
							// generate a coin
							cr.coin.push({
								x : a.x+a.w/2,
								y : a.y+a.h/2,
								s : 0,
								stat : 'expand'
							});
						} else {
							// generate a heart
							if (Math.random() < 0.2) {
								// generate a 5 heart
								cr.heart.push({
									x : a.x+a.w/2,
									y : a.y+a.h/2,
									t : 5,
									s : 0,
									stat : 'expand'
								});
							} else {
								// generate a 1 heart
								cr.heart.push({
									x : a.x+a.w/2,
									y : a.y+a.h/2,
									t : 1,
									s : 0,
									stat : 'expand'
								});
							}
						}
					}
					cr.m.splice(i,1);
					i--;
				}
			}
			// shop item
			for(var i=0;i<cr.shopitem.length;i++) {
				p = cr.shopitem[i];
				if (col(B.x-B.r,B.y-B.r,B.w,B.h,p.x-20,p.y-10,46,20)) {
					cost = (p.t=='hp'?25:20);
					if (c.g("achBanking")) cost -= 3;
					if (B.coin < cost) continue;
					B.coin -= cost;
					if (p.t == 'attack') {
						B.setAttack(B.nattack+3);
					} else if (p.t == 'firing') {
						B.setFiring(B.nfiring+3);
					} else if (p.t == 'speed') {
						B.setSpeed(B.nspeed+5);
					} else if (p.t == 'shotspeed') {
						B.setShotSpeed(B.nshotspeed+5);
					} else if (p.t == 'hp') {
						B.setMaxHP(10);
					}
					cr.shopitem.splice(i,1);
					i--;
					cr.smokeUp(p.x,p.y,30);
				}
			}
			// powerups
			cost = 40;
			if (c.g("achWho Needs Them")) cost -= 5;
			if (c.g("achPower Path")) cost -= 4;
			if (c.g("achOverload")) cost -= 4;
			for(var i=0;i<cr.powerup.length;i++) {
				p = cr.powerup[i];
				if (col(B.x-B.r,B.y-B.r,B.w,B.h,p.x,p.y,40,40)) {
					if (p.m) {
						if (B.coin < cost) continue;
						B.coin -= cost;
					}
					powertaken++;
					playSound('woosh');
					itemname = Items[p.it];
					Powerups[itemname](p.it);
					cr.powerup.splice(i,1);
					i--;
					cr.smokeUp(p.x+20,p.y+20,30);
					showtext = 3000;
					texttoshow = itemname;
					if (chalon == "self") {
						B.hit(B.maxhp / 2);
					}
				}
			}
			// hearts
			for(var i=0;i<cr.heart.length;i++) {
				h = cr.heart[i];
				if (h.t == 1) {
					hw = hh = 15*h.s;
				} else {
					hw = hh = 24*h.s;
				}
				hrtx = h.x - hw/2;
				hrty = h.y - hh/2;
				if (!isNaN(h.mtimer)) h.mtimer -= 25;
				if (col(B.x-B.r,B.y-B.r,B.r*2,B.r*2,hrtx,hrty,hw,hh)) {
					if (h.m) {
						if (isNaN(h.mtimer)) h.mtimer = 0;
						if (h.mtimer > 0) continue;
						if (B.coin < (h.t==1?2:8)) continue;
					}
					if (B.hp < B.maxhp) {
						if (h.m) B.coin -= h.t==1?2:8;
						B.heal(h.t);
						playSound('heart');
						cr.smokeUp(h.x,h.y,15);
						if (!h.m) {
							cr.heart.splice(i,1);
							i--;
						} else {
							h.mtimer = 1000;
						}
					}
				}
			}
			// coins
			for(var i=0;i<cr.coin.length;i++) {
				h = cr.coin[i];
				hr = 10*h.s;
				hrtx = h.x - hr;
				hrty = h.y - hr;
				if (col(B.x-B.r,B.y-B.r,B.r*2,B.r*2,hrtx,hrty,hr*2,hr*2)) {
					cr.smokeUp(h.x,h.y,7);
					B.coin++;
					cr.coin.splice(i,1);
					i--;
					if (cr.type == ROOMS.CHALLENGE && isNaN(cr.chalstarttimer)) {
						cr.chalstarttimer = 2000;
						cr.complete = false;
					}
				}
			}
			// portal
			if (cr.portal == 20) {
				if (DBP(cr.portx,cr.porty,B.x,B.y) <= 20) {
					roomtrans = true;
					nextfloor = true;
					nftrans = 0;
				}
			}
			// weapon
			if (!B.dead) B.weap.step();
			
		}
		
		// ROCKETS
		if (roomtrans) g.translate(-npx*600*rtr,-npy*400*rtr);
		for(var i=0;i<rockets.length;i++) {
			r = rockets[i];
			r.v += r.acc;
			r.x += Math.cos(r.a)*r.v;
			r.y += Math.sin(r.a)*r.v;
			g.translate(r.x,r.y);
				g.rotate(r.a);
					g.fillStyle("rgb(220,220,220)");
					g.strokeStyle("rgb(0,0,0)");
					g.beginPath();
						g.arc(5,0,5,-Math.PI/2,Math.PI/2,false);
						g.lineTo(5,-5);
						g.lineTo(-5,-5);
						g.lineTo(-5,5);
						g.lineTo(5,5);
						g.fill();
						g.stroke();
				g.rotate(-r.a);
			g.translate(-r.x,-r.y);
			destroybullet = false;
			if (r.x<5 || r.y<5 || r.x>595 || r.y>395) {
				destroybullet = true;
			}
			if (!Settings.ghostb || r.t != 0) {
				for(var j=0;j<cr.rock.length;j++) {
					if (col(cr.rock[j].x,cr.rock[j].y,cr.rock[j].w,cr.rock[j].h,r.x-5,r.y-5,10,10)) {
						destroybullet = true;
						break;
					}
				}
				for(var j=0;j<cr.lockrock.length;j++) {
					if (col(cr.lockrock[j].x,cr.lockrock[j].y,cr.lockrock[j].w,cr.lockrock[j].h,r.x-5,r.y-5,10,10)) {
						destroybullet = true;
						break;
					}
				}
			}
			for(var j=0;j<cr.m.length;j++) {
				a = cr.m[j];
				if (col(a.x,a.y,a.w,a.h,r.x-5,r.y-5,10,10)) {
					destroybullet = true;
					break;
				}
			}
			if (destroybullet) {
				cr.explode(r.x,r.y,r.d,r.t);
				rockets.splice(i,1);
				i--;
			}
		}
		if (roomtrans) g.translate(npx*600*rtr,npy*400*rtr);
		// BULLETS
		if (roomtrans) g.translate(-npx*600*rtr,-npy*400*rtr);
		if (Settings.ghostb) g.globalAlpha(0.33);
		g.fillStyle("rgb(255,255,255)");
			for(var i=0;i<bullets.length;i++) {
				b = bullets[i];
				b.frames++;
				g.fillStyle(b.color);
				if (!roomtrans && !B.dead) {
					b.x += b.vx;
					b.y += b.vy;
				}
				if (Settings.seekerb && b.frames > 4) {
					var projx = b.x + b.vx * 10;
					var projy = b.y + b.vy * 10;
					var projspeed = Math.min(15, 8 + B.shotspeed / 4);
					if (cr.m.length > 0) {
						cmx=0,cmy=0;
						cdist = 5000;
						actualcdist = 0;
						for(var j=0;j<cr.m.length;j++) {
							ndist = DBP(cr.m[j].x+cr.m[j].w/2,cr.m[j].y+cr.m[j].h/2,projx+ds/2,projy+ds/2);
							if (ndist < cdist) {
								cdist = ndist;
								actualcdist = DBP(cr.m[j].x+cr.m[j].w/2,cr.m[j].y+cr.m[j].h/2,b.x+ds/2,b.y+ds/2);
								cmx = cr.m[j].x+cr.m[j].w/2;
								cmy = cr.m[j].y+cr.m[j].h/2;
							}
						}
						var fact = 4 / Math.max(1,actualcdist-20);
						ang = getAngle(cmx-b.x-ds/2,cmy-b.y-ds/2);
						b.vx += projspeed*Math.cos(ang) * fact;
						b.vy += projspeed*Math.sin(ang) * fact;
						if (actualcdist < 70) {
							b.vx *= 0.6+actualcdist/170;
							b.vy *= 0.6+actualcdist/170;
						}
					}
				}
				ds = b.s > 3 ? b.s : 3;
				g.beginPath();
				g.arc(b.x+ds/2,b.y+ds/2,ds/2,0,2*Math.PI);
				g.fill();
				if (roomtrans) continue;
				destroybullet = false;
				if (b.type == "dissipate") {
					if (isNaN(b.odmg)) {
						b.odmg = b.dmg;
						b.os = b.s;
						b.oleft = b.left;
					}
					b.left-=rab(0.8,1.2);
					if (b.left <= 0) {
						b.dmg = b.odmg * (1 - Math.abs(b.left) / b.oleft);
						prevs = b.s;
						b.s = b.os * (1 - Math.abs(b.left) / b.oleft);
						news = b.s
						b.x += (prevs-news)/2;
						b.y += (prevs-news)/2;
						if (b.left <= -b.oleft) destroybullet = true;
					}
				}
				if (b.x < 0 || b.y < 0 || b.x > 600 - b.s || b.y > 400 - b.s) {
					//if (b.s > 3) { playPopSound(); }
					destroybullet = true;
				}
				if (!destroybullet && !Settings.ghostb) {
					for(var j=0;j<cr.rock.length;j++) {
						if (col(cr.rock[j].x,cr.rock[j].y,cr.rock[j].w,cr.rock[j].h,b.x,b.y,b.s,b.s)) {
							destroybullet = true;
							break;
						}
					}
					for(var j=0;j<cr.lockrock.length;j++) {
						if (col(cr.lockrock[j].x,cr.lockrock[j].y,cr.lockrock[j].w,cr.lockrock[j].h,b.x,b.y,b.s,b.s)) {
							destroybullet = true;
							break;
						}
					}
				}
				for(var j=0;j<cr.m.length;j++) { if (destroybullet) break;
					alreadyhit = false;
					for(var k=0;k<b.hit.length;k++) {
						if (b.hit[k] == j) { alreadyhit = true; break; }
					}
					a = cr.m[j];
					if (col(a.x,a.y,a.w,a.h,b.x,b.y,ds,ds)) {
						effvx = b.vx * ds * a.knockback;
						effvy = b.vy * ds * a.knockback;
						if (Settings.seekerb) {
							effvx *= 0.2;
							effvy *= 0.2;
						}
						if (!Settings.pierceb) {
							a.vx += effvx * B.knockback;
							a.vy += effvy * B.knockback;
						}
						if (alreadyhit) continue;
						killed = a.hit(b.dmg);
						a.hitTime = 500;
						if (Settings.pierceb) { b.hit.push(j); continue; }
						if (Settings.melterb && killed[0]) {
							b.s *= (b.dmg - killed[1]) / b.dmg;
							b.dmg -= killed[1];
							if (b.dmg <= 0) {
								destroybullet = true;
								break;
							}
						} else {
							destroybullet = true;
							break;
						}
					}
				}
				if (destroybullet) {
					if (b.nosplash !== true) createSplash(b.x+b.s/2,b.y+b.s/2,b.s,b.color);
					bullets.splice(i,1);
					i--;
				}
			}
		g.globalAlpha(1);
		for(var i=0;i<bulletsplash.length;i++) {
			b = bulletsplash[i];
			g.fillStyle(b.color);
			b.spd *= 0.85;
			b.x += Math.cos(b.a)*b.spd;
			b.y += Math.sin(b.a)*b.spd;
			b.alpha -= rab(0.04,0.05);
			if (b.alpha < 0) b.alpha = 0;
			g.globalAlpha(b.alpha);
			g.fillRect(b.x,b.y,b.s,b.s);
			g.globalAlpha(1);
			if (b.alpha <= 0) {
				bulletsplash.splice(i,1);
				i--;
			}
		}
		if (roomtrans) g.translate(npx*600*rtr,npy*400*rtr);
		
		// dead/pause draw
		if (popac>0) {
			g.fillStyle("rgba(0,0,0,"+(popac*0.7)+")");
			g.fillRect(0,0,600,400);
		} else if (B.dead) {
			g.fillStyle("rgba(0,0,0,"+(B.dtrans>0.7?0.7:B.dtrans)+")");
			g.fillRect(0,0,600,400);
			g.fillStyle("rgba(255,255,0,"+(B.dtrans==0?0:0.2)+")");
			g.beginPath();
				g.arc(B.x,B.y,15+40*(B.dtrans>0.7?0.7:B.dtrans),0,2*Math.PI);
				g.fill();
		}
		// draw bug stuff
		if (roomtrans && !B.dead) {
			if (nrmoved) {
				g.translate(npx*600,npy*400);
					g.translate(-npx*600*rtr,-npy*400*rtr);
			} else {
				g.translate(-npx*600*rtr,-npy*400*rtr);
			}
		}
			if (B.inv > 0 && B.specialinv && (B.inv > 2000 || (B.inv%150<75))) {
				g.fillStyle("rgba(255,255,0,0.2)");
				g.beginPath();
				g.arc(B.x,B.y,40,0,2*Math.PI);
				g.fill();
			}
			if (B.inv > 0 && !B.specialinv) { g.globalAlpha(B.inv%150<75?1:0.3); }
			draw[B.bug](g,false,B.x-10,B.y-10,20,20,B.barr[0].lwing,B.barr[1].rwing);
			if (!B.dead) B.ring1 += 0.005*2*Math.PI * 8 / B.bugs;
			g.translate(B.x,B.y);
				for(var i=1;i<1+B.r1;i++) {
					b = B.barr[i];
					b.a = ang = B.ring1 + (i-1)/(B.r1)*2*Math.PI;
					draw[B.bug](g,false,b.x=Math.cos(ang)*17-5,b.y=Math.sin(ang)*17-5,10,10,b.lwing,b.rwing);
					b.x += B.x; b.y += B.y;
				}
				for(var i=1+B.r1;i<1+B.r1+B.r2;i++) {
					b = B.barr[i];
					b.a = ang = B.ring2 + (i-1-B.r1)/(B.r2)*2*Math.PI;
					draw[B.bug](g,false,b.x=Math.cos(ang)*30-5,b.y=Math.sin(ang)*30-5,10,10,b.lwing,b.rwing);
					b.x += B.x; b.y += B.y;
				}
				for(var i=1+B.r1+B.r2;i<1+B.r1+B.r2+B.r3;i++) {
					b = B.barr[i];
					b.a = ang = B.ring3 + (i-1-B.r1-B.r2)/(12)*2*Math.PI;
					draw[B.bug](g,false,b.x=Math.cos(ang)*40-5,b.y=Math.sin(ang)*40-5,10,10,b.lwing,b.rwing);
					b.x += B.x; b.y += B.y;
				}
				g.strokeStyle("rgb(0,0,0)");
				g.beginPath();
					g.arc(0,0,B.r,0,2*Math.PI);
					g.stroke();
				B.weap.draw(g,0,0);
			g.translate(-B.x,-B.y);
		if (roomtrans && !B.dead) {
			if (nrmoved) {
				g.translate(-npx*600,-npy*400);
					g.translate(npx*600*rtr,npy*400*rtr);
			} else {
				g.translate(npx*600*rtr,npy*400*rtr);
			}
		}
		if (B.inv > 0) { g.globalAlpha(1); }
		
		if (!roomtrans) {
			cr.drawRoomAfter(g);
		}
		
		// boss stuff
		bosshp = 0;
		bossmaxhp = 0;
		for(var i=0;i<cr.m.length;i++) {
			a = cr.m[i];
			if (a.boss) {
				bossmaxhp += a.maxhp;
				bosshp += a.hp;
			}
		}
		if (bosshp > 0 && bossmaxhp > 0) {
			g.strokeStyle("rgb(0,0,0)");
			g.fillStyle("rgb(200,0,0)");
			g.fillRect(100,0,400,10);
			g.strokeRect(100,0,400,10);
			g.fillStyle("rgb(0,200,0)");
			g.fillRect(100,0,400*bosshp/bossmaxhp,10);
			g.strokeRect(100,0,400*bosshp/bossmaxhp,10);
		}
		
		if (nextfloor) {
			// next floor transition
			if (nftrans >= 0) {
				nftrans += 0.05;
				if (nftrans >= 1) {
					nextFloor();
					nftrans = -1;
				}
			} else {
				roomtrans = false;
				nftrans += 0.05;
				if (nftrans >= 0) {
					nftrans = 0;
					roomtrans = false;
					nextfloor = false;
				}
			}
			g.fillStyle("rgba(0,0,0,"+Math.abs(nftrans)+")");			
			g.fillRect(0,0,600,400);
		} else {
			L.drawWord("F"+B.floor+" "+(difficulty==3?"Hard":(difficulty==2?"Med":"Easy")),g,10,10,8,10,"rgb(255,255,255)");
		}
	g.translate(0,-100);
	
	if (_tr_ == 1) {
		B.rattack = 90;
		B.rspeed = 30;
		B.rfiring = 60;
		B.rshotspeed = 20;
		B.hp = 120;
	} else if (_tr_ == 2) {
		B.rattack = 25;
		B.rspeed = 30;
		B.rfiring = 20;
		B.rshotspeed = 10;
		B.hp = 120;
	}
	
	// stats
	g.strokeStyle("rgb(0,0,0)");
	g.strokeRect(0,100,600,400);
	g.fillStyle("rgb(0,0,0)");
	g.fillRect(0,0,600,100);
	draw.icons.heart(g,15,12,20,17);
	str = B.hp+"/"+B.maxhp;
	L.drawWord(B.hp+"/"+B.maxhp,g,45,14,str.length>5?8:10,10,"rgb(255,255,255)");
	draw.icons.attack(g,15,41,20,17);
	L.drawWord(B.nattack+showChange(B.attack,B.nattack),g,45,43,10,10,"rgb(255,255,255)");
	draw.icons.speed(g,15,70,20,17);
	L.drawWord(B.nspeed+showChange(B.speed,B.nspeed),g,45,72,10,10,"rgb(255,255,255)");
	draw.icons.firing(g,125,12,20,17);
	L.drawWord(B.nfiring+showChange(B.firing,B.nfiring),g,155,14,10,10,"rgb(255,255,255)");
	draw.icons.shotspeed(g,125,41,20,17);
	L.drawWord(B.nshotspeed+showChange(B.shotspeed,B.nshotspeed),g,155,43,10,10,"rgb(255,255,255)");
	g.drawImage(Images.coin,125,70,20,20);
	L.drawWord(""+B.coin,g,155,72,10,10,"rgb(255,255,255)");
	// items
	g.translate(20,0);
	for(var i=0;i<B.items.length;i++) {
		g.fillStyle("rgba(255,255,255,0.6)");
		if (B.onitem == i) g.fillStyle("rgba(255,255,255,0.85)");
		g.fillRect(213+75*i,12,60,60);
		if (B.items[i]) {
			g.drawImage(Images['item'+B.items[i].n],213+75*i,12,60,60);
			if (B.items[i].bars > 0) {
				g.strokeStyle("rgb(0,0,0)");
				g.beginPath();
				g.moveTo(213+75*i,12,60,60);
				g.lineTo(273+75*i,72,60,60);
				g.moveTo(213+75*i,72,60,60);
				g.lineTo(273+75*i,12,60,60);
				g.stroke();
			}
			g.fillStyle("rgb(150,150,150");
			for(var j=0;j<B.items[i].bars;j++) {
				g.fillRect(213+75*i+(10/9+5)*j,75,5,10);
			}
			if (B.items[i].t > 0) {
				if (B.items[i].maxt == 0) B.items[i].maxt = B.items[i].t;
				B.items[i].t -= 25;
				g.strokeStyle("rgb(200,200,200");
				g.strokeRect(213+75*i,88,60,5);
				g.fillStyle("rgb(200,200,200)");
				g.fillRect(213+75*i,88,60*B.items[i].t/B.items[i].maxt,5);
				if (B.items[i].t <= 0) B.items[i].maxt = 0;
			}
		} else {
			
		}
		L.drawWord(""+(i+1),g,217+75*i,16,9,11,"rgb(50,50,50)");
	}
	g.translate(-20,0);
	// minimap
	if (!travelmm) {
		if (minimapkey > -1 && !roomtrans && cr.complete) {
			if ((new Date()).getTime() - minimapkey > 1000) {
				travelmm = true;
				tmmx = B.rx;
				tmmy = B.ry;
			}
		}
		if (minimap.expand) {
			minimap.expratio += 0.1;
		} else {
			minimap.expratio -= 0.1;
		}
		if (minimap.expratio < 1) minimap.expratio = 1;
		if (minimap.expratio > 2) minimap.expratio -= 0.1;
		if (minimap.expratio > 2.1) minimap.expratio -= 0.1;
	} else {
		minimap.expratio += 0.2;
		if (minimap.expratio > 4.374) minimap.expratio = 4.374;
	}
	mmw = (minimap.width - 10) * minimap.expratio;
	mmh = (minimap.height - 10) * minimap.expratio;
	othermmw = minimap.width * minimap.expratio;
	othermmh = minimap.height * minimap.expratio;
	g.fillStyle("rgb(60,60,60)");
	g.fillRect(600-5-othermmw,5,othermmw,othermmh);
	mmr = 1;
	mmrw = (minimap.maxx - minimap.minx + 1) * minimap.ratio;
	mmrh = minimap.maxy - minimap.miny + 1;
	mmratiow = mmw / mmrw;
	mmratioh = mmh / mmrh;
	mmr = mmratiow > mmratioh ? mmratioh : mmratiow;
	roomw = minimap.ratio * mmr;
	roomh = mmr;
	closedw = mmrw * mmr;
	closedh = mmrh * mmr;
	mmtx = 590 - mmw + (mmw - closedw) / 2;
	mmty = (mmh - closedh) / 2 + 10;
	g.translate(mmtx,mmty);
	for(r in minimap.s) {
		if (!minimap.s.hasOwnProperty(r)) continue;
		mnrx = mmrx = parseInt(r.substring(1,r.indexOf("-")));
		mnry = mmry = parseInt(r.substring(r.indexOf("-")+1));
		drm = m[mnrx][mnry];
		if (drm.type == ROOMS.SECRET) continue;
		mmrx -= minimap.minx;
		mmry -= minimap.miny;
		g.translate(mmrx*roomw,mmry*roomh);
			if (mnrx == B.rx && mnry == B.ry) g.fillStyle("rgb(255,255,255)");
			else if (minimap.s[r] == 1) g.fillStyle("rgb(120,120,120)");
			else g.fillStyle("rgb(170,170,170)");
			if (mnrx == B.rx && mnry == B.ry) g.strokeStyle("rgb(0,0,255)");
			else g.strokeStyle("rgb(0,0,0)");
			g.fillRect(0,0,roomw,roomh);
			g.strokeRect(0,0,roomw,roomh);
				if (drm.type == ROOMS.HEALTH && (!drm.heart || drm.heart.length>0)) {draw.icons.heart(g,roomw/6,roomh/6,roomw*2/3,roomh*2/3);}
				if (drm.type == ROOMS.BOSS) {L.drawWord("B",g,roomw/8,roomh/8,roomw*3/4,roomh*3/4,"rgb(0,0,0)",1);}
				if (drm.type == ROOMS.POWERUP && (!drm.powerup || drm.powerup.length>0)) {L.drawWord("P",g,roomw/8,roomh/8,roomw*3/4,roomh*3/4,"rgb(0,0,0)",1);}
				if (drm.type == ROOMS.COMPLETE) {L.drawWord("F",g,roomw/8,roomh/8,roomw*3/4,roomh*3/4,"rgb(0,0,0)",1);}
				if (drm.type == ROOMS.SHOP) {L.drawWord("S",g,roomw/8,roomh/8,roomw*3/4,roomh*3/4,"rgb(0,0,0)",1);}
				if (drm.type == ROOMS.CHALLENGE && drm.chaldone!==true) {L.drawWord("C",g,roomw/8,roomh/8,roomw*3/4,roomh*3/4,"rgb(0,0,0)",1);}
			if (travelmm && mnrx == tmmx && mnry == tmmy) {
				g.strokeStyle("rgb(255,0,0)");
				g.lineWidth(5);
				g.strokeRect(2,2,roomw-4,roomh-4);
				g.lineWidth(1);
			}
		g.translate(-mmrx*roomw,-mmry*roomh);
	}
	for(r in minimap.s) {
		if (!minimap.s.hasOwnProperty(r)) continue;
		mnrx = mmrx = parseInt(r.substring(1,r.indexOf("-")));
		mnry = mmry = parseInt(r.substring(r.indexOf("-")+1));
		if (B.rx == mnrx && B.ry == mnry) {
			mmrx -= minimap.minx;
			mmry -= minimap.miny;
			g.translate(mmrx*roomw,mmry*roomh);
				g.lineWidth(2);
				g.strokeStyle("rgb(0,0,150)");
				g.strokeRect(0,0,roomw,roomh);
				g.lineWidth(1);
			g.translate(-mmrx*roomw,-mmry*roomh);
		}
		
	}
	g.translate(-mmtx,-mmty);
	g.strokeStyle("rgb(255,255,255)");
	g.strokeRect(600-5-othermmw,5,othermmw,othermmh);
	// draw pause/options
	g.strokeStyle("rgb(255,255,255)");
	g.fillStyle("rgb(255,255,255)");
	g.strokeRect(570,470,20,20);
	g.fillRect(574,473,5,14);
	g.fillRect(581,473,5,14);
	g.strokeRect(540,470,20,20);
	g.beginPath();
		g.arc(550,480,6,0,2*Math.PI);
		for(var i=0;i<10;i++) {
			ang = i * 2 * Math.PI / 10;
			g.arc(550+6*Math.cos(ang),480+6*Math.sin(ang),2,0,2*Math.PI);
		}
		g.fill();
	g.fillStyle("rgb(150,150,150)");
	g.beginPath();
		g.arc(550,480,2,0,2*Math.PI);
		g.fill();
	// show text stuff
	if (showtext > 0) {
		showtext -= 25;
		textsize++;
		if (textsize > 17) textsize = 17;
	} else {
		textsize--;
		if (textsize < 0) textsize = 0;
	}
	if (textsize > 0) {
		L.drawWord(texttoshow,g,10,490-textsize,textsize,textsize,"rgb(255,255,255)",2);
	}
	ach_timer -= 25;
	if (ach_timer>0) {
		ach_trans += 0.05;
	} else {
		ach_trans -= 0.05;
	}
	if (ach_trans > 1) ach_trans = 1;
	if (ach_trans < 0) ach_trans = 0;
	if (ach_trans > 0) {
		L.drawWord("ACHIEVEMENT UNLOCKED",g,37,200,20,20,"rgba(255,255,255,"+ach_trans+")");
		L.drawWord(ach_text,g,300-(ach_text.split("").length*12),240,20,20,"rgba(255,255,255,"+ach_trans+")");
		L.drawWord(ach_text2,g,300-(ach_text2.split("").length*12),280,20,20,"rgba(0,0,255,"+ach_trans+")");
	}
	checkUnlocks();
	if (!c.g("achConsumer") && B.coin < ocoin) {
		i = seekAch("Consumer");
		unlocks[i][3] = true;
		c.s("ach"+unlocks[i][0],true);
		ach_text = unlocks[i][0];
		ach_text2 = unlocks[i][2];
		ach_timer = 5000;
	}
	// tutorial stuff
	if (c.g("tutorial")) {
		if (!travelmm) {
			g.strokeStyle("rgb(255,255,255)");
			if (B.floor == 1 && !roomtrans && cr.type == ROOMS.STARTING) {
				L.drawWord(" Welcome to swarm\n\n\n  move     shoot\n\n   W         ^\n  A D       < >\n   S         |",g,120,150,12,12);
				g.beginPath();
					g.moveTo(20,19);
					g.lineTo(2,19);
					g.lineTo(2,180);
					g.lineTo(30,180);
					g.lineTo(30,470);
					g.lineTo(150,470);
					g.moveTo(20,48);
					g.lineTo(5,48);
					g.lineTo(5,175);
					g.lineTo(35,175);
					g.lineTo(35,450);
					g.lineTo(150,450);
					g.moveTo(20,77);
					g.lineTo(8,77);
					g.lineTo(8,170);
					g.lineTo(40,170);
					g.lineTo(40,430);
					g.lineTo(150,430);
					g.moveTo(130,19);
					g.lineTo(112,19);
					g.lineTo(112,410);
					g.lineTo(150,410);
					g.moveTo(130,48);
					g.lineTo(115,48);
					g.lineTo(115,390);
					g.lineTo(150,390);
					g.moveTo(130,77);
					g.lineTo(118,77);
					g.lineTo(118,370);
					g.lineTo(150,370);
					g.moveTo(550,470);
					g.lineTo(550,450);
					g.lineTo(530,450);
					g.moveTo(580,470);
					g.lineTo(580,430);
					g.lineTo(530,430);
					g.moveTo(520,95);
					g.lineTo(520,150);
				g.stroke();
				L.drawWord("Health HP/Max HP",g,155,465,9,9);
				L.drawWord("Attack",g,155,445,9,9);
				L.drawWord("Speed",g,155,425,9,9);
				L.drawWord("Firing Rate",g,155,405,9,9);
				L.drawWord("Shot Speed",g,155,385,9,9);
				L.drawWord("Coins",g,155,365,9,9);
				L.drawWord("Pause",g,467,425,9,9);
				L.drawWord("Options",g,443,445,9,9);
				L.drawWord("This is the\nminimap of the\ncurrent floor\nPress m to\nexpand",g,410,156,9,9);
				L.drawWord("Tutorial mode is on\nYou can turn it off\nin the options",g,380,300,8,8,"rgb(0,0,255)");
			}
			g.fillStyle("rgb(255,255,255)");
			if (B.floor == 1 && !roomtrans && cr.type == ROOMS.POWERUP && cr.powerup.length>0) {
				L.drawWord("\n\nThe Powerup Room\n\n\nWill contain either a\npowerup or an item\ntouch it to pick it up",g,20,110,12,12);
			}
			if (B.floor == 1 && !roomtrans && cr.type == ROOMS.HEALTH && cr.heart.length>0) {
				L.drawWord("\n\nThe Health Room\n\n\nWill contain a bunch of hearts",g,20,110,12,12);
			}
			if (B.floor == 1 && !roomtrans && cr.type == ROOMS.CHALLENGE && cr.coin.length>0 && cr.chaldone!==true && this.chalspawned !== true) {
				L.drawWord("\n\nThe Challenge Room\n\n\nPicking up the red coin will\nbegin the challenge",g,20,110,12,12);
			}
			if (B.floor == 1 && !roomtrans && cr.type == ROOMS.SHOP) {
				L.drawWord("\n\nThe Shop\nSave up those coins and buy\npowerups health and upgrades here",g,20,110,12,12);
			}
			if (B.floor == 1 && !roomtrans && cr.type == ROOMS.BOSS && cr.m.length == 0) {
				L.drawWord("\n\nAfter defeating the boss on each floor\na portal will appear\nThis portal takes you to the next floor\n\nyou can either go back and clear\nthe rest of the rooms on a floor\nor just head on to the next floor",g,20,110,10,10);
			}
			if (B.floor == 1 && !roomtrans && cr.type == ROOMS.COMPLETE) {
				L.drawWord("\n\nThis is the floor finish room\nIt is unlocked when you clear\nall the rooms on the current floor",g,20,110,12,12);
				if (!cr.lockrock && !travelmm) {
					L.drawWord("To quickly navigate back to the boss room/portal\nor any other room\n\nhold down m",g,80,200,8,8,"rgb(0,0,255)");
				}
			}
		}
		if (travelmm) {
			L.drawWord("Use the movement keys to move around rooms\nand Enter to go to that room",g,20,450,8,8,"rgb(0,255,0)");
		}
		g.strokeStyle("rgb(0,0,255)");
		if (tut.gotitem == -1 && (B.items[0] || B.items[1] || B.items[2])) {
			L.drawWord("You got an item",g,190,120,10,10);
			L.drawWord("Press 1-3 to switch between the item slots\nPress spacebar to use the item",g,80,140,8,8);
			if ((B.items[0] && B.items[0].bars>0) || (B.items[1] && B.items[1].bars>0) || (B.items[2] && B.items[2].bars>0)) {
				if (B.items[0]) itemn = 0;
				if (B.items[1]) itemn = 1;
				if (B.items[2]) itemn = 2;
				itemobar = B.items[itemn].bars;
				tut.gotitem = 0;
			}
		} else if (tut.gotitem == 0) {
			if (B.items[itemn].bars == itemobar) {
				g.beginPath();
					g.moveTo(240+75*itemn,72);
					g.lineTo(240+75*itemn,125);
					g.stroke();
				L.drawWord("An item needs to recharge\nfinishing a room recharges 1 bar",g,100,128,9,9);
			} else {
				tut.gotitem = 1;
			}
		}
	}
	
	if (cr.m.length > 0) {
		$('.qsave').attr('disabled',true);
	} else if (c.storageType == "localStorage") {
		$('.qsave').attr('disabled',false);
	}
	
}
setInterval("step()",25);
var mmw = 90, mmh = 90;

var itemn;
var itemobar;
var tut = {
	gotitem : 0
};

function showChange(now,norm) {
	if (now == norm) return "";
	if (now > norm) return "+"+(now-norm);
	return "-"+(norm-now);
}















