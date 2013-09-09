var Settings = {
	ghostb : false,
	melterb : false,
	pierceb : false,
	seekerb : false,
	vampire : 0,
	dup : false,
	reset : function() {
		this.dup = false;
		this.ghostb = false;
		this.vampire = 0;
		this.resetBulletExtras();
	},
	resetBulletExtras : function() {
		this.seekerb = false;
		this.melterb = false;
		this.pierceb = false;
	}
};
var showtext = 0;
var texttoshow = "";
var textsize = 0;
var forceAttach = false;

function attachItem(num,name,use,recharge) {
	var theitem = {
		n : num,
		name : name,
		bars : 0,
		f : use,
		recharge : recharge,
		t : 0,
		maxt : 0
	};
	if (!B.items[B.onitem] || forceAttach===true) {
		B.items[B.onitem] = theitem;
	} else {
		openspace = false;
		for(var j=0;j<3;j++) {
			if (j != B.onitem) {
				if (!B.items[j]) {
					openspace = true;
					B.items[j] = theitem;
					break;
				}
			}
		}
		if (!openspace) {
			B.items[B.onitem] = theitem;
		}
	}
}

var Powerups = {
	"Rocket Launcher" : function() {
		Settings.resetBulletExtras();
		B.attachWeapon("rocketlauncher");
	},
	"Vampires Curse" : function() {
		Settings.vampire++;
	},
	"Shield Force" : function(n) {
		attachItem(n,"Shield Force",function(){this.t=B.inv=10000;B.specialinv=true;},7);
	},
	"Heart Generator" : function(n) {
		attachItem(n,"Heart Generator",function(){
			while (true) {
				rad = rab(40,100);
				ang = rab(0,2*Math.PI);
				ncx = B.x + Math.cos(ang)*rad;
				ncy = B.y + Math.sin(ang)*rad;
				if (ncx < 20 || ncy < 20 || ncx > 580 || ncy > 380) continue;
				coll = false;
				for(var j=0;j<cr.rock.length;j++) {
					if (col(cr.rock[j].x,cr.rock[j].y,cr.rock[j].w,cr.rock[j].h,ncx-10,ncy-10,20,20)) {
						coll = true;
						break;
					}
				}
				if (!coll) {
					cr.heart.push({
						x : ncx,
						y : ncy,
						t : (Math.random()<0.2)?5:1,
						s : 0,
						stat : 'expand'
					});
					break;
				}
			}
		},2);
	},
	"Seeker" : function() {
		B.attachWeapon("shot");
		if (Settings.seekerb) return B.setAttack(B.nattack+10);
		Settings.seekerb = true;
	},
	"Laser" : function() {
		B.attachWeapon("laser");
	},
	"Vengeance" : function(n) {
		attachItem(n,"Vengeance",function(){B.rattack+=Math.floor(B.attack*1.5);},9);
	},
	"Winds" : function(n) {
		attachItem(n,"Winds",function(){B.rspeed=B.speed;},2);
	},
	"Ion Cannon" : function(n) {
		attachItem(n,"Ion Cannon",function(){B.tfiring=B.firing*4;this.t=B.timf=3000;},10);
	},
	"First Aid Kit" : function(n) {
		attachItem(n,"First Aid Kit",function(){B.heal(Math.ceil(Math.max(10,B.maxhp/9)));},7);
	},
	"Excalibur" : function(n) {
		attachItem(n,"Excalibur",function(){B.rattack+=B.attack;B.rfiring+=Math.ceil(B.firing*0.7);},6);
	},
	"Half Dollar" : function() {
		B.coin += 50;
	},
	"Flame Thrower" : function() {
		Settings.resetBulletExtras();
		B.attachWeapon("flamethrower");
	},
	"Speedball" : function() {
		B.setShotSpeed(B.nshotspeed+8);
	},
	"Ghosty" : function() {
		if (Settings.ghostb) return B.setAttack(B.nattack+10);
		Settings.ghostb = true;
	},
	"Strong Acid" : function() {
		if (Settings.melterb) return B.setAttack(B.nattack+12);
		Settings.melterb = true;
		B.setAttack(B.nattack+7);
	},
	"Piercer" : function() {
		if (Settings.pierceb) return B.setAttack(B.nattack+10);
		Settings.pierceb = true;
	},
	"Rush" : function() {
		B.setSpeed(B.nspeed + 8);
	},
	"Obesity" : function() {
		B.setMaxHP(15);
		B.setSpeed(B.nspeed - 1);
	},
	"Turret" : function() {
		B.attachWeapon("turret");
	},
	"Infestation" : function() {
		B.changeBugs(B.bugs + 3);
	},
	"Steroids" : function() {
		B.setAttack(B.nattack + 6);
		B.setFiring(B.nfiring + 5);
	},
	"Knockout" : function() {
		B.setAttack(B.nattack + 4);
		B.knockback += 4;
	}
};
var Items = [];
for(i in Powerups) {
	if (!Powerups.hasOwnProperty(i)) continue;
	Items.push(i);
}
function randomItem() {
	//return 0;
	while (true) {
		ind = Math.floor(Math.random()*Items.length);
		indok = true;
		for(var i=0;i<noitem.length;i++) {
			if (noitem[i] == Items[ind]) {
				indok = false;
				break;
			}
		}
		if (indok) return ind;
	}
}









