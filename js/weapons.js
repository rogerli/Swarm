var bullets = [];
var bulletsplash = [];
var rockets = [];
function createSplash(x,y,size,clr) {
	for(var i=0;i<size/2;i++) {
		bulletsplash.push({
			color : clr?clr:"rgb(255,255,255)",
			x : x,
			y : y,
			a : rab(0,2*Math.PI),
			spd : rab(0.5,0.7) * size,
			s : rab(2,3),
			alpha : 1
		});
	}
}
function createBullet(x,y,vx,vy,dmg,size,color) {
	clr = color?color:"rgb(255,255,255)";
	if (Settings.melterb) clr = "rgb(200,200,0)";
	if (Settings.pierceb) clr = "rgb(200,0,0)";
	if (Settings.seekerb) clr = "rgb(200,0,200)";
	var dmgfactor = 1;
	if (chalon == "stun") {
		if (Math.random() < 0.1) dmgfactor *= 0.5;
	}
	bullets.push({
		x : x,
		y : y,
		vx : vx,
		vy : vy,
		dmg : dmg * dmgfactor,
		s : size,
		color : clr,
		hit : [],
		type : false,
		frames : 0
	});
}

function createRocket(x,y,angle,startspeed,acc,dmg,t) {
	rockets.push({
		x : x,
		y : y,
		a : angle,
		v : startspeed,
		acc : acc,
		d : dmg,
		t : isNaN(t)?0:t
	});
}

function getBlastR(dmg) {
	return (Math.pow(1.148698355, dmg/30) * 70 + 160) * 0.27778;
}
Object.defineProperty(Object.prototype, "explode", { value: function(x,y,dmg,t) {
	var hurtenemy = (t!=1), // 0, 2
		hurtself = (t!=0) // 1, 2
	this.smokeUp(x,y,(dmg+50)*30/80*0.8,['180,185,0','185,90,50','155,0,0']);
	blastr = getBlastR(dmg);
	if (hurtenemy) {
		blastspeed = 5*(dmg+100)/140;
		for(var i_=0;i_<this.m.length;i_++) {
			a = this.m[i_];
			mcx = a.x + a.w/2;
			mcy = a.y + a.h/2
			d = DBP(mcx,mcy,x,y) - (a.w+a.h)/2;
			if (d < 0) d = 0;
			if (d > blastr) continue;
			a.hit(dmg * (blastr-d)/blastr);
			ang = getAngle(mcx-x,mcy-y);
			if (!isNaN(a.vx) && !isNaN(a.vy)) {
				a.vx += 100 * a.knockback * Math.cos(ang)*blastspeed;
				a.vy += 100 * a.knockback * Math.sin(ang)*blastspeed;
			}
		}
	}
	if (hurtself) {
		blastspeed = 10*(dmg+100)/140;
		d = DBP(B.x,B.y,x,y) - B.r;
		if (d < 0) d = 0;
		if (d > blastr) return;
		B.hit(dmg * (blastr-d)/blastr);
		ang = getAngle(B.x-x,B.y-y);
		B.vx += Math.cos(ang)*blastspeed;
		B.vy += Math.sin(ang)*blastspeed;
	}
}, enumerable : false});


