
var ROOMS = {
	STARTING : 0,	// starting room
	BOSS : 1,		// boss room
	POWERUP : 2,	// powerup room
	HEALTH : 3,		// health room
	COMPLETE : 4,	// all rooms complete room
	SHOP : 5,		// shop room
	CHALLENGE : 6,	// challenge room - rewards as powerup room
	SECRET : 7,		// secret room
	
	NORMAL : 99
};

var adjroompos = [[-1,0],[0,-1],[1,0],[0,1]];
var opendpos = [[[0,150,5,50,0,-50],  [0,200,5,50,0,50]],
				[[250,0,50,5,-50,0],  [300,0,50,5,50,0]],
				[[595,150,5,50,0,-50],[595,200,5,50,0,50]],
				[[250,395,50,5,-50,0],[300,395,50,5,50,0]]];
var closedpos = [[0,150,0,250],[250,0,350,0],[600,150,600,250],[250,400,350,400]];

Object.defineProperty(Object.prototype, "createBullet", { value: function(x,y,vx,vy,dmg,size) {
	this.bullets.push({
		x : x,
		y : y,
		vx : vx,
		vy : vy,
		dmg : dmg,
		s : Math.min(10,isNaN(size)?(dmg+50)/6:size)
	});
}, enumerable : false});
Object.defineProperty(Object.prototype, "colAnything", { value: function(x,y,w,h) {
	if (x < 0 || y < 0 || x > 600 - w || y > 400 - h) return 1;
	for(var j=0;j<this.rock.length;j++) {
		if (col(this.rock[j].x,this.rock[j].y,this.rock[j].w,this.rock[j].h,x,y,w,h)) {
			return 1;
		}
	}
	if (col(x,y,w,h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) return 2;
	return 0;
}, enumerable : false});
Object.defineProperty(Object.prototype, "colObj", { value: function(b, useRadius) {
	if (useRadius) return this.colAnything(b.x-b.s,b.y-b.s,b.s*2,b.s*2);
	return this.colAnything(b.x, b.y, b.w, b.h);
}, enumerable : false});
Object.defineProperty(Object.prototype, "findEmptySpot", { value: function(w, h, testBug) {
	while(true) {
		var fx = Math.random()*600,
			fy = Math.random()*400;
		if (fx < 0 || fy < 0 || fx > 600 - w || fy > 400 - h) continue;
		if (testBug===true && col(fx,fy,w,h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) continue;
		var coll = false;
		for(var j=0;j<this.rock.length;j++) {
			if (col(this.rock[j].x,this.rock[j].y,this.rock[j].w,this.rock[j].h,fx,fy,w,h)) {
				coll = true;
			}
		}
		if (coll) continue;
		return {x:fx,y:fy};
	}
}, enumerable : false});


// DRAW ROOM
Object.defineProperty(Object.prototype, "drawRoom", { value: function(g) {
	g.fillStyle("rgb(150,150,150)");
	g.fillRect(0,0,600,400);
	// draw patches
	for(var i=0;i<this.patches.length;i++) {
		p = this.patches[i];
		g.fillStyle("rgb("+p.clr+","+p.clr+","+p.clr+")");
		g.fillRect(p.x,p.y,p.w,p.h);
	}
	// outline
	g.lineWidth(7);
	g.strokeStyle("rgb(50,50,50)");
	g.beginPath();
	g.moveTo(0,0);
	g.lineTo(250,0);
	g.moveTo(350,0);
	g.lineTo(600,0);
	g.lineTo(600,150);
	g.moveTo(600,250);
	g.lineTo(600,400);
	g.lineTo(350,400);
	g.moveTo(250,400);
	g.lineTo(0,400);
	g.lineTo(0,250);
	g.moveTo(0,150);
	g.lineTo(0,0);
	g.stroke();
	// doors
	if (!roomtrans && !trans && this.complete && this.dopen != 1) {
		this.dopen += 0.05;
		if (this.dopen > 1) this.dopen = 1;
	} else if (!roomtrans && !this.complete && this.dopen != 0) {
		this.dopen -= 0.05;
		if (this.dopen < 0) this.dopen = 0;
	}
	for(var i=0;i<this.adj.length;i++) {
		rmx = this.x + adjroompos[i][0];
		rmy = this.y + adjroompos[i][1];
		if (this.adj[i] && m[rmx][rmy].type != ROOMS.SECRET) {
			g.strokeStyle("rgb(0,0,0)");
			g.lineWidth(1);
			g.fillStyle("rgb(50,50,50)");
			dp = opendpos[i];
			for(var j=0;j<dp.length;j++) {
				dpce = dp[j];
				g.fillRect(dpce[0]+dpce[4]*this.dopen,dpce[1]+dpce[5]*this.dopen,dpce[2],dpce[3]);
				g.strokeRect(dpce[0]+dpce[4]*this.dopen,dpce[1]+dpce[5]*this.dopen,dpce[2],dpce[3]);
			}
		} else {
			g.strokeStyle("rgb(50,50,50)");
			g.lineWidth(7);
			dp = closedpos[i];
			g.beginPath();
			g.moveTo(dp[0],dp[1]);
			g.lineTo(dp[2],dp[3]);
			g.stroke();
		}
	}
	g.lineWidth(1);
	for(var i=0;i<this.blood.length;i++) {
		b = this.blood[i];
		if (b.spd > 0.5) {
			b.spd *= 0.85;
			b.x += Math.cos(b.a)*b.spd;
			b.y += Math.sin(b.a)*b.spd;
		} else {
			b.s+=0.04;
		}
		b.alpha -= 0.03;
		g.fillStyle("rgba(200,0,0,"+b.alpha+")");
		g.beginPath();
			g.arc(b.x,b.y,b.s,0,2*Math.PI);
			g.fill();
		if (b.alpha < b.cutoffalpha && b.spd < 0.5) {
			this.bloodsplat.push({
				x : b.x,
				y : b.y,
				s : b.s,
				alpha : b.alpha
			});
			this.blood.splice(i,1);
			i--;
		}
	}
	for(var i=0;i<this.bloodsplat.length;i++) {
		b = this.bloodsplat[i];
		g.fillStyle("rgba(200,0,0,"+b.alpha+")");
		g.beginPath();
			g.arc(b.x,b.y,b.s,0,2*Math.PI);
			g.fill();
	}
	for(var i=0;i<this.powerup.length;i++) {
		p = this.powerup[i];
		p.a += Math.PI/180*25;
		ns = Math.sin(p.a)*0.4;
		g.drawImage(Images['item'+p.it],p.x-ns,p.y-ns,40+2*ns,40+2*ns);
		g.strokeStyle("rgb(0,0,0)");
		g.beginPath();
			g.arc(p.x+20,p.y+20,25,0,2*Math.PI);
			g.stroke();
		oa = p.a / 10;
		g.translate(p.x+20,p.y+20);
		for(var j=0;j<6;j++) {
			ca = oa + j*Math.PI/3;
			cpa = ca - Math.PI/180 * 16;
			g.beginPath();
				g.moveTo(Math.cos(ca)*20,Math.sin(ca)*20);
				g.lineTo(Math.cos(cpa)*30,Math.sin(cpa)*30);
				g.stroke();
		}
		if (p.m) {
			cost = 40;
			if (c.g("achWho Needs Them")) cost -= 5;
			if (c.g("achPower Path")) cost -= 4;
			if (c.g("achOverload")) cost -= 4;
			g.drawImage(Images.coin,-22,27,17,17);
			L.drawWord(""+cost,g,-2,30,10,10,"rgb(255,255,255)");
		}
		g.translate(-p.x-20,-p.y-20);
	}
	for(var i=0;i<this.rock.length;i++) {
		r = this.rock[i];
		g.fillStyle("rgba(0,0,0,0.5)");
		g.fillRect(r.x,r.y,r.w,r.h);
	}
	for(var i=0;i<this.lockrock.length;i++) {
		lr = this.lockrock[i];
		g.fillStyle("rgba(0,0,0,0.5)");
		g.fillRect(lr.x,lr.y,lr.w,lr.h);
		g.translate(lr.x+5,lr.y+5);
		r = 0.2;
		g.fillStyle("rgb(150,150,150)");
		g.strokeStyle("rgb(150,150,150)");
			g.fillRect(50*r,85*r,100*r,75*r);
			g.translate(50*r,85*r);
				g.beginPath();
					g.moveTo(20*r,-30*r);
					g.lineTo(20*r,0);
					g.lineTo(30*r,0);
					g.lineTo(30*r,-30*r);
					g.arc(50*r,-30*r,20*r,Math.PI,0,false);
					g.lineTo(70*r,0);
					g.lineTo(80*r,0);
					g.lineTo(80*r,-30*r);
					g.arc(50*r,-30*r,30*r,0,Math.PI,true);
				g.fill();
				g.stroke();
			g.translate(-50*r,-85*r);
			g.fillStyle("rgb(0,0,0)");
				g.beginPath();
					g.arc(100*r,110*r,10*r,0,2*Math.PI);
					g.fill();
				g.fillRect(95*r,110*r,10*r,30*r);
		g.translate(-lr.x-5,-lr.y-5);
	}
	for(var i=0;i<this.heart.length;i++) {
		h = this.heart[i];
		if (h.t == 1) {
			hw = hh = 15*h.s;
		} else {
			hw = hh = 24*h.s;
		}
		if (h.stat == 'expand') {
			if (!roomtrans) h.s += 0.1;
			if (h.s >= 1.4) h.stat = 'shrink'
		} else if (h.stat == 'shrink') {
			h.s -= 0.06;
			if (h.s <= 1) {
				h.s = 1;
				h.stat = 'whatever';
				h.timer = rab(2000,2500);
			}
		} else if (h.stat == 'whatever') {
			h.timer -= 25;
			if (h.timer <= 0) h.stat = 'pexpand';
		} else if (h.stat == 'pexpand') {
			h.s += 0.05;
			if (h.s >= 1.3) h.stat = 'pshrink'
		} else if (h.stat == 'pshrink') {
			h.s -= 0.05;
			if (h.s <= 1) {
				h.s = 1;
				h.stat = 'whatever';
				h.timer = rab(2000,2500);
			}
		}
		hrtx = h.x - hw/2;
		hrty = h.y - hh/2;
		draw.icons.heart(g,hrtx,hrty,hw,hh,true);
		if (h.m) {
			g.translate(h.x,h.y);
				g.drawImage(Images.coin,-22,27,17,17);
				L.drawWord(h.t==1?"2":"8",g,-2,30,10,10,"rgb(255,255,255)");
			g.translate(-h.x,-h.y);
		}
	}
	for(var i=0;i<this.shopitem.length;i++) {
		p = this.shopitem[i];
		cost = (p.t=='hp')?25:20;
		if (c.g("achBanking")) cost -= 3;
		draw.icons[p.t=='hp'?'heart':p.t](g,p.x-20,p.y-10,20,20);
		L.drawWord("^",g,p.x+6,p.y-10,20,20,"rgb(255,255,255)");
		g.translate(p.x,p.y);
		g.drawImage(Images.coin,-22,27,17,17);
		L.drawWord(""+cost,g,-2,30,10,10,"rgb(255,255,255)");
		g.translate(-p.x,-p.y);
	}
	for(var i=0;i<this.coin.length;i++) {
		h = this.coin[i];
		hr = 10*h.s;
		if (h.stat == 'expand') {
			if (!roomtrans) h.s += 0.1;
			if (h.s >= 1.4) h.stat = 'shrink'
		} else if (h.stat == 'shrink') {
			h.s -= 0.06;
			if (h.s <= 1) {
				h.s = 1;
				h.stat = 'whatever';
				h.timer = rab(2000,2500);
			}
		} else if (h.stat == 'whatever') {
			h.timer -= 25;
			if (h.timer <= 0) h.stat = 'pexpand';
		} else if (h.stat == 'pexpand') {
			h.s += 0.05;
			if (h.s >= 1.3) h.stat = 'pshrink'
		} else if (h.stat == 'pshrink') {
			h.s -= 0.05;
			if (h.s <= 1) {
				h.s = 1;
				h.stat = 'whatever';
				h.timer = rab(2000,2500);
			}
		}
		g.drawImage((this.type==ROOMS.CHALLENGE&&isNaN(this.chalstarttimer))?Images.chalcoin:Images.coin,h.x-hr,h.y-hr,hr*2,hr*2);
	}
	if (this.portal > 0) {
		this.portal += 3;
		if (this.portal > 20) this.portal = 20;
		g.translate(this.portx,this.porty);
			pr = this.portal;
			g.fillStyle("rgb(0,100,200)");
			g.strokeStyle("rgb(0,0,0)");
			g.beginPath();
				g.arc(0,0,pr,0,2*Math.PI);
				g.stroke();
				g.fill();
			this.portr += Math.PI/60;
			for(var pt=0;pt<5;pt++) {
				ang = pt * Math.PI*0.4 + this.portr;
				g.translate(Math.cos(ang)*pr/2,Math.sin(ang)*pr/2);
					g.rotate(ang);
						g.beginPath();
						g.arc(0,0,pr/2,0,Math.PI);
						g.stroke();
					g.rotate(-ang);
				g.translate(-Math.cos(ang)*pr/2,-Math.sin(ang)*pr/2);
				g.beginPath();
			}
		g.translate(-this.portx,-this.porty);
	}
}, enumerable : false});
Object.defineProperty(Object.prototype, "drawRoomAfter", { value: function(g) {
	for(var i=0;i<this.proj.length;i++) {
		// for various types of projectiles
		b = this.proj[i];
		if (b.type == "bomb") {
			b.c = isNaN(b.c)?0:(b.c+0.1);
			if (b.c >= 2) b.c = 0;
			b.x += b.vx;
			b.y += b.vy;
			g.fillStyle("rgb(255,"+Math.floor(Math.abs(1-b.c)*255)+",0)");
			g.beginPath();
			g.arc(b.x,b.y,b.s,0,2*Math.PI);
			g.fill();
			if (this.colObj(b, true)) {
				this.explode(b.x, b.y, b.dmg, 1);
				this.proj.splice(i,1);
				i--;
				break;
			}
		}
		
	}
	g.fillStyle("rgb(0,0,0)");
	for(var i=0;i<this.bullets.length;i++) {
		b = this.bullets[i];
		if (!roomtrans && !B.dead) {
			b.x += b.vx;
			b.y += b.vy;
		}
		ds = b.s > 3 ? b.s : 3;
		g.beginPath();
		g.arc(b.x+ds/2,b.y+ds/2,ds/2,0,2*Math.PI);
		g.fill();
		if (roomtrans) continue;
		destroybullet = false;
		if (b.x < 0 || b.y < 0 || b.x > 600 - b.s || b.y > 400 - b.s) {
			destroybullet = true;
		}
		for(var j=0;j<this.rock.length;j++) {
			if (col(this.rock[j].x,this.rock[j].y,this.rock[j].w,this.rock[j].h,b.x,b.y,b.s,b.s)) {
				destroybullet = true;
				break;
			}
		}
		if (!destroybullet && col(b.x,b.y,b.s,b.s,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
			effvx = b.vx * ds * 1/50;
			effvy = b.vy * ds * 1/50;
			B.vx += effvx;
			B.vy += effvy;
			B.hit(b.dmg);
			destroybullet = true;
		}
		if (destroybullet) {
			this.createSplash(b.x+b.s/2,b.y+b.s/2,b.s);
			if (b.cluster === true) {
				realdmg = b.dmg * (isNaN(b.clusterratio)?1/3:b.clusterratio);
				ang = getAngle(b.vx,b.vy);
				bspd = DBP(0,0,b.vx,b.vy);
				for(var _c=0;_c<8;_c++) {
					ang += Math.PI/4;
					bvx = Math.cos(ang)*bspd;
					bvy = Math.sin(ang)*bspd;
					this.createBullet(b.x+b.s/2+bvx*2,b.y+b.s/2+bvy*2,bvx,bvy,realdmg);
				}
			}
			this.bullets.splice(i,1);
			i--;
		}
	}
	for(var i=0;i<this.bulletsplash.length;i++) {
		b = this.bulletsplash[i];
		b.spd *= 0.85;
		b.x += Math.cos(b.a)*b.spd;
		b.y += Math.sin(b.a)*b.spd;
		b.alpha -= rab(0.04,0.05);
		if (b.alpha < 0) b.alpha = 0;
		g.globalAlpha(b.alpha);
		g.fillRect(b.x,b.y,b.s,b.s);
		g.globalAlpha(1);
		if (b.alpha <= 0) {
			this.bulletsplash.splice(i,1);
			i--;
		}
	}
	for(var i=0;i<this.smoke.length;i++) {
		s = this.smoke[i];
		s.a -= 0.03;
		if (s.a < 0) s.a = 0;
		s.r = s.maxr * (1 - s.a);
		if (s.r < 0) s.r = 0;
		g.fillStyle("rgba("+s.color+","+s.a+")");
		g.beginPath();
			g.arc(s.x,s.y,s.r,0,2*Math.PI);
			g.fill();
		if (s.a <= 0) {
			this.smoke.splice(i,1);
			i--;
		}
	}
}, enumerable : false});

Object.defineProperty(Object.prototype, "findSpot", { value: function(g) {
	var findspotcount = 0;
	var fsx=0,fsy=0;
	while(findspotcount++ < 1000) {
		fsx = Math.random()*580+10;
		fsy = Math.random()*380+10;
		fsok = true;
		for(var j=0;j<this.rock.length;j++) {
			if (col(this.rock[j].x,this.rock[j].y,this.rock[j].w,this.rock[j].h,fsx-B.r,fsy-B.r,B.r*2,B.r*2)) {
				fsok = false;
				break;
			}
		}
		for(var j=0;j<this.lockrock.length;j++) {
			if (col(this.lockrock[j].x,this.lockrock[j].y,this.lockrock[j].w,this.lockrock[j].h,fsx-B.r,fsy-B.r,B.r*2,B.r*2)) {
				fsok = false;
				break;
			}
		}
		for(var j=0;j<this.coin.length;j++) {
			if (col(this.coin[j].x-this.coin[j].s,this.coin[j].y-this.coin[j].s,this.coin[j].s*2,this.coin[j].s*2,fsx-B.r,fsy-B.r,B.r*2,B.r*2)) {
				fsok = false;
				break;
			}
		}
		for(var j=0;j<this.heart.length;j++) {
			if (col(this.heart[j].x-13,this.heart[j].y-13,26,26,fsx-B.r,fsy-B.r,B.r*2,B.r*2)) {
				fsok = false;
				break;
			}
		}
		for(var j=0;j<this.powerup.length;j++) {
			if (col(this.powerup[j].x,this.powerup[j].y,40,40,fsx-B.r,fsy-B.r,B.r*2,B.r*2)) {
				fsok = false;
				break;
			}
		}
		if (this.portal == 1) {
			if (col(this.portx-40,this.porty-40,80,80,fsx-B.r,fsy-B.r,B.r*2,B.r*2)) {
				fsok = false;
			}
		}
		for(var i=0;i<this.shopitem.length;i++) {
			p = this.shopitem[i];
			if (col(fsx-B.r,fsy-B.r,B.w,B.h,p.x-20,p.y-10,46,20)) {
				fsok = false;
				break;
			}
		}
		if (this.type == ROOMS.COMPLETE) {
			if (fsx > 50 && fsx < 550 && fsy > 50 && fsy < 350) {
				fsok = false;
			}
		}
		if (fsok) {
			return [fsx,fsy];
		}
	}
	return [fsx,fsy];
}, enumerable : false});
Object.defineProperty(Object.prototype, "splashBlood", { value: function(x,y,amm,size) {
	blamm = amm * rab(0.8,1.2) / (cr.type==ROOMS.CHALLENGE?4:1);
	for(var bl=0;bl<blamm;bl++) {
		ns = size * rab(0.5,1.5);
		this.blood.push({
			a : rab(0,2*Math.PI),
			spd : rab(0.04,0.35) * amm,
			x : x,
			y : y,
			s : ns,
			os : ns,
			alpha : rab(0.7,0.85),
			cutoffalpha : rab(0.25,0.6)
		});
	}
}, enumerable : false});
Object.defineProperty(Object.prototype, "smokeUp", { value: function(x,y,r,clr) {
	for(_t=0;_t<4;_t++) {
		ccolor = '255,255,255';
		if (clr) {
			if ($.isArray(clr)) {
				ccolor = clr[Math.floor(Math.random()*clr.length)];
			} else {
				ccolor = clr;
			}
		}
		this.smoke.push({
			color : ccolor,
			r : r * 0,
			maxr : r*1.8,
			x : x+rab(-r/6<-15?-15:-r/6,r/6>15?15:r/6),
			y : y+rab(-r/6<-15?-15:-r/6,r/6>15?15:r/6),
			a : rab(0.8,1.1)
		});
	}
}, enumerable : false});

var portloc = [[100,200],[500,200],[300,100],[300,300]];
Object.defineProperty(Object.prototype, "generatePortal", { value: function(g) {
	this.portal = 1;
	while (true) {
		rport = portloc[Math.floor(Math.random()*4)];
		if (DBP(rport[0],rport[1],B.x,B.y) < 90) {
			continue;
		}
		this.portx = rport[0];
		this.porty = rport[1];
		this.portr = 0;
		break;
	}
}, enumerable : false});

// STEP ROOM
Object.defineProperty(Object.prototype, "stepRoom", { value: function() {
	if (B.dead) return;
	if (this.type == ROOMS.CHALLENGE) {
		if (!isNaN(this.chalstarttimer) && this.chalstarttimer > 0) {
			this.chalstarttimer -= 25;
			if (this.chalstarttimer <= 0) {
				this.chalstarttimer = 0;
				this.spawnPattern();
				cr.chaltimer = 3000+Math.round(((B.diff>25)?25:B.diff)*230);
				cr.chaltimer = Math.floor(cr.chaltimer / 1000) * 1000;
			}
		}
		if (this.chalstarttimer === 0 && this.chaltimer == 0 && this.m.length == 0) {
			this.chaldone = true;
		}
	}
	if (this.type == ROOMS.CHALLENGE && this.chaltimer > 0 && this.chalstarttimer === 0) {
		if (this.m.length == 0 && this.chaltimer % 1000 > 25) {
			this.chaltimer -= this.chaltimer%1000 - 25;
		}
		this.chaltimer -= 2.5;
		if (this.chaltimer % 1000 == 0) {
			this.spawnPattern();
		}
	} else {
		this.chaltimer = 0;
	}
	while(true) {
		// boss / chal
		if (!this.complete) {
			if (this.type == ROOMS.CHALLENGE && !this.chaldone) {
				if (!isNaN(this.chalstarttimer)) {
					if (!this.chaldone || this.chaltimer > 0) {
						break;
					}
				}
			}
			if (this.m.length == 0) {
				this.complete = true;
				for(var j=0;j<3;j++) {
					if (B.items[j]) {
						if (B.items[j].bars > 0) {
							B.items[j].bars--;
						}
					}
				}
				if (this.type == ROOMS.CHALLENGE && this.chaldone) {
					this.spawnCoins(rab(5,7));
				}
				if (this.type == ROOMS.BOSS) {
					B.bosskilled = true;
					this.generatePortal();
				}
			}
		}
		break;
	}
	if (this.type == ROOMS.COMPLETE) {
		if (this.lockrocks) {
			unlock = true;
			for(var i=0;i<m.length;i++) {
				for(var j=0;j<m[i].length;j++) {
					if (m[i][j]) {
						if (m[i][j].type == ROOMS.CHALLENGE && !m[i][j].chaldone) {
							unlock = false;
							break;
						}
						if (!m[i][j].complete && m[i][j].type != ROOMS.SECRET) {
							unlock = false;
							break;
						}
					}
				}
				if (!unlock) break;
			}
			if (unlock) {
				this.lockrocks = false;
				this.lockrock = [];
			}
		}
	}
}, enumerable : false});
Object.defineProperty(Object.prototype, "spawnCoins", { value: function(numcoins) {
	var coinn = 0;
	while (coinn < numcoins) {
		ncx = Math.random()*550+25;
		ncy = Math.random()*350+25;
		hr = 10;
		hrtx = ncx - hr;
		hrty = ncy - hr;
		coll = false;
		for(var j=0;j<this.rock.length;j++) {
			if (col(this.rock[j].x,this.rock[j].y,this.rock[j].w,this.rock[j].h,hrtx,hrty,hr*2,hr*2)) {
				coll = true;
				break;
			}
		}
		if (!coll) {
			this.coin.push({
				x : ncx,
				y : ncy,
				s : 0,
				stat : 'expand'
			});
			coinn++;
		}
	}
}, enumerable : false});
Object.defineProperty(Object.prototype, "loadAdj", { value: function(numcoins) {
	this.adj = [false,false,false,false];
	for(var _i=0;_i<adjroompos.length;_i++) {
		rpos = adjroompos[_i];
		nx = rx + rpos[0];
		ny = ry + rpos[1];
		if (nx < 0 || ny < 0 || nx >= mw || ny >= mh) {continue;}
		if (m[nx][ny]) {
			this.adj[_i] = true;
		}
	}
}, enumerable : false});
Object.defineProperty(Object.prototype, "initRoom", { value: function() {
	if (this.init == null || this.init == undefined) return;
	if (this.init == false) {
		this.patches = [];
		for(var i=0;i<50;i++) {
			w = Math.random()*5+5;
			h = Math.random()*5+5;
			this.patches.push({
				x : Math.random()*(600-w),
				y : Math.random()*(400-h),
				w : w,
				h : h,
				clr : Math.round(Math.random()*10+130)
			});
		}
		rx = this.x;
		ry = this.y;
		this.visited = false;
		this.complete = false;
		this.blood = [];
			this.bloodsplat = [];
			this.bloodspatter = [];
		this.powerup = [];
		this.shopitem = [];
		this.smoke = [];
		this.heart = [];
		this.coin = [];
		this.bullets = [];
			this.proj = [];
			this.bulletsplash = [];
		this.portal = 0;
			this.portx = 0;
			this.porty = 0;
			this.portr = 0;
		this.loadAdj();
		this.m = [];
		this.rock = [];
			this.lockrocks = false;
			this.lockrock = [];
		switch(this.type) {
			case ROOMS.SECRET:
				this.spawnNormalRoom();
				this.spawnCoins(rab(6,9));
				this.spawnPattern();
				this.spawnPattern();
			break;
			case ROOMS.STARTING:
				this.complete = true;
			break;
			case ROOMS.BOSS:
				this.spawnBossRoom();
				if (chalon == "duo") this.spawnBossRoom();
			break;
			case ROOMS.SHOP:
				this.complete = true;
				this.powerup.push({
					it : randomItem(),
					x : 280,
					y : 100,
					m : true,
					a : rab(0,2*Math.PI)
				});
				this.heart.push({
					x : 400,
					y : 120,
					t : 1,
					s : 0,
					m : true,
					stat : 'expand'
				});
				this.heart.push({
					x : 200,
					y : 120,
					t : 5,
					s : 0,
					m : true,
					stat : 'expand'
				});
				shoptypes = ["attack","speed","firing","shotspeed"];
				this.shopitem.push({
					t : "hp",
					x : 300,
					y : 260
				});
				stp = Math.floor(Math.random()*shoptypes.length);
				newstp = shoptypes[stp];
				shoptypes.splice(stp,1);
				this.shopitem.push({
					t : newstp,
					x : 400,
					y : 260
				});
				stp = Math.floor(Math.random()*shoptypes.length);
				newstp = shoptypes[stp];
				shoptypes.splice(stp,1);
				this.shopitem.push({
					t : newstp,
					x : 200,
					y : 260
				});
			break;
			case ROOMS.HEALTH:
				this.complete = true;
				mhp = Math.floor(B.maxhp / 2) + 5;
				for(var __i=0;__i<Math.floor(mhp/5);__i++) {
					this.heart.push({
						x : Math.random()*400+100,
						y : Math.random()*200+100,
						t : 5,
						s : 0,
						stat : 'expand'
					});
				}
				for(var __i=0;__i<mhp%5;__i++) {
					this.heart.push({
						x : Math.random()*400+100,
						y : Math.random()*200+100,
						t : 1,
						s : 0,
						stat : 'expand'
					});
				}
			break;
			case ROOMS.POWERUP:
				this.complete = true;
				this.powerup.push({
					it : randomItem(),
					x : 280,
					y : 180,
					m : false,
					a : rab(0,2*Math.PI)
				});
				this.smokeUp(300,200,30);
				switch (Math.floor(Math.random()*2)) {
					case 0:
						this.rock.push({x:10,y:10,w:50,h:50});
						this.rock.push({x:540,y:10,w:50,h:50});
						this.rock.push({x:10,y:340,w:50,h:50});
						this.rock.push({x:540,y:340,w:50,h:50});
					break;
					case 1:
						this.rock.push({x:100,y:175,w:50,h:50});
						this.rock.push({x:450,y:175,w:50,h:50});
					break;
				}
			break;
			case ROOMS.COMPLETE:
				this.powerup.push({
					it : randomItem(),
					x : 280,
					y : 180,
					m : false,
					a : rab(0,2*Math.PI)
				});
				this.smokeUp(300,200,30);
				numhearts = rab(4,6);
				for(var __i=0;__i<numhearts;__i++) {
					this.heart.push({
						x : Math.random()*320+140,
						y : Math.random()*120+140,
						t : 1,
						s : 0,
						stat : 'expand'
					});
				}
				numcoins = rab(6,9);
				for(var __i=0;__i<numcoins;__i++) {
					this.coin.push({
						x : Math.random()*320+140,
						y : Math.random()*120+140,
						s : 0,
						stat : 'expand'
					});
				}
				this.lockrocks = true;
				for(var i=50;i<550;i+=50) {
					for(var j=50;j<350;j+=50) {
						if (i == 50 || j == 50 || i == 500 || j == 300) {
							this.lockrock.push({
								x : i, y : j, w : 50, h : 50
							});
						}
					}
				}
			break;
			case ROOMS.NORMAL:
				if (testlast == 2) {
					this.spawnBossRoom();
					break;
				}
				if (chalon == "biggame") {
					B.roomcount++;
					if (B.roomcount >= 5) {
						B.roomcount = 0;
						this.spawnBossRoom();
						break;
					}
				}
				this.spawnNormalRoom();
				this.spawnPattern();
			break;
			case ROOMS.CHALLENGE:
				this.spawnNormalRoom();
				this.chaldone = false;
				this.chalspawned = false;
				curnum = 0;
				while (true) {
					ncx = 300 + rab(-curnum,curnum);
					ncy = (300 + rab(-curnum,curnum))*2/3;
					hr = 10;
					hrtx = ncx - hr;
					hrty = ncy - hr;
					coll = false;
					for(var j=0;j<this.rock.length;j++) {
						if (col(this.rock[j].x,this.rock[j].y,this.rock[j].w,this.rock[j].h,hrtx,hrty,hr*2,hr*2)) {
							coll = true;
							break;
						}
					}
					if (!coll) {
						this.coin.push({
							x : ncx,
							y : ncy,
							s : 0,
							stat : 'expand'
						});
						break;
					}
					curnum++;
				}
			break;
			default:
				this.complete = true;
		}
		this.init = true;
	}
}, enumerable : false});

Object.defineProperty(Object.prototype, "createSplash", { value: function(x,y,size) {
	for(var i=0;i<size/2;i++) {
		this.bulletsplash.push({
			x : x,
			y : y,
			a : rab(0,2*Math.PI),
			spd : rab(0.5,0.7) * size,
			s : rab(2,3),
			alpha : 1
		});
	}
}, enumerable : false});

Object.defineProperty(Object.prototype, "spawnPattern", { value: function() {
	if (skiproom) return;
	var mspawn;
	ls = getBounds();
	while(true) {
		mspawn = this.rp.ms[Math.floor(Math.random()*this.rp.ms.length)];
		if (mspawn >= ls[0] && mspawn <= ls[1]) break;
	}
	sp = SpawnPatterns[mspawn];
	for(var i=0;i<sp.length;i++) {
		monstype = sp[i][0];
		for(var j=1;j<sp[i].length;j+=2) {
			this.m.push(Monster[monstype](sp[i][j],sp[i][j+1]));
			this.smokeUp(sp[i][j],sp[i][j+1],20);
		}
	}
}, enumerable : false});
Object.defineProperty(Object.prototype, "spawnNormalRoom", { value: function() {if (skiproom) return;
	difarr = DifSpawns[B.floor];
	rpspawn = difarr[Math.floor(Math.random()*difarr.length)];
	this.rp = RoomPatterns[rpspawn];
	if (testlast) this.rp = RoomPatterns[difarr[difarr.length-1]];
	for(var i=0;i<this.rp.obj.length;i++) {
		oj = this.rp.obj[i];
		for(var j=1;j<oj.length;j+=0) {
			if (oj[0] == "rock") {
				this.rock.push({
					x : oj[j],
					y : oj[j+1],
					w : oj[j+2],
					h : oj[j+3]
				});
				j+=4;
			}
			
		}
	}
}, enumerable : false});

function getBoss(name) {
	for(var i=0;i<bosses.length;i++) if (bosses[i].name == name) return bosses[i];
}
function getRange0(name) {
	return getBoss(name).range[0];
}
bosses = [
	{
		name : "buzzer",
		create : function(cr) {
			cr.m.push(Monster[this.name](300,200));
		},
		range : [-5, 20]
	}, {
		name : "asteroid",
		create : function(cr) {
			cr.m.push(Monster[this.name](300,200,[160,1]));
		},
		range : [-5, 25]
	}, {
		name : "gemini",
		create : function(cr) {
			cr.m.push(Monster[this.name](300,200));
		},
		range : [-5, 30]
	}, {
		name : "spinout",
		create : function(cr) {
			cr.m.push(Monster[this.name](300,200));
		},
		range : [10, 30]
	}, {
		name : "buzzkill",
		create : function(cr) {
			cr.m.push(Monster[this.name](300,200));
		},
		range : [15, 35]
	}
];
bosses[bosses.length-2].range[1] = 9999;
bosses[bosses.length-1].range[1] = 9999;
lastboss = -1;
Object.defineProperty(Object.prototype, "spawnBossRoom", { value: function() {
	
	bspawnn = -1;
	iters = 0;
	while(iters++ < 1000) {
		bspawnn = Math.floor(Math.random()*bosses.length);
		if (B.diff < bosses[bspawnn].range[0] || B.diff > bosses[bspawnn].range[1]) continue;
		if (bspawnn != lastboss) break;
	}
	//bspawnn = 4;
	bspawn = bosses[bspawnn];
	lastboss = bspawnn;
	
	bspawn.create(this);
	//this.m.push(Monster[bspawn.name](300,200,bspawn.args));
	showtext = 5000;
	texttoshow = this.m[this.m.length-1].name;
	
	
	if (c.g("achFall of the Titans")) {
		for(var i=0;i<this.m.length;i++) {
			this.m[i].hp *= (1-0.07);
		}
	}
	if (c.g("achBig Game Trophy")) {
		for(var i=0;i<this.m.length;i++) {
			this.m[i].hp *= (1-0.08);
		}
	}
	
}, enumerable : false});







