var mmove = [[1,0],[0,1],[-1,0],[0,-1]];

var Monster = {
	fly : function(x,y) {
		d = B.diff;
		return { w : 30, h : 10, knockback : 1/60, hitTime : 0,
			x : x - 15,
			y : y - 5,
			vx : 0,
			vy : 0,
			dmg : 3 + d*0.3,
			hp : 20 + d * 3,
			speed : 0.4 + 0.015*(d>25?25:d),
			cstep : 0,
			dsource : 0,
			cstate : -1,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,12,7);
			},
			step : function() {
				ang = getAngle(B.x-this.x-this.w/2,B.y-this.y-this.h/2) + Math.PI/180*rab(-90,90);
				this.vx += Math.cos(ang)*this.speed*rab(0.5,1);
				this.vy += Math.sin(ang)*this.speed*rab(0.5,1);
				this.vx *= 0.9;
				this.vy *= 0.9;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (!B.dead) this.cstep = this.cstep>=4?0:this.cstep+0.5;
				if (Math.random()<0.8) this.cstate = this.cstate==-1?0.1:(this.cstate==0.1?1:(this.cstate==1?0:-1));
				g.translate(this.x,this.y);
					g.translate(this.w/2,this.h/2);
					g.fillStyle("rgba(255,255,255,0.5)");
						ang = this.cstate*Math.PI/8;
						g.translate(Math.cos(ang)*this.w/4,Math.sin(ang)*this.w/4);
							g.rotate(ang);
							g.beginPath();
								g.ellipse(0,0,this.w/4,this.h/6);
							g.fill();
							g.rotate(-ang);
						g.translate(-Math.cos(ang)*this.w/4,-Math.sin(ang)*this.w/4);
						ang = Math.PI - ang;
						g.translate(Math.cos(ang)*this.w/4,Math.sin(ang)*this.w/4);
							g.rotate(ang);
							g.beginPath();
								g.ellipse(0,0,this.w/4,this.h/6);
							g.fill();
							g.rotate(-ang);
						g.translate(-Math.cos(ang)*this.w/4,-Math.sin(ang)*this.w/4);
					g.translate(-this.w/2,-this.h/2);
						 if (this.cstep<1) g.fillStyle("rgb(0,0,0)");
					else if (this.cstep<2) g.fillStyle("rgb(100,100,100)");
					else if (this.cstep<3) g.fillStyle("rgb(70,0,0)");
					else if (this.cstep<4) g.fillStyle("rgb(150,0,0)");
					g.strokeStyle("rgb(0,0,0)");
					g.beginPath();
						g.arc(this.w/2,this.h/2,this.h*2/5,0,2*Math.PI);
						g.fill();
						g.stroke();
				g.translate(-this.x,-this.y);
			}
		};
	},
	megafly : function(x,y) {
		d = B.diff;
		fl = Monster.fly(x-5,y-2);
		fl.w = 40;
		fl.h = 14;
		fl.knockback = 1/90;
		fl.speed *= 1.3;
		fl.hp *= 1.6;
		fl.dmg *= 1.5;
		fl.kill = function() {
			cr.splashBlood(this.x+this.w/2,this.y+this.h/2,18,12);
			fl1 = Monster.fly(this.x+20,this.y+7);
			fl1.vx = rab(7,9);
			fl1.vy = rab(-9,9);
			fl2 = Monster.fly(this.x+20,this.y+7);
			fl2.vx = -fl1.vx;
			fl2.vy = -fl1.vy;
			cr.m.push(fl1);
			cr.m.push(fl2);
		}
		return fl;
	},
	spider : function(x,y) {
		d = B.diff;
		return { w : 20, h : 20, knockback : 1/40, hitTime : 0,
			x : x - 10,
			y : y - 10,
			vx : 0,
			vy : 0,
			dmg : 3 + d*0.3,
			hp : 20 + d * 3,
			speed : 0.8 + (d>20?20:d) * 0.02,
			cstep : 0,
			dsource : 0,
			status : 0,
			timer : 700,
			otimer : 1000-(d>20?20:d)*40,
			angle : 0,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,12,7);
			},
			step : function() {
				this.timer -= 25;
				if (this.status == 0) {
					if (this.timer <= 0) {
						if (DBP(this.x,this.y,B.x,B.y) < 230) {
							this.angle = getAngle(B.x-this.x,B.y-this.y);
							this.timer = DBP(this.x,this.y,B.x,B.y) / 300 * 1100;
						} else {
							this.angle = getAngle(Math.random()*600-this.x,Math.random()*400-this.y);
							this.timer = 800;
						}
						this.status = 1;
					}
				} else if (this.status == 1) {
					if (this.timer > 0) {
						this.vx += Math.cos(this.angle) * this.speed;
						this.vy += Math.sin(this.angle) * this.speed;
					} else {
						this.status = 0;
						this.timer = this.otimer;
					}
				}
				this.vx *= 0.9;
				this.vy *= 0.9;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*2;
					B.vy += this.vy*2;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (!B.dead) this.cstep = this.cstep>=4?0:this.cstep+0.5;
				g.translate(this.x,this.y);
					g.lineWidth(1);
					g.strokeStyle("rgb(0,0,0)");
						g.beginPath();
							g.moveTo(this.w/2,this.h/2);
							g.lineTo(this.w*14/20,this.h*6/20);
							g.lineTo(this.w*15/20,0);
							g.moveTo(this.w/2,this.h/2);
							g.lineTo(this.w*6/20,this.h*6/20);
							g.lineTo(this.w*5/20,0);
							g.moveTo(this.w/2,this.h/2);
							g.lineTo(this.w*17/20,this.h*8/20);
							g.lineTo(this.w,this.h*4/20);
							g.moveTo(this.w/2,this.h/2);
							g.lineTo(this.w*3/20,this.h*8/20);
							g.lineTo(0,this.h*4/20);
							g.moveTo(this.w/2,this.h/2);
							g.lineTo(this.w*14/20,this.h*14/20);
							g.lineTo(this.w*15/20,this.h);
							g.moveTo(this.w/2,this.h/2);
							g.lineTo(this.w*6/20,this.h*14/20);
							g.lineTo(this.w*5/20,this.h);
							g.moveTo(this.w/2,this.h/2);
							g.lineTo(this.w*17/20,this.h*12/20);
							g.lineTo(this.w,this.h*13/20);
							g.moveTo(this.w/2,this.h/2);
							g.lineTo(this.w*3/20,this.h*12/20);
							g.lineTo(0,this.h*13/20);
						g.stroke();
					g.lineWidth(1);
						 if (this.cstep<1) g.fillStyle("rgb(0,0,0)");
					else if (this.cstep<2) g.fillStyle("rgb(100,100,100)");
					else if (this.cstep<3) g.fillStyle("rgb(70,0,0)");
					else if (this.cstep<4) g.fillStyle("rgb(150,0,0)");
					g.strokeStyle("rgb(0,0,0)");
					g.beginPath();
						g.arc(this.w/2,this.h/2,this.h*1/4,0,2*Math.PI);
						g.fill();
						g.stroke();
				g.translate(-this.x,-this.y);
			}
		}
	},
	beetle : function(x,y) {
		d = B.diff;
		rdir = Math.floor(Math.random()*4);
		return { w : 40, h : 40, knockback : 1/40, hitTime : 0,
			x : x - 20,
			y : y - 20,
			vx : 0,
			vy : 0,
			angle : rdir * Math.PI / 2 + Math.PI,
			astep : 0,
			dir : rdir,
			dturn : 0,
			dmg : 3 + d*0.3,
			hp : 45 + d * 4,
			speed : 0.8 + (d>25?25:d) * 0.024,
			dsource : 0,
			status : 'wait',
			timer : 1000,
			otimer : 1000-(d>20?20:d)*40,
			ton : 0,
			tonspeed : 10 + (d>25?25:d)*0.4,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,12,7);
			},
			step : function() {
				this.vx *= 0.8;
				this.vy *= 0.8;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				cx = this.x + this.w/2;
				cy = this.y + this.h/2;
				this.timer -= 25;
				if (this.status != 'stickout') {
					if (this.angle < 0) this.angle += 2*Math.PI;
					if (this.angle >= 2*Math.PI) this.angle -= 2*Math.PI;
				}
				if (this.status == 'wait') {
					if (col(0,B.y-B.r,600,B.r*2,0,cy-5,600,10) ||
						col(B.x-B.r,0,B.r*2,400,cx-5,0,10,400)) {
						this.goalangle = getAngle(B.x-this.x-this.w/2,B.y-this.y-this.h/2);
						this.goalangle = Math.round(this.goalangle/(Math.PI/2))*Math.PI/2;
						if (this.goalangle - this.angle > Math.PI) {
							this.goalangle -= 2*Math.PI;
						} else if (this.angle - this.goalangle > Math.PI) {
							this.goalangle += 2*Math.PI;
						}
						this.status = 'stickout';
						this.tonlength = DBP(B.x,B.y,this.x+this.w/2,this.y+this.h/2);
					} else if (this.timer <= 0) {
						this.astep = 0;
						this.dturn = 2*Math.floor(Math.random()*2)-1;
						this.timer = 500;
						this.status = 'hop';
					}
				} else if (this.status == 'stickout') {
					this.ton += this.tonspeed/10;
					adir = Math.abs(this.goalangle-this.angle)/(this.goalangle-this.angle);
					if (this.goalangle==this.angle) adir = 0;
					this.angle += adir * Math.PI/30;
					if (Math.abs(this.goalangle-this.angle) <= Math.PI/30) {
						this.angle = this.goalangle;
						this.status = 'shootout';
					}
				} else if (this.status == 'shootout') {
					this.ton += this.tonspeed;
					if (this.ton > this.tonlength) {
						this.status = 'shootin';
					}
				} else if (this.status == 'shootin') {
					this.ton -= this.tonspeed;
					if (this.ton <= 0) {
						this.ton = 0;
						this.status = 'wait';
					}
				} else if (this.status == 'hop') {
					if (this.timer > 0) {
						this.astep++;
						if (this.astep <= 5) {
							this.angle += Math.PI/2/5 * this.dturn;
						}
						this.vx += Math.cos(this.angle) * this.speed;
						this.vy += Math.sin(this.angle) * this.speed;
					} else {
						this.dir += this.dturn;
						if (this.dir < 0) this.dir += 4;
						if (this.dir > 3) this.dir -= 4;
						this.status = 'wait';
						this.timer = this.otimer;
					}
				}
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*2;
					B.vy += this.vy*2;
				} else if (this.status=='shootout' || this.status=='shootin') {
					hashit = false;
					if ((this.angle%(2*Math.PI)-0).roundToNearest(Math.PI/2) == 0) {
						if (col(cx,cy-5,this.ton+10,10,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
							hashit = true;
						}
					} else if ((this.angle%(2*Math.PI)-Math.PI/2).roundToNearest(Math.PI/2) == 0) {
						if (col(cx-5,cy,10,this.ton+10,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
							hashit = true;
						}
					} else if ((this.angle%(2*Math.PI)-Math.PI).roundToNearest(Math.PI/2) == 0) {
						if (col(cx-this.ton-10,cy-5,this.ton+10,10,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
							hashit = true;
						}
					} else if ((this.angle%(2*Math.PI)-3*Math.PI/2).roundToNearest(Math.PI/2) == 0) {
						if (col(cx-5,cy-this.ton-10,10,this.ton+10,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
							hashit = true;
						}
					}
					if (hashit) {
						B.hit(this.dmg);
						B.vx += this.speed*10*Math.cos(this.angle);
						B.vy += this.speed*10*Math.sin(this.angle);
					}
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (!B.dead) this.cstep = this.cstep>=4?0:this.cstep+0.5;
				g.translate(this.x,this.y);
					g.translate(this.w/2,this.h/2);
						g.rotate(this.angle);
							g.strokeStyle("rgb(0,0,0)");
							g.lineWidth(10);
							g.beginPath();
								g.moveTo(0,0);
								g.lineTo(this.ton,0);
								g.arc(this.ton,0,5,0,2*Math.PI);
							g.stroke();
							g.lineWidth(1);
							g.drawImage((this.status=='shootout'||this.status=='shootin')?Images.beetleshoot:Images.beetle,-this.w/2,-this.h/2,this.w,this.h);
						g.rotate(-this.angle);
					g.translate(-this.w/2,-this.h/2);
				g.translate(-this.x,-this.y);
			}
		}
	},
	charger : function(x,y) {
		d = B.diff;
		return { w : 40, h : 40, knockback : 1/50, hitTime : 0,
			x : x - 20,
			y : y - 20,
			vx : 0,
			vy : 0,
			dir : Math.floor(Math.random()*4),
			dmg : 3 + d*0.3,
			hp : 50 + d * 4,
			speed : 1 + (d>25?25:d) * 0.02,
			dsource : 0,
			status : 'waits',
			timer : 1500,
			mtimer : 600-d*10,
			otimer : 3000-d*50,
			chargespeed : 2.4 + (d>25?25:d)*0.1,
			bspeed : 10+d*0.1,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,14,9);
			},
			step : function() {
				this.vx *= 0.8;
				this.vy *= 0.8;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				cx = this.x + this.w/2;
				cy = this.y + this.h/2;
				this.timer -= 25;
				if (this.status != 'waits' && this.status != 'charge') {
					if (col(0,B.y-B.r,600,B.r*2,0,cy-this.h/2,600,this.h) ||
						col(B.x-B.r,0,B.r*2,400,cx-this.w/2,0,this.w,400)) {
						targetangle = getAngle(B.x-this.x-this.w/2,B.y-this.y-this.h/2);
						this.dir = Math.round(targetangle/(Math.PI/2));
						if (this.dir < 0) this.dir += 4;
						this.status = 'charge';
						if (this.vx == 0) this.vx += 0.1;
						if (this.vy == 0) this.vy += 0.1;
					}
				}
				if (this.status == 'waits' || this.status == 'wait') {
					if (this.timer <= 0) {
						this.dir = Math.floor(Math.random()*4);
						this.status = 'move';
						this.timer = 250*rab(0.9,1.1);
					}
				} else if (this.status == 'move') {
					mov = mmove[this.dir];
					this.vx += mov[0] * this.speed;
					this.vy += mov[1] * this.speed;
					if (this.timer <= 0) {
						this.status = 'wait';
						this.timer = this.mtimer;
					}
				} else if (this.status == 'charge') {
					if (this.vx.roundToNearest(0.01) == 0 && this.vy.roundToNearest(0.01) == 0) {
						this.status = 'waits';
						this.timer = this.otimer;
						cr.smokeUp(cx,cy,20);
						ang = this.dir*Math.PI/2 + Math.PI;
						dev = Math.PI/9;
						ang -= 4 * dev;
						for(var i=0;i<7;i++) {
							ang += dev;
							cr.createBullet(cx,cy,Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg);
						}
					} else {
						mov = mmove[this.dir];
						this.vx += mov[0] * this.chargespeed;
						this.vy += mov[1] * this.chargespeed;
					}
				}
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*1.5;
					B.vy += this.vy*1.5;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				g.translate(this.x,this.y);
					g.translate(this.w/2,this.h/2);
						g.rotate(this.dir*Math.PI/2);
							g.drawImage(Images.charger,-this.w/2,-this.h/2,this.w,this.h);
							/*g.fillStyle("rgb(0,0,0)");
							g.beginPath();
							g.arc(11,7,this.status=='charge'?5:(this.status=='move'?3.3:2),0,2*Math.PI);
							g.arc(12,-7,this.status=='charge'?5:(this.status=='move'?3.3:2),0,2*Math.PI);
							g.fill();*/
						g.rotate(-this.dir*Math.PI/2);
					g.translate(-this.w/2,-this.h/2);
				g.translate(-this.x,-this.y);
			}
		}
	},
	popper : function(x,y) {
		d = B.diff;
		return { w : 40, h : 40, knockback : 1/50, hitTime : 0,
			x : x - 20,
			y : y - 20,
			dx : 0,
			dy : 0,
			dmg : 3 + d*0.3,
			hp : 40 + d * 4,
			speed : 1 + (d>25?25:d) * 0.02,
			dsource : 0,
			status : 'waittoshoot',
			timer : 1700,
			stimer : 600-(d>25?25:d)*40,
			gtimer : 600-(d>25?25:d)*10,
			wtimer : 1500-(d>25?25:d)*75,
			bspeed : 8+(d>30?30:d)*0.2,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,14,9);
			},
			step : function() {
				cx = this.x + this.w/2;
				cy = this.y + this.h/2;
				this.timer -= 25;
				if (this.status == 'waittoshoot') {
					if (this.timer <= 0) {
						for(var i=0;i<8;i++) {
							ang = i / 8 * 2 * Math.PI;
							cr.createBullet(cx,cy,Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg);
						}
						this.timer = this.stimer;
						this.status = 'waittoshrink';
					}
				} else if (this.status == 'waittoshrink') {
					if (this.timer <= 0) {
						this.timer = this.gtimer;
						this.status = 'shrink';
					}
				} else if (this.status == 'shrink') {
					if (this.timer <= 0) {
						this.x = -100;
						this.y = -100;
						this.timer = this.wtimer*rab(0.7,1.3);
						this.status = 'waittopopup';
					}
				} else if (this.status == 'waittopopup') {
					if (this.timer <= 0) {
						while(true) {
							this.dx = Math.random()*560;
							this.dy = Math.random()*360;
							coll = false;
							for(var j=0;j<cr.rock.length;j++) {
								if (col(cr.rock[j].x,cr.rock[j].y,cr.rock[j].w,cr.rock[j].h,this.dx,this.dy,this.w,this.h)) {
									coll = true;
									break;
								}
							}
							if (!coll) {
								break;
							}
						}
						this.dr = 0;
						this.status = 'ringin';
						this.timer = this.gtimer * 1.5;
					}
				} else if (this.status == 'ringin') {
					if (this.timer <= 0) {
						this.x = this.dx;
						this.y = this.dy;
						this.timer = this.gtimer;
						this.status = 'expand';
					}
				} else if (this.status == 'expand') {
					if (this.timer <= 0) {
						this.timer = this.stimer;
						this.status = 'waittoshoot';
					}
				}
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (this.status == 'ringin') {
					g.strokeStyle("rgb(30,30,150)");
					g.lineWidth(this.dr=(this.dr+0.1>3?3:this.dr+0.1));
						g.beginPath();
							g.arc(this.dx+this.w/2,this.dy+this.h/2,Math.abs(30*this.timer/this.stimer),0,2*Math.PI);
							g.stroke();
					g.lineWidth(1);
				} else {
					g.translate(this.x,this.y);
						g.translate(this.w/2,this.h/2);
							r = 1;
							if (this.status == 'shrink') r = this.timer/this.gtimer;
							if (this.status == 'expand') r = 1 - this.timer/this.gtimer;
							g.fillStyle("rgb(30,30,150)");
							g.strokeStyle("rgb(255,255,255)");
							for(var i=0;i<8;i++) {
								g.rotate(Math.PI/4);
								g.fillRect(0,-3*r,20*r,6*r);
								g.strokeRect(0,-3*r,20*r,6*r);
							}
							g.beginPath();
								g.arc(0,0,16*r,0,2*Math.PI);
								g.fill();
								g.stroke();
							g.rotate(-2*Math.PI);
						g.translate(-this.w/2,-this.h/2);
					g.translate(-this.x,-this.y);
				}
			}
		}
	},
	flyshoot : function(x,y) {
		d = B.diff;
		return { w : 30, h : 30, knockback : 1/60, hitTime : 0,
			x : x - 15,
			y : y - 15,
			vx : 0,
			vy : 0,
			dmg : 3 + d*0.2,
			hp : 30 + d *6,
			speed : 0.4 + 0.09*(d>25?25:d),
			dsource : 0,
			timer : 1000,
			bspeed : 10+(d>25?25:d)*0.2,
			otimer : 1500-(d>25?25:d)*35,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,12,7);
			},
			step : function() {
				this.timer -= 25;
				if (this.timer <= 0) {
					if (DBP(this.x+this.w/2,this.y+this.h/2,B.x,B.y) < 300) {
						ang = getAngle(B.x-this.x-this.w/2,B.y-this.y-this.h/2);
						cr.createBullet(this.x+this.w/2,this.y+this.h/2,Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg);
						this.timer = this.otimer*rab(0.8,1.2);
					}
				}
				ang = rab(0,2*Math.PI);
				this.vx += Math.cos(ang)*this.speed*rab(0.5,1);
				this.vy += Math.sin(ang)*this.speed*rab(0.5,1);
				this.vx *= 0.9;
				this.vy *= 0.9;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (!B.dead) this.cstep = this.cstep>=4?0:this.cstep+0.5;
				if (Math.random()<0.8) this.cstate = this.cstate==-1?0.1:(this.cstate==0.1?1:(this.cstate==1?0:-1));
				g.translate(this.x,this.y);
					g.translate(this.w/2,this.h/2);
					g.fillStyle("rgba(255,255,255,0.5)");
						ang = this.cstate*Math.PI/8;
						g.translate(Math.cos(ang)*this.w/4,Math.sin(ang)*this.w/4);
							g.rotate(ang);
							g.beginPath();
								g.ellipse(0,0,this.w/4,this.h/8);
							g.fill();
							g.rotate(-ang);
						g.translate(-Math.cos(ang)*this.w/4,-Math.sin(ang)*this.w/4);
						ang = Math.PI - ang;
						g.translate(Math.cos(ang)*this.w/4,Math.sin(ang)*this.w/4);
							g.rotate(ang);
							g.beginPath();
								g.ellipse(0,0,this.w/4,this.h/8);
							g.fill();
							g.rotate(-ang);
						g.translate(-Math.cos(ang)*this.w/4,-Math.sin(ang)*this.w/4);
					g.translate(-this.w/2,-this.h/2);
					g.drawImage(Images.flyshoot,this.w/3,0,this.w/3,this.h);
				g.translate(-this.x,-this.y);
			}
		};
	},
	spiraler : function(x,y) {
		d = B.diff;
		return { w : 40, h : 40, knockback : 1/40, hitTime : 0,
			x : x - 20,
			y : y - 20,
			vx : 0,
			vy : 0,
			dmg : 3 + d*0.2,
			hp : 50 + d * 6.5,
			speed : 0.4 + 0.04*(d>35?35:d),
			dsource : 0,
			timer : 2000*rab(0.8,1.2),
			status : 'wait',
			bspeed : 10+d*0.2,
			otimer : 4000-(d>30?30:d)*100,
			progress : 0,
			sframe : 0,
			maxsframe : Math.ceil(3 - (d>30?30:d)/10),
			r : rab(0,2*Math.PI),
			rdir : 1,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,12,7);
			},
			step : function() {
				this.timer -= 25;
				ang = rab(0,2*Math.PI);
				this.vx += Math.cos(ang)*this.speed*rab(0.5,1);
				this.vy += Math.sin(ang)*this.speed*rab(0.5,1);
				this.vx *= 0.9;
				this.vy *= 0.9;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				cx = this.x+this.w/2;
				cy = this.y+this.h/2;
				if (this.status == 'wait') {
					if (this.timer > 0) {
						this.r += this.rdir*rab(0.2,1)*Math.PI/80;
					} else {
						this.status = 'rotate';
						this.progress = 0;
						this.sframe = 0;
					}
				} else if (this.status == 'rotate') {
					this.progress += Math.PI/40;
					this.r += this.rdir*Math.PI/40;
					if (this.progress >= 3*Math.PI) {
						this.status = 'wait';
						this.rdir *= -1;
						this.timer = this.otimer*rab(0.9,1);
					}
					if (this.sframe < 0) {
						this.sframe = this.maxsframe;
						cr.createBullet(cx+Math.cos(this.r)*20,cy+Math.sin(this.r)*20,Math.cos(this.r)*this.bspeed,Math.sin(this.r)*this.bspeed,this.dmg);
					} else {
						this.sframe--;
					}
				}
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				g.translate(this.x,this.y);
					g.translate(this.w/2,this.h/2);
						g.rotate(this.r);
							g.drawImage(Images.spiraler,-this.w/2,-this.h/2,this.w,this.h);
							ang = 0;
							g.fillStyle("rgb(0,0,255)");
							for(var j=0;j<((this.status=='rotate')?(8-this.progress/Math.PI*4):((this.otimer-this.timer)/this.otimer*8));j++) {
								ang += Math.PI/4;
								g.beginPath();
									g.arc(Math.cos(ang)*15,Math.sin(ang)*15,2,0,2*Math.PI);
									g.fill();
							}
						g.rotate(-this.r);
					g.translate(-this.w/2,-this.h/2);
				g.translate(-this.x,-this.y);
			}
		}
	},
	spike : function(x,y) {
		d = B.diff;
		return { w : 50, h : 50, knockback : 0, hitTime : 0,
			x : x - 25,
			y : y - 25,
			vx : 0,
			vy : 0,
			dmg : 2.5 + d*0.12,
			hp : 40 + d * 4,
			speed : 2.2 + 0.065*(d>25?25:d),
			dsource : 0,
			timer : 2000,
			charge : false,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,12,7);
			},
			step : function() {
				this.timer -= 25;
				if (this.timer > 0) return true;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				if (DBP(0,0,this.vx,this.vy) < 0.1) {
					ang = Math.floor(Math.random()*4) * Math.PI/2;
					this.vx = Math.cos(ang) * this.speed;
					this.vy = Math.sin(ang) * this.speed;
					this.charge = false;
				}
				if (this.charge == false && (col(B.x-B.r,B.y-B.r,B.r*2,B.r*2,this.x,0,50,400) ||
					col(B.x-B.r,B.y-B.r,B.r*2,B.r*2,0,this.y,600,50))) {
					ang = (getAngle(B.x-this.x,B.y-this.y)).roundToNearest(Math.PI/2);
					this.vx = Math.cos(ang) * this.speed * 2.75;
					this.vy = Math.sin(ang) * this.speed * 2.75;
					this.charge = true;
				}
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				g.translate(this.x,this.y);
					g.strokeStyle('rgb(0,0,0)');
					g.fillStyle("rgb(100,100,100)");
					g.fillRect(10,10,30,30);
					g.strokeRect(10,10,30,30);
					g.translate(this.w/2,this.h/2);
						g.fillStyle("rgb(200,200,200)");
						for(var i=0;i<4;i++) {
							g.rotate(i*Math.PI/2);
								g.beginPath();
								g.moveTo(-15,15);
								g.lineTo(-10,25);
								g.lineTo(-5,15);
								g.lineTo(0,25);
								g.lineTo(5,15);
								g.lineTo(10,25);
								g.lineTo(15,15);
								g.lineTo(-15,15);
								g.fill();
								g.stroke();
							g.rotate(-i*Math.PI/2);
						}
					g.translate(-this.w/2,-this.h/2);
				g.translate(-this.x,-this.y);
			}
		}
	},
	mine : function(x,y) {
		d = B.diff;
		return { w : 24, h : 24, knockback : 1/60, hitTime : 0, cspawn : 0.2,
			x : x - 12,
			y : y - 12,
			vx : 0,
			vy : 0,
			dmg : 5.3 + d*0.3,
			inr : getBlastR(5.3+d*0.3),
			hp : 20 + d * 3,
			dsource : 0,
			timer : 30,
			blink : 0,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.explode(this.x+this.w/2,this.y+this.h/2,this.dmg,1);
			},
			step : function() {
				gokill = false;
				if (this.timer == 30) {
					if (DBP(this.x+this.w/2,this.y+this.h/2,B.x,B.y) < this.inr) {
						this.timer = 29;
					}
				} else {
					if (this.timer > 4) this.timer-=25/40;
					else if (this.timer > 2) this.timer -= 2 / 80;
					else gokill = true;
				}
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					gokill = true;
				}
				if (gokill || this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				g.translate(this.x,this.y);
					g.drawImage(Images.mine,0,0,this.w,this.h);
					this.blink++;
					if (this.blink > this.timer) {
						if (this.blink > this.timer + 3) this.blink = 0;
						g.fillStyle("rgb(255,100,100)");
						g.beginPath();
						g.arc(this.w/2,this.h/2,2,0,2*Math.PI);
						g.fill();
					}
				g.translate(-this.x,-this.y);
			}
		};
	},
	minefactory : function(x,y) {
		d = B.diff;
		return { w : 40, h : 40, knockback : 1/60, hitTime : 0,
			x : x - 20,
			y : y - 20,
			vx : 0,
			vy : 0,
			dmg : 6.2 + d*0.35,
			hp : 55 + d * 5,
			speed : 10 + 0.3*(d>25?25:d),
			dsource : 0,
			timer : 1000,
			otimer : 3500 - (d>25?25:d) * 100,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.explode(this.x+this.w/2,this.y+this.h/2,this.dmg,1);
			},
			step : function() {
				mcx = this.x+this.w/2;
				mcy = this.y+this.h/2;
				this.timer -= 25;
				if (this.timer <= 0) {
					cr.m.unshift(new Monster.mine(mcx,mcy));
					this.timer = this.otimer;
					tpx = rab(100,500);
					tpy = rab(100,300);
					ang = getAngle(tpx-mcx,tpy-mcy) + Math.PI/180*rab(-20,20);
					this.vx += Math.cos(ang)*this.speed*rab(0.9,1.1);
					this.vy += Math.sin(ang)*this.speed*rab(0.9,1.1);
				}
				this.vx *= 0.93;
				this.vy *= 0.93;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2) || this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				g.translate(this.x,this.y);
					g.drawImage(Images.minefactory,0,0,this.w,this.h);
				g.translate(-this.x,-this.y);
			}
		};
	},
	flyfrag : function(x,y) {
		d = B.diff;
		return { w : 44, h : 44, knockback : 1/75, hitTime : 0,
			x : x - 22,
			y : y - 22,
			vx : 0,
			vy : 0,
			dmg : 3 + d*0.22,
			hp : 50 + d * 5,
			speed : 0.5 + 0.1*(d>30?30:d),
			dsource : 0,
			timer : 1000,
			bspeed : 10+d*0.2,
			otimer : 2200-(d>25?25:d)*50,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,12,7);
			},
			step : function() {
				this.timer -= 25;
				if (this.timer <= 0) {
					if (DBP(this.x+this.w/2,this.y+this.h/2,B.x,B.y) < 400) {
						ang = getAngle(B.x-this.x-this.w/2,B.y-this.y-this.h/2);
						cr.createBullet(this.x+this.w/2,this.y+this.h/2,Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg);
						cr.bullets[cr.bullets.length-1].cluster = true;
						cr.bullets[cr.bullets.length-1].clusterratio = 1/3;
						cr.bullets[cr.bullets.length-1].s *= 2;
						this.timer = this.otimer*rab(0.8,1.2);
					}
				}
				ang = rab(0,2*Math.PI);
				this.vx += Math.cos(ang)*this.speed*rab(0.5,1);
				this.vy += Math.sin(ang)*this.speed*rab(0.5,1);
				this.vx *= 0.9;
				this.vy *= 0.9;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (!B.dead) this.cstep = this.cstep>=4?0:this.cstep+0.5;
				if (Math.random()<0.8) this.cstate = this.cstate==-1?0.1:(this.cstate==0.1?1:(this.cstate==1?0:-1));
				g.translate(this.x,this.y);
					g.translate(this.w/2,this.h/2);
					g.fillStyle("rgba(255,255,255,0.5)");
						ang = this.cstate*Math.PI/8;
						g.translate(Math.cos(ang)*this.w/4,Math.sin(ang)*this.w/4);
							g.rotate(ang);
							g.beginPath();
								g.ellipse(0,0,this.w/4,this.h/8);
							g.fill();
							g.rotate(-ang);
						g.translate(-Math.cos(ang)*this.w/4,-Math.sin(ang)*this.w/4);
						ang = Math.PI - ang;
						g.translate(Math.cos(ang)*this.w/4,Math.sin(ang)*this.w/4);
							g.rotate(ang);
							g.beginPath();
								g.ellipse(0,0,this.w/4,this.h/8);
							g.fill();
							g.rotate(-ang);
						g.translate(-Math.cos(ang)*this.w/4,-Math.sin(ang)*this.w/4);
					g.translate(-this.w/2,-this.h/2);
					g.drawImage(Images.flyfrag,this.w/3,0,this.w/3,this.h);
				g.translate(-this.x,-this.y);
			}
		};
	},
	bombfly : function(x,y) {
		d = Math.max(0,B.diff-20);
		return { w : 40, h : 40, knockback : 1/75, hitTime : 0,
			x : x - 20,
			y : y - 20,
			vx : 0,
			vy : 0,
			dmg : 7 + d*0.22,
			hp : 90 + d * 6,
			speed : 0.5 + 0.1*(d>25?25:d),
			dsource : 0,
			timer : 1000,
			bspeed : 10+(d>25?25:d)*0.2,
			otimer : 1750-(d>25?25:d)*40,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,12,7);
			},
			step : function() {
				this.timer -= 25;
				if (this.timer <= 0) {
					if (DBP(this.x+this.w/2,this.y+this.h/2,B.x,B.y) < 500) {
						ang = getAngle(B.x-this.x-this.w/2,B.y-this.y-this.h/2);
						cr.proj.push({
							type : "bomb",
							x : this.x + this.w / 2,
							y : this.y + this.h / 2,
							vx : Math.cos(ang) * this.bspeed,
							vy : Math.sin(ang) * this.bspeed,
							dmg : this.dmg,
							s : 6
						});
						this.timer = this.otimer*rab(0.8,1.2);
					}
				}
				ang = rab(0,2*Math.PI);
				this.vx += Math.cos(ang)*this.speed*rab(0.5,1);
				this.vy += Math.sin(ang)*this.speed*rab(0.5,1);
				this.vx *= 0.9;
				this.vy *= 0.9;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (!B.dead) this.cstep = this.cstep>=4?0:this.cstep+0.5;
				if (Math.random()<0.8) this.cstate = this.cstate==-1?0.1:(this.cstate==0.1?1:(this.cstate==1?0:-1));
				g.translate(this.x,this.y);
					g.translate(this.w/2,this.h/2);
					g.fillStyle("rgba(255,255,255,0.5)");
						ang = this.cstate*Math.PI/8;
						g.translate(Math.cos(ang)*this.w/4,Math.sin(ang)*this.w/4);
							g.rotate(ang);
							g.beginPath();
								g.ellipse(0,0,this.w/4,this.h/8);
							g.fill();
							g.rotate(-ang);
						g.translate(-Math.cos(ang)*this.w/4,-Math.sin(ang)*this.w/4);
						ang = Math.PI - ang;
						g.translate(Math.cos(ang)*this.w/4,Math.sin(ang)*this.w/4);
							g.rotate(ang);
							g.beginPath();
								g.ellipse(0,0,this.w/4,this.h/8);
							g.fill();
							g.rotate(-ang);
						g.translate(-Math.cos(ang)*this.w/4,-Math.sin(ang)*this.w/4);
					g.translate(-this.w/2,-this.h/2);
					g.drawImage(Images.bombfly,this.w/3,0,this.w/3,this.h);
				g.translate(-this.x,-this.y);
			}
		};
	},
	bombpop : function(x,y) {
		d = Math.max(0,B.diff-22);
		return { w : 40, h : 40, knockback : 1/50, hitTime : 0,
			x : x - 20,
			y : y - 20,
			dx : 0,
			dy : 0,
			dmg : 7 + d*0.25,
			hp : 90 + d * 6,
			speed : 1 + (d>25?25:d) * 0.02,
			dsource : 0,
			status : 'waittoshoot',
			timer : 1500,
			stimer : 500-(d>25?25:d)*12,
			gtimer : 500-(d>25?25:d)*10,
			wtimer : 900-(d>25?25:d)*30,
			bspeed : 8+(d>30?30:d)*0.17,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,14,9);
			},
			step : function() {
				cx = this.x + this.w/2;
				cy = this.y + this.h/2;
				this.timer -= 25;
				if (this.status == 'waittoshoot') {
					if (this.timer <= 0) {
						for(var i=0;i<8;i++) {
							ang = i / 8 * 2 * Math.PI;
							cr.proj.push({
								type : "bomb",
								x : cx,
								y : cy,
								vx : Math.cos(ang) * this.bspeed,
								vy : Math.sin(ang) * this.bspeed,
								dmg : this.dmg,
								s : 6
							});
						}
						this.timer = this.stimer;
						this.status = 'waittoshrink';
					}
				} else if (this.status == 'waittoshrink') {
					if (this.timer <= 0) {
						this.timer = this.gtimer;
						this.status = 'shrink';
					}
				} else if (this.status == 'shrink') {
					if (this.timer <= 0) {
						this.x = -100;
						this.y = -100;
						this.timer = this.wtimer*rab(0.7,1.3);
						this.status = 'waittopopup';
					}
				} else if (this.status == 'waittopopup') {
					if (this.timer <= 0) {
						while(true) {
							this.dx = Math.random()*560;
							this.dy = Math.random()*360;
							coll = false;
							for(var j=0;j<cr.rock.length;j++) {
								if (col(cr.rock[j].x,cr.rock[j].y,cr.rock[j].w,cr.rock[j].h,this.dx,this.dy,this.w,this.h)) {
									coll = true;
									break;
								}
							}
							if (!coll) {
								break;
							}
						}
						this.dr = 0;
						this.status = 'ringin';
						this.timer = this.gtimer * 1.5;
					}
				} else if (this.status == 'ringin') {
					if (this.timer <= 0) {
						this.x = this.dx;
						this.y = this.dy;
						this.timer = this.gtimer;
						this.status = 'expand';
					}
				} else if (this.status == 'expand') {
					if (this.timer <= 0) {
						this.timer = this.stimer;
						this.status = 'waittoshoot';
					}
				}
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (this.status == 'ringin') {
					g.strokeStyle("rgb(255,0,0)");
					g.lineWidth(this.dr=(this.dr+0.1>3?3:this.dr+0.1));
						g.beginPath();
							g.arc(this.dx+this.w/2,this.dy+this.h/2,Math.abs(30*this.timer/this.stimer),0,2*Math.PI);
							g.stroke();
					g.lineWidth(1);
				} else {
					g.translate(this.x,this.y);
						g.translate(this.w/2,this.h/2);
							r = 1;
							if (this.status == 'shrink') r = this.timer/this.gtimer;
							if (this.status == 'expand') r = 1 - this.timer/this.gtimer;
							g.strokeStyle("rgb(255,255,255)");
							for(var i=0;i<8;i++) {
								g.fillStyle("rgb(255,"+((i%2)*100+100)+",0)");
								g.rotate(Math.PI/4);
								g.fillRect(0,-3*r,20*r,6*r);
								g.strokeRect(0,-3*r,20*r,6*r);
							}
							g.fillStyle("rgb(220,0,0)");
							g.beginPath();
								g.arc(0,0,16*r,0,2*Math.PI);
								g.fill();
								g.stroke();
							g.rotate(-2*Math.PI);
						g.translate(-this.w/2,-this.h/2);
					g.translate(-this.x,-this.y);
				}
			}
		}
	},
	bouncer : function(x,y) {
		d = Math.max(0,B.diff-25);
		ang = Math.random()*2*Math.PI;
		speed = 7 + (d>25?25:d) * 0.17;
		return { w : 40, h : 40, knockback : 0, hitTime : 0, dsource : 0,
			x : x - 20,
			y : y - 20,
			vx : Math.cos(ang)*speed,
			vy : Math.sin(ang)*speed,
			speed : speed,
			dmg : 7 + d*0.25,
			hp : 150 + d * 6,
			timer : 5000+(d>25?25:d)*200,
			ptimer : 700,
			blowup : false,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,14,9);
			},
			step : function() {
				cx = this.x + this.w/2;
				cy = this.y + this.h/2;
				if (this.ptimer > 0) {
					this.ptimer -= 25;
					return true;
				}
				this.x += this.vx;
				this.y += this.vy;
				this.iPart(1);
				var dbp = DBP(cx,cy,B.x,B.y);
				if (this.blowup) {
					ang = getAngle(B.x-cx,B.y-cy);
					this.vx += Math.cos(ang) * this.speed / Math.max(10, dbp - 80);
					this.vy += Math.sin(ang) * this.speed / Math.max(10, dbp - 80);
					this.timer = Math.max(0, this.timer-25);
					if (this.timer == 0 || col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
						this.kill();
						cr.explode(cx, cy, this.dmg * 3, 1);
						return false;
					}
				} else {
					if (DBP(cx,cy,B.x,B.y) < 100) {
						this.otimer = this.timer;
						this.blowup = true;
					}
				}
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (this.blowup) {
					var fx = this.x + rab(-2, 2);
					var fy = this.y + rab(-2, 2);
					g.globalAlpha(this.timer/this.otimer);
					g.drawImage(Images.bouncer,fx, fy,this.w,this.h);
					g.globalAlpha(1-this.timer/this.otimer);
					g.drawImage(Images.bouncer2,fx, fy,this.w,this.h);
					g.globalAlpha(1);
				} else g.drawImage(Images.bouncer,this.x,this.y,this.w,this.h);
			}
		}
	},
	telefly : function(x,y) {
		d = Math.max(0,B.diff-25);
		return { w : 40, h : 40, knockback : 1/75, hitTime : 0, dsource : 0,
			x : x - 20,
			y : y - 20,
			vx : 0,
			vy : 0,
			dmg : 9 + d*0.3,
			hp : 120 + d * 5,
			speed : 0.5 + 0.05*(d>25?25:d),
			timer : 1000,
			otimer : 1500-(d>25?25:d)*30,
			ttimer : 1500,
			ottimer : 3500-(d>25?25:d)*65,
			tele : -1,
			bspeed : 10+(d>25?25:d)*0.22,
			hit : function(dmg,dmgtype) {
				this.dsource = isNaN(dmgtype)?0:dmgtype;
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,12,7);
			},
			step : function() {
				this.timer -= 25;
				this.ttimer -= 25;
				if (this.tele != -1) {
					this.tele -= 25;
					if (Math.abs(this.tele) <= 250) {
						this.x = -100;
						this.y = -100;
					}
					if (this.tele > -275 && this.tele <= -250) {
						es = cr.findEmptySpot(this.w,this.h,true);
						this.x = es.x;
						this.y = es.y;
					} else if (this.tele <= -500) {
						this.tele = -1;
					}
				} else {
					if (this.ttimer <= 0) {
						this.ttimer = this.ottimer;
						this.tele = 500;
					}
					if (this.timer <= 0) {
						ang = getAngle(B.x-this.x-this.w/2,B.y-this.y-this.h/2);
						cr.createBullet(this.x+this.w/2,this.y+this.h/2,Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg);
						this.timer = this.otimer;
					}
				}
				
				
				ang = rab(0,2*Math.PI);
				this.vx += Math.cos(ang)*this.speed*rab(0.5,1);
				this.vy += Math.sin(ang)*this.speed*rab(0.5,1);
				this.vx *= 0.9;
				this.vy *= 0.9;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (!B.dead) this.cstep = this.cstep>=4?0:this.cstep+0.5;
				if (Math.random()<0.8) this.cstate = this.cstate==-1?0.1:(this.cstate==0.1?1:(this.cstate==1?0:-1));
				g.translate(this.x,this.y);
					g.translate(this.w/2,this.h/2);
					g.fillStyle("rgba(255,255,255,0.5)");
						ang = this.cstate*Math.PI/8;
						if (this.tele != -1) {
							ttele = (Math.abs(this.tele)<250)?0:(Math.abs(this.tele)-250);
							g.globalAlpha(Math.abs(ttele/250));
						}
						g.translate(Math.cos(ang)*this.w/4,Math.sin(ang)*this.w/4);
							g.rotate(ang);
							g.beginPath();
								g.ellipse(0,0,this.w/4,this.h/8);
							g.fill();
							g.rotate(-ang);
						g.translate(-Math.cos(ang)*this.w/4,-Math.sin(ang)*this.w/4);
						ang = Math.PI - ang;
						g.translate(Math.cos(ang)*this.w/4,Math.sin(ang)*this.w/4);
							g.rotate(ang);
							g.beginPath();
								g.ellipse(0,0,this.w/4,this.h/8);
							g.fill();
							g.rotate(-ang);
						g.translate(-Math.cos(ang)*this.w/4,-Math.sin(ang)*this.w/4);
						g.globalAlpha(1);
					g.translate(-this.w/2,-this.h/2);
					if (this.tele == -1) g.drawImage(Images.telefly,this.w/3,0,this.w/3,this.h);
					else {
						ttele = (Math.abs(this.tele)<250)?0:(Math.abs(this.tele)-250);
						g.drawImage(Images.telefly,this.w/3,(1-ttele/250)*this.h/2,this.w/3,ttele/250*this.h);
					}
				g.translate(-this.x,-this.y);
			}
		};
	},
	
	
	
	
	
	
	buzzer : function(x,y) {
		d = B.diff;
		return { w : 150, h : 150, knockback : 1/300, hitTime : 0,
			name : "Buzzer",
			boss : true,
			x : x - 75,
			y : y - 75,
			vx : 0,
			vy : 0,
			dmg : 3 + d*0.3,
			speed : 1.1 + 0.12*d,
			bspeed : 7+d*0.3,
			timer : 1000,
			otimer : 1800-(d>25?25:d)*56,
			maxhp : 1000 + d*50,
			hp : 1000 + d*50,
			timermod : 0,
			mlist : ["fly","spider"],
			hit : function(dmg) {
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,50,30);
			},
			step : function() {
				if (roomtrans) return;
				this.timer -= 25;
				if (this.timer <= 0 && this.timer > -25) {
					if (Math.random()<0.5 || cr.m.length > 5) {
						if (Math.random() < 0.5) {
							ang = getAngle(B.x-this.x-75,B.y-this.y-75)-3*Math.PI/10;
							for(var i=0;i<5;i++) {
								ang += Math.PI/10;
								cr.createBullet(this.x+75-this.dmg,this.y+89-this.dmg,Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg,this.dmg*2);
							}
						} else {
							ang = getAngle(B.x-this.x-75,B.y-this.y-75);
							for(var i=0;i<16;i++) {
								ang += 2 * Math.PI / 16;
								cr.createBullet(this.x+75-this.dmg,this.y+89-this.dmg,Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg,this.dmg*2);
							}
						}
						this.timermod = 0;
					} else {
						ang = rab(0,2*Math.PI);
						mont = this.mlist[Math.floor(Math.random()*this.mlist.length)];
						cr.m.push(Monster[mont](this.x+75,this.y+89));
						cr.m[cr.m.length-1].vx += Math.cos(ang) * this.bspeed;
						cr.m[cr.m.length-1].vy += Math.sin(ang) * this.bspeed;
						this.timermod = 500;
					}
				} else if (this.timer < -400) {
					this.timer = this.otimer + this.timermod;
				}
				ang = rab(0,2*Math.PI);
				this.vx += Math.cos(ang)*this.speed*rab(0.5,1);
				this.vy += Math.sin(ang)*this.speed*rab(0.5,1);
				this.vx *= 0.9;
				this.vy *= 0.9;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (!B.dead) this.cstep = this.cstep>=4?0:this.cstep+0.5;
				if (Math.random()<0.8) this.cstate = this.cstate==-1?0.1:(this.cstate==0.1?1:(this.cstate==1?0:-1));
				g.translate(this.x,this.y);
					g.translate(75,75);
						g.fillStyle("rgba(255,255,255,0.5)");
						ang = Math.PI/5 + Math.PI/40 * this.cstate;
						for(var wing=0;wing<4;wing++) {
							if (wing == 1 || wing == 3) ang = -ang;
							aang = ang + Math.PI/20;
							g.globalAlpha(0.3);
							if (wing < 2) {
								g.rotate(aang);
									g.drawImage(Images.buzzerwing,0,-30,106,50);
								g.rotate(-aang);
							} else {
								g.save();
								g.scale(-1,1);
								g.rotate(aang);
									g.drawImage(Images.buzzerwing,0,-30,106,50);
								g.rotate(-aang);
								g.restore();
							}
							g.globalAlpha(1);
						}
					g.translate(-75,-75);
					g.drawImage(Images.buzzer,35,75/2,80,75);
					imgw = 34;
					imgh = 17;
					if(this.timer <= 400) {
						imgw = Math.abs(this.timer)/400 * 20 + 14;
						imgh = Math.abs(this.timer)/400 * 14 + 3;
					}
					g.drawImage(Images.buzzermouth,75-imgw/2,89,imgw,imgh);
				g.translate(-this.x,-this.y);
			}
		};
	},
	asteroid : function(x,y,a) {
		d = B.diff;
		ang = isNaN(a[2])?rab(0,2*Math.PI):a[2];
		spd = (5 + d * 0.1) * (a[1]+9)/10;
		hp = (300+d*10)*(5-a[1])/4;
		vx = Math.cos(ang) * spd;
		vy = Math.sin(ang) * spd;
		return { w : a[0], h : a[0], knockback : 1/600, hitTime : 0,
			name : "Asteroid",
			boss : true,
			num : a[1],
			x : x - a[0]/2,
			y : y - a[0]/2,
			vx : vx,
			vy : vy,
			dmg : 3 + d*0.3,
			bspeed : (10+d*0.15) * (a[1]+15)/16,
			timer : a[1]==1?1500:0,
			otimer : 1200 - (d>30?30:d) * 30,
			status : 'cwait',
			maxhp : hp,
			hp : hp,
			r : rab(0,2*Math.PI),
			rdir : (Math.floor(Math.random()*2))*2-1,
			rspeed : Math.PI/120 * (a[1]+4)/5,
			hit : function(dmg) {
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				if (this.num < 3) {
					ang = getAngle(this.vx,this.vy);
					cr.m.push(Monster.asteroid(this.x+this.w/2,this.y+this.h/2,[this.w*3/5,this.num+1,ang+Math.PI/3]));
					cr.m.push(Monster.asteroid(this.x+this.w/2,this.y+this.h/2,[this.w*3/5,this.num+1,ang-Math.PI/3]));
				} else {
					cr.splashBlood(this.x+this.w/2,this.y+this.h/2,15,10);
				}
			},
			step : function() {
				if (roomtrans) return;
				this.timer -= 25;
				if (this.status == 'cwait' && this.timer > 0) return true;
				if (this.status == 'cwait') {this.timer=this.otimer;this.status = 'whatever';}
				this.x += this.vx;
				this.y += this.vy;
				this.iPart(1);
				this.r += this.rdir * this.rspeed;
				cx = this.x+this.w/2;
				cy = this.y+this.h/2;
				if (this.timer <= 0) {
					this.timer = this.otimer;
					for(var i=0;i<2;i++) {
						ang = this.r+i*Math.PI;
						cr.createBullet(cx+this.w/2*Math.cos(ang),cy+this.w/2*Math.sin(ang),Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg);
					}
				}
				if (DBP(cx,cy,B.x,B.y)<=B.r+this.w/2) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				g.translate(this.x+this.w/2,this.y+this.h/2);
					g.rotate(this.r);
						g.drawImage(Images.asteroid,-this.w/2,-this.h/2,this.w,this.h);
					g.rotate(-this.r);
				g.translate(-this.x-this.w/2,-this.y-this.h/2);
			}
		};
	},
	gemini : function(x,y,alr,dr) {
		godir = Math.floor(Math.random()*4);
		if (alr === true && dr == godir) godir += Math.floor(Math.random()*3) + 1;
		d = B.diff;
		ang = Math.PI/4 + godir * Math.PI/2;
		spd = 5 + d*0.1;
		return { w : 60, h : 60, knockback : 0, hitTime : 0,
			name : "Gemini",
			boss : true,
			godir : godir, alt : (alr===true)?true:false,
			x : x - 30 + rab(-20,20),
			y : y - 30 + rab(-20,20),
			vx : Math.cos(ang) * spd,
			vy : Math.sin(ang) * spd,
			dmg : 3 + d*0.3,
			timer : 3000 * rab(1,1.5),
			otimer : 5000-(d>25?25:d)*100,
			maxhp : 700 + d*50,
			hp : 700 + d*50,
			sm : 0,
			bw : 0,
			mlist : ["fly","spider"],
			hit : function(dmg) {
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,50,30);
			},
			step : function() {
				if (!this.alt) {
					this.alt = true;
					cr.m.push(new Monster.gemini(this.x,this.y,true,this.godir));
				}
				if (roomtrans) return;
				this.timer -= 25;
				if (this.timer < -2000) {
					this.timer = this.otimer*rab(0.9,1.1);
				} else if (this.timer <= -100) {
					if (col(B.x-B.r,B.y-B.r,B.r*2,B.r*2,this.x+15,0,30,400) ||
						col(B.x-B.r,B.y-B.r,B.r*2,B.r*2,0,this.y+15,600,30)) {
						ang = getAngle(B.x-this.x-30,B.y-this.y-30).roundToNearest(Math.PI/2);
						B.hit(this.dmg);
						B.vx += Math.cos(ang)*7;
						B.vy += Math.sin(ang)*7;
					}
				}
				if (this.timer > 500) {
					this.x += this.vx;
					this.y += this.vy;
				}
				this.iPart(1);
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (this.timer < 0) {
					this.bw += 3;
					if (this.timer < -1600) this.bw -= 6;
					if (this.bw > 28) this.bw = 30+rab(-1,1);
					if (this.bw < 0) this.bw = 0;
					g.fillStyle("rgb(150,0,0)");
					g.fillRect(0,this.y+30-this.bw/2,600,this.bw);
					g.fillRect(this.x+30-this.bw/2,0,this.bw,600);
				}
				if (this.timer < 200) {
					this.sm += 0.4;
				}
				if (this.timer < 1000) {
					g.globalAlpha(0.7);
				} else {
					this.sm -= 0.4;
				}
				if (this.sm < 0) this.sm = 0;
				if (this.sm >= 2*Math.PI) this.sm -= 2*Math.PI;
				chnge = Math.sin(this.sm) * 5 + 5;
				g.drawImage(Images.gsmall,this.x-chnge,this.y-chnge,this.w+chnge*2,this.h+chnge*2);
				g.globalAlpha(1);
			}
		};
	},
	spinout : function(x,y) {
		d = Math.max(0,B.diff-3);
		buls = [];
		for(var _i=0;_i<18;_i++) {
			buls.push({x:0,y:0,ang:0});
		}
		return { w : 60, h : 60, knockback : 1/400, hitTime : 0,
			name : "Spinout",
			boss : true,
			x : x - 30,
			y : y - 30,
			vx : 0,
			vy : 0,
			dmg : 3 + d*0.3,
			speed : 0.3 + 0.03*d,
			cspeed : 8 + 0.23*d,
			bspeed : 9+d*0.4,
			timer : 1000,
			ctimer : 2200-(d>25?25:d)*60,
			stimer : 1550-(d>25?25:d)*40,
			maxhp : 1000 + d*50,
			hp : 1000 + d*50,
			maxr : 80+(d>25?25:d)*2,
			r : 40,
			rot1 : rab(0,2*Math.PI),
			rot2 : rab(0,2*Math.PI),
			status : 'wait',
			b : buls,
			hit : function(dmg) {
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,50,30);
			},
			step : function() {
				if (roomtrans) return;
				this.vx *= 0.97;
				this.vy *= 0.97;
				this.x += this.vx;
				this.y += this.vy;
				cx = this.x + this.w/2;
				cy = this.y + this.h/2;
				this.iPart(0.8);
				this.timer -= 25;
				rspeed = DBP(this.vx,this.vy,0,0);
				if (this.status == 'wait') {
					ang = getAngle(B.x-cx,B.y-cy)+rab(-Math.PI,Math.PI)*0.8;
					this.vx += Math.cos(ang)*this.speed*rab(0.9,1);
					this.vy += Math.sin(ang)*this.speed*rab(0.9,1);
					if (this.timer <= 0) {
						if (Math.random() * 700 > 100 + DBP(B.x,B.y,cx,cy)) {
							this.status = 'charge';
							ang = getAngle(B.x-cx,B.y-cy);
							this.vx += Math.cos(ang) * this.cspeed;
							this.vy += Math.sin(ang) * this.cspeed;
						} else {
							ang = getAngle(B.x-cx,B.y-cy);
							for(var i=0;i<8;i++) {
								ang += 2*Math.PI / 8;
								cr.createBullet(cx,cy,Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg);
							}
							this.timer = this.stimer;
						}
					}
				} else if (this.status == 'charge') {
					if (rspeed < 5) {
						this.status = 'wait';
						this.timer = this.ctimer;
					}
				}
				if (rspeed >= 5) {
					this.r += 2;
				} else {
					this.r -= 2;
				}
				if (this.r < 40) this.r = 40;
				if (this.r > this.maxr) this.r = this.maxr;
				this.rot1 += Math.PI/10 * rspeed / this.cspeed;
				this.rot2 -= Math.PI/10 * rspeed / this.cspeed;
				for(var i=0;i<10;i++) {
					ang = this.rot1 + i / 10 * 2 * Math.PI;
					this.b[i].x = Math.cos(ang) * this.r;
					this.b[i].y = Math.sin(ang) * this.r;
					this.b[i].ang = ang + Math.PI/2;
				}
				for(var i=10;i<18;i++) {
					ang = this.rot2 + i / 8 * 2 * Math.PI;
					this.b[i].x = Math.cos(ang) * this.r * 2 / 3;
					this.b[i].y = Math.sin(ang) * this.r * 2 / 3;
					this.b[i].ang = ang - Math.PI/2;
				}
				for(var i=0;i<18;i++) {
					a = this.b[i];
					if (col(cx+a.x-15,cy+a.y-15,30,30,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
						B.hit(this.dmg);
						B.vx += Math.cos(a.ang) * rspeed / 2;
						B.vy += Math.sin(a.ang) * rspeed / 2;
					}
				}
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				g.translate(this.x,this.y);
					g.translate(this.w/2,this.h/2);
						for(var i=0;i<this.b.length;i++) {
							g.drawImage(Images.spinout_blade,this.b[i].x-15,this.b[i].y-15,30,30);
						}
					g.translate(-this.w/2,-this.h/2);
					g.drawImage(Images.spinout,0,0,60,60);
				g.translate(-this.x,-this.y);
			}
		};
	},
	buzzkill : function(x,y) {
		d = Math.min(20,Math.max(0,B.diff-getRange0("buzzkill")));
		return { w : 150, h : 150, knockback : 1/300, hitTime : 0,
			name : "Buzzkill",
			boss : true,
			x : x - 75,
			y : y - 75,
			vx : 0,
			vy : 0,
			dmg : 7 + d*0.6,
			speed : 1.1 + 0.1*d,
			bspeed : 8+d*0.21,
			timer : 1000,
			pattern : -1,
			otimer : 1500-(d>20?20:d)*30,
			maxhp : 3000 + d*250,
			hp : 3000 + d*250,
			timermod : 0,
			mlist : ["megafly","beetle","charger","flyshoot"],
			hit : function(dmg) {
				lhp = this.hp;
				this.hp -= dmg;
				return [this.hp<=0,lhp];
			},
			kill : function() {
				cr.splashBlood(this.x+this.w/2,this.y+this.h/2,50,30);
			},
			step : function() {
				if (roomtrans) return;
				this.timer -= 25;
				if (this.timer <= 0) {
					if (this.pattern > -1) {
						if (this.pattern == 0 || this.pattern == 1) {
							ang = getAngle(B.x-this.x-75,B.y-this.y-75)-3*Math.PI/8;
							for(var i=0;i<5;i++) {
								ang += Math.PI/8;
								cr.createBullet(this.x+75-this.dmg,this.y+89-this.dmg,Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg,this.dmg*2);
							}
							this.timer = (this.pattern==0)?250:this.otimer;
							this.pattern = (this.pattern==0)?1:-1;
						} else if (this.pattern >= 2 && this.pattern <= 5) {
							ang = getAngle(B.x-this.x-75,B.y-this.y-75) + (this.pattern%2)*Math.PI/8;
							for(var i=0;i<8;i++) {
								ang += 2 * Math.PI / 8;
								cr.createBullet(this.x+75-this.dmg,this.y+89-this.dmg,Math.cos(ang)*this.bspeed,Math.sin(ang)*this.bspeed,this.dmg,this.dmg*2);
							}
							this.timer = (this.pattern<5)?250:this.otimer;
							this.pattern = (this.pattern<5)?(this.pattern+1):-1;
						}
					} else if (Math.random()<0.5 || cr.m.length > 4) {
						if (Math.random() < 0.5) {
							this.pattern = 0;
						} else {
							this.pattern = 2;
						}
					} else {
						ang = rab(0,2*Math.PI);
						mont = this.mlist[Math.floor(Math.random()*this.mlist.length)];
						cr.m.push(Monster[mont](this.x+75,this.y+89));
						cr.m[cr.m.length-1].vx += Math.cos(ang) * this.bspeed;
						cr.m[cr.m.length-1].vy += Math.sin(ang) * this.bspeed;
						this.timer = this.otimer + 400;
					}
				}
				ang = rab(0,2*Math.PI);
				this.vx += Math.cos(ang)*this.speed*rab(0.5,1);
				this.vy += Math.sin(ang)*this.speed*rab(0.5,1);
				this.vx *= 0.9;
				this.vy *= 0.9;
				this.x += this.vx;
				this.y += this.vy;
				this.iPart();
				if (col(this.x,this.y,this.w,this.h,B.x-B.r,B.y-B.r,B.r*2,B.r*2)) {
					B.hit(this.dmg);
					B.vx += this.vx*3;
					B.vy += this.vy*3;
				}
				if (this.hp <= 0) {
					this.kill();
					return false;
				}
				return true;
			},
			draw : function(g) {
				if (!B.dead) this.cstep = this.cstep>=4?0:this.cstep+0.5;
				if (Math.random()<0.8) this.cstate = this.cstate==-1?0.1:(this.cstate==0.1?1:(this.cstate==1?0:-1));
				g.translate(this.x,this.y);
					g.translate(75,75);
						g.fillStyle("rgba(255,255,255,0.5)");
						ang = Math.PI/5 + Math.PI/40 * this.cstate;
						for(var wing=0;wing<4;wing++) {
							if (wing == 1 || wing == 3) ang = -ang;
							aang = ang + Math.PI/20;
							g.globalAlpha(0.3);
							if (wing < 2) {
								g.rotate(aang);
									g.drawImage(Images.buzzkillwing,0,-30,106,50);
								g.rotate(-aang);
							} else {
								g.save();
								g.scale(-1,1);
								g.rotate(aang);
									g.drawImage(Images.buzzkillwing,0,-30,106,50);
								g.rotate(-aang);
								g.restore();
							}
							g.globalAlpha(1);
						}
					g.translate(-75,-75);
					g.drawImage(Images.buzzkill,35,75/2,80,75);
					imgw = 34;
					imgh = 17;
					if(this.timer <= 400) {
						imgw = Math.abs(this.timer)/400 * 20 + 14;
						imgh = Math.abs(this.timer)/400 * 14 + 3;
					}
					g.drawImage(Images.buzzkillmouth,75-imgw/2,89,imgw,imgh);
				g.translate(-this.x,-this.y);
			}
		};
	}
	
	
	
};