var bdir = [[-1,0],[0,-1],[1,0],[0,1]];
var Weapon = {
	shot : function() {
		return {
			type : "shot",
			t : 0,
			draw : function(g) {},
			step : function() {
				this.t -= 25;
				if (this.t <= 0 && !roomtrans) {
					for(var keyind=0;keyind<ak.length;keyind++) {
						if (ak[keyind]) {
							MultiPlay("shoot");
							this.t = 5000 / B.firing;
							size = (B.attack+40)/5;
							if (size > B.r*2) size = B.r*2;
							da = bdir[keyind];
							speed = B.shotspeed;
							vx = da[0] * speed;
							vy = da[1] * speed;
							createBullet(B.x-size/2,B.y-size/2,vx,vy,B.attack,size);
							size = Math.ceil(size / 5);
							for(var j=1;j<=B.bugs;j++) {
								bb = B.barr[j];
								createBullet(bb.x+5-size/2,bb.y+5-size/2,vx,vy,B.attack / 5,size);
							}
							break;
						}
					}
				}
			}
		};
	},
	flamethrower : function() {
		B.changeBugs(0);
		return {
			type : "flamethrower",
			t : 0,
			a : 0,
			rot_speed : Math.PI/20,
			draw : function(g,x,y) {
				g.strokeStyle("rgb(255,0,0)");
				g.translate(x,y);
					g.lineWidth(5);
					g.beginPath();
					g.moveTo(0,0);
					g.lineTo(20*Math.cos(this.a),20*Math.sin(this.a));
					g.stroke();
					g.lineWidth(1);
				g.translate(-x,-y);
			},
			step : function() {
				B.knockback = 0;
				if (B.bugs > 0) B.changeBugs(0);
				B.r = 14;
				this.t -= 25;
				if (ak[0]) {
					this.a -= this.rot_speed;
				} else if (ak[2]) {
					this.a += this.rot_speed;
				}
				if ((ak[1]||ak[3]) && this.t <= 0 && !roomtrans) {
					MultiPlay("shoot");
					this.t = 5000 / (B.firing+10) / 6;
					att = B.attack / 2.5 * 2;
					size = (att+50)/2;
					if (size > B.r*2) size = B.r*2;
					speed = B.shotspeed+10;
					for(var i=-2;i<3;i++) {
						ang = this.a + Math.PI/30 * i + rab(-Math.PI/10,Math.PI/10);
						vx = Math.cos(ang) * speed;
						vy = Math.sin(ang) * speed;
						ther = Math.floor(Math.random()*3);
						clr = (ther==0?"rgba(255,0,0":(ther==1?"rgba(255,150,0":"rgba(255,255,0"))+",0.6)";
						createBullet(B.x-size/2,B.y-size/2,vx,vy,att/8,size,clr);
						bullets[bullets.length-1].type = "dissipate";
						bullets[bullets.length-1].left = 5;
						bullets[bullets.length-1].nosplash = true;
					}
				}
			}
		};
	},
	turret : function() {
		B.changeBugs(0);
		return {
			type : "turret",
			t : 0,
			a : 0,
			rot_speed : Math.PI/33,
			draw : function(g,x,y) {
				g.translate(x,y);
					g.lineWidth(5);
					g.beginPath();
					g.moveTo(0,0);
					g.lineTo(20*Math.cos(this.a),20*Math.sin(this.a));
					g.stroke();
					g.lineWidth(1);
				g.translate(-x,-y);
			},
			step : function() {
				if (B.bugs > 0) B.changeBugs(0);
				B.r = 13;
				this.t -= 25;
				if (ak[0]) {
					this.a -= this.rot_speed;
				} else if (ak[2]) {
					this.a += this.rot_speed;
				}
				if ((ak[1]||ak[3]) && this.t <= 0 && !roomtrans) {
					MultiPlay("shoot");
					this.t = 5000 / B.firing / 3;
					size = (B.attack+50)/6;
					if (size > B.r*2) size = B.r*2;
					speed = B.shotspeed;
					vx = Math.cos(this.a) * speed;
					vy = Math.sin(this.a) * speed;
					createBullet(B.x-size/2,B.y-size/2,vx,vy,B.attack,size);
				}
			}
		};
	},
	laser : function() {
		B.changeBugs(0);
		return {
			type : "laser",
			t : 0,
			lasershow : 0,
			laserd : 0,
			dist : 0,
			draw : function(g,x,y) {
				g.translate(x,y);
					g.fillStyle('rgba(150,150,150,0.7)');
					g.beginPath();
						g.arc(0,0,10,0,2*Math.PI);
					g.fill();
					g.fillStyle('rgb(255,0,0)');
					g.beginPath();
						g.arc(0,0,3,0,2*Math.PI);
					g.fill();
					if (this.lasershow>0) {
						this.lasershow--;
						g.strokeStyle("rgb(255,0,0)");
						if (Settings.pierceb) {g.strokeStyle("rgb(155,0,0)");}
						if (Settings.ghostb) g.globalAlpha(0.3);
						g.lineWidth(2);
							da = bdir[this.laserd];
							g.beginPath();
								g.moveTo(0,0);
								g.lineTo(da[0]*this.dist,da[1]*this.dist);
								g.stroke();
						g.lineWidth(1);
						g.globalAlpha(1);
					}
				g.translate(-x,-y);
			},
			step : function() {
				if (B.bugs > 0) B.changeBugs(0);
				B.r = 15;
				this.t -= 25;
				if (this.t <= 0 && !roomtrans) {
					for(var keyind=0;keyind<ak.length;keyind++) {
						if (ak[keyind]) {
							MultiPlay("laser");
							this.t = 5000 / B.firing;
							da = bdir[keyind];
							res = testLaser(B.x,B.y,keyind,true,Settings.pierceb);
							this.dist = res[0];
							this.laserd = keyind;
							this.lasershow = 2;
							if (Settings.pierceb) {
								for(var i=0;i<res[1].length;i++) {
									cr.m[res[1][i]].hit(B.attack*2);
									cr.m[res[1][i]].hitTime = 500;
								}
							} else {
								if (res[1][0] > -1) {
									cr.m[res[1][0]].hit(B.attack*2);
									cr.m[res[1][0]].hitTime = 500;
								}
							}
							break;
						}
					}
				}
			}
		};
	},
	rocketlauncher : function() {
		B.changeBugs(0);
		B.setShotSpeed(B.nshotspeed+10);
		return {
			type : "rocketlauncher",
			t : 0,
			ld : 0,
			draw : function(g,x,y) {
				//g.translate(x,y);
					
				//g.translate(-x,-y);
			},
			step : function() {
				this.t -= 25;
				if (this.t <= 0 && !roomtrans) {
					for(var keyind=0;keyind<ak.length;keyind++) {
						if (ak[keyind]) {
							keyind += 2;
							if (keyind > 3) keyind -= 4;
							this.t = 5000 / B.firing * 1.5;
							this.ld = keyind;
							createRocket(B.x,B.y,keyind*Math.PI/2,B.shotspeed/5,B.shotspeed/48,B.attack*2);
							break;
						}
					}
				}
			}
		};
	}
	
	
	
};

function testLaser(x,y,dir,monst,pierce) {
	cdist = Number.POSITIVE_INFINITY;
	numtoreturn = [-1];
	if (pierce) numtoreturn = [];
	var lobj = [];
	if (!Settings.ghostb) {
		for(var i=0;i<cr.rock.length;i++) {
			lobj.push({t:0,x:cr.rock[i].x,y:cr.rock[i].y,w:cr.rock[i].w,h:cr.rock[i].h});
		}
		for(var i=0;i<cr.lockrock.length;i++) {
			lobj.push({t:0,x:cr.lockrock[i].x,y:cr.lockrock[i].y,w:cr.lockrock[i].w,h:cr.lockrock[i].h});
		}
	}
	if (monst) {
		for(var i=0;i<cr.m.length;i++) {
			lobj.push({t:1,n:i,x:cr.m[i].x,y:cr.m[i].y,w:cr.m[i].w,h:cr.m[i].h});
		}
	}
	switch(dir) {
		case 0:
			cdist = x;
			for(var i=0;i<lobj.length;i++) {
				if (lobj[i].x > x) continue;
				if (lobj[i].t == 1 && pierce) continue;
				if (col(lobj[i].x,lobj[i].y,lobj[i].w,lobj[i].h,x-cdist,y-2,cdist,4)) {
					newdist = x - (lobj[i].x + lobj[i].w*(lobj[i].t==1?3/4:1));
					if (newdist < cdist) {
						cdist = newdist;
						if (lobj[i].t == 1) {
							numtoreturn[0] = lobj[i].n;
						}
					}
				}
			}
			if (pierce) {
				for(var i=0;i<lobj.length;i++) {
					if (lobj[i].x > x) continue;
					if (lobj[i].t != 1) continue;
					if (col(lobj[i].x,lobj[i].y,lobj[i].w,lobj[i].h,x-cdist,y-2,cdist,4)) {
						newdist = x - (lobj[i].x + lobj[i].w*(lobj[i].t==1?3/4:1));
						if (newdist < cdist) {
							numtoreturn.push(lobj[i].n);
						}
					}
				}
			}
		break;
		case 1:
			cdist = y;
			for(var i=0;i<lobj.length;i++) {
				if (lobj[i].y > y) continue;
				if (lobj[i].t == 1 && pierce) continue;
				if (col(lobj[i].x,lobj[i].y,lobj[i].w,lobj[i].h,x-2,y-cdist,4,cdist)) {
					newdist = y - (lobj[i].y + lobj[i].h*(lobj[i].t==1?3/4:1));
					if (newdist < cdist) {
						cdist = newdist;
						if (lobj[i].t == 1) {
							numtoreturn[0] = lobj[i].n;
						}
					}
				}
			}
			if (pierce) {
				for(var i=0;i<lobj.length;i++) {
					if (lobj[i].y > y) continue;
					if (lobj[i].t != 1) continue;
					if (col(lobj[i].x,lobj[i].y,lobj[i].w,lobj[i].h,x-2,y-cdist,4,cdist)) {
						newdist = y - (lobj[i].y + lobj[i].h*(lobj[i].t==1?3/4:1));
						if (newdist < cdist) {
							numtoreturn.push(lobj[i].n);
						}
					}
				}
			}
		break;
		case 2:
			cdist = 600 - x;
			for(var i=0;i<lobj.length;i++) {
				if (lobj[i].x+lobj[i].w < x) continue;
				if (lobj[i].t == 1 && pierce) continue;
				if (col(lobj[i].x,lobj[i].y,lobj[i].w,lobj[i].h,x,y-2,cdist,4)) {
					newdist = (lobj[i].x + lobj[i].w*(lobj[i].t==1?1/4:0)) - x;
					if (newdist < cdist) {
						cdist = newdist;
						if (lobj[i].t == 1) {
							numtoreturn[0] = lobj[i].n;
						}
					}
				}
			}
			if (pierce) {
				for(var i=0;i<lobj.length;i++) {
					if (lobj[i].x+lobj[i].w < x) continue;
					if (lobj[i].t != 1) continue;
					if (col(lobj[i].x,lobj[i].y,lobj[i].w,lobj[i].h,x,y-2,cdist,4)) {
						newdist = (lobj[i].x + lobj[i].w*(lobj[i].t==1?1/4:0)) - x;
						if (newdist < cdist) {
							numtoreturn.push(lobj[i].n);
						}
					}
				}
			}
		break;
		case 3:
			cdist = 400 - y;
			for(var i=0;i<lobj.length;i++) {
				if (lobj[i].y+lobj[i].h < y) continue;
				if (lobj[i].t == 1 && pierce) continue;
				if (col(lobj[i].x,lobj[i].y,lobj[i].w,lobj[i].h,x-2,y,4,cdist)) {
					newdist = (lobj[i].y + lobj[i].h*(lobj[i].t==1?1/4:0)) - y;
					if (newdist < cdist) {
						cdist = newdist;
						if (lobj[i].t == 1) {
							numtoreturn[0] = lobj[i].n;
						}
					}
				}
			}
			if (pierce) {
				for(var i=0;i<lobj.length;i++) {
					if (lobj[i].y+lobj[i].h < y) continue;
					if (lobj[i].t != 1) continue;
					if (col(lobj[i].x,lobj[i].y,lobj[i].w,lobj[i].h,x-2,y,4,cdist)) {
						newdist = (lobj[i].y + lobj[i].h*(lobj[i].t==1?1/4:0)) - y;
						if (newdist < cdist) {
							numtoreturn.push(lobj[i].n);
						}
					}
				}
			}
		break;
	}
	return [cdist,numtoreturn];
}





