// i'm just gonna stick the credits thing on the main menu here
var rl_=(" (the code guy)").split(""),
	si_=("(the art guy) ").split(""),
	rlnum = 0,
	sinum = 0,
	rlover = false,
	siover = false,
	rlover2 = false,
	siover2 = false;
$(document).ready(function() {
	$('#mm #credits #rl').mouseenter(function() {rlover = true;})
						 .mouseleave(function() {rlover = false;});
	$('#mm #credits #rl_').mouseenter(function() {rlover2 = true;})
						 .mouseleave(function() {rlover2 = false;});
	$('#mm #credits #si').mouseenter(function() {siover = true;})
						 .mouseleave(function() {siover = false;});
	$('#mm #credits #si_').mouseenter(function() {siover2 = true;})
						 .mouseleave(function() {siover2 = false;});
	setInterval(function() {
		(rlover||rlover2)?(rlnum+=2):(rlnum-=2);
		(siover||siover2)?(sinum+=2):(sinum-=2);
		if (rlnum < 0) rlnum = 0;
		if (sinum < 0) sinum = 0;
		if (rlnum > rl_.length) rlnum = rl_.length;
		if (sinum > si_.length) sinum = si_.length;
		str = "";
		for(var i=0;i<rlnum;i++) {
			str += rl_[i];
		}
		$('#mm #credits #rl_').html(str);
		str = "";
		for(var i=0;i<sinum;i++) {
			str = si_[si_.length-i-1] + str;
		}
		$('#mm #credits #si_').html(str);
	},35);
});



denykeys = [79,80];
dkeynames = ["left","up","right","down"];
var keys = {
	move_left : 65,
	move_up : 87,
	move_right : 68,
	move_down : 83,
	shoot_left : 37,
	shoot_up : 38,
	shoot_right : 39,
	shoot_down : 40,
	item_1 : 49,
	item_2 : 50,
	item_3 : 51,
	item_use : 32,
	minimap : 77
};
var keydata = {
	active : -1,
	key_blocks : {
		move_left : [40,180],
		move_up : [70,150],
		move_right : [100,180],
		move_down : [70,180],
		shoot_left : [165,180],
		shoot_up : [195,150],
		shoot_right : [225,180],
		shoot_down : [195,180],
		item_1 : [40,255],
		item_2 : [80,255],
		item_3 : [120,255],
		item_use : [40,330],
		minimap : [300,330]
	},
	SUPPORTED : {
		9 : 'tab',
		13 : 'enter',
		16 : 'shift',
		17 : 'ctrl',
		18 : 'alt',
		20 : 'caps',
		32 : 'space',
		37 : '<',
		38 : '^',
		39 : '>',
		40 : '|',
		189 : '-'
	}
};
var key_alpha = ("abcdefghijklmnopqrstuvwxyz").split("");
for(i in key_alpha) {
	keydata.SUPPORTED[parseInt(i)+65] = key_alpha[i];
}
for(var i=0;i<10;i++) {
	keydata.SUPPORTED[i+48] = i+"";
	keydata.SUPPORTED[i+96] = "n"+i;
}
for(i in keys) {
	c.i("key_"+i,keys[i]);
	keys[i] = c.g("key_"+i);
}


var optionpage = 1;
var totaloptpages = 3;
var ovol = c.i("vol",1),
	obgvol = c.i("bgvol",1);

function showOptionMenu() {
	vis.opt = true;
	$('#options').css('opacity',0).css('display','block').animate({
		opacity: 1
	},400);
	drawOptions();
}

function hideOptionsMenu() {
	try {
		$('#options').css('display','block').animate({
			opacity: 0
		},400,function() {
			$(this).css('display','none');
			vis.opt = false;
		});
	} catch(e) {}
}

var sizes = [0.5,0.75,1,1.25,1.5,1.75,2,-1];
function drawOptions() {
	optg.fillStyle("rgb(210,210,210)");
	optg.fillRect(0,0,400,400);
	L.drawWord("OPTIONS",optg,43,30,35,35,"rgb(50,50,50)");
	L.drawWord("X",optg,380,5,15,15,"rgb(50,50,50)");
	optg.strokeStyle("rgb(0,0,0)");
	optg.fillStyle("rgb(80,80,80)");
	optg.beginPath();optg.moveTo(0,82);optg.lineTo(400,82);optg.stroke();
	for(var i=0;i<totaloptpages;i++) {
		if (i == optionpage-1) optg.fillRect(i*40,82,40,22);
		optg.strokeRect(i*40,82,40,22);
		L.drawWord((i+1)+"",optg,14+i*40,87,12,12);
	}
	if (optionpage == 3) {
		optg.strokeStyle("rgb(0,0,0)");
		optg.fillStyle("rgb(150,150,150)");
		optg.strokeRect(60,180,280,140);
		optg.fillRect(60,180,280,140);
		L.drawWord("Clear All\n  Data",optg,73,214,21,31);
	} else if (optionpage == 2) {
		L.drawWord("Key Config",optg,190,104,15,15);
		for(i in keydata.key_blocks) {
			pos = keydata.key_blocks[i];
			if (keydata.active == i) optg.fillRect(pos[0],pos[1],30,30);
			optg.strokeRect(pos[0],pos[1],30,30);
			keycode = keys[i];
			keydisplay = keydata.SUPPORTED[keycode];
			keydisplaylength = keydisplay.split("").length;
			//L.drawWord(keydisplay,optg,pos[0]+2,pos[1]+10,12,12);
			if (keydisplaylength == 1) L.drawWord(keydisplay,optg,pos[0]+8,pos[1]+10,12,12);
			if (keydisplaylength == 2) L.drawWord(keydisplay,optg,pos[0]+4,pos[1]+10,9,12);
			if (keydisplaylength == 3) L.drawWord(keydisplay,optg,pos[0]+3,pos[1]+10,6,12);
			if (keydisplaylength == 4) L.drawWord(keydisplay,optg,pos[0]+3,pos[1]+10,4,12);
			if (keydisplaylength == 5) L.drawWord(keydisplay,optg,pos[0]+2,pos[1]+11,3.5,10);
		}
		L.drawWord("move",optg,56,220,12,12);
		L.drawWord("shoot",optg,173,220,12,12);
		L.drawWord("item select",optg,40,295,12,12);
		L.drawWord("item use",optg,80,340,12,12);
		L.drawWord("minimap",optg,260,310,12,12);
	} else if (optionpage == 1) {
		optg.translate(0,10);
			L.drawWord("Game Window Size",optg,17,109,12,12,"rgb(50,50,50)");
			for(var i=0;i<4;i++) {
				optg.strokeStyle("rgb(0,0,0)");
				if (currentsize == sizes[i]) {
					optg.strokeStyle("rgb(0,0,255)");
				}
				optg.translate(17+i*95,128);
					optg.strokeRect(0,0,80,65);
					L.drawWord(Math.round(600*sizes[i])+"",optg,22,12,10,10,"rgb(0,0,0)");
					L.drawWord("x",optg,35,27,11,11,"rgb(0,0,0)");
					L.drawWord(Math.round(500*sizes[i])+"",optg,22,42,10,10,"rgb(0,0,0)");
				optg.translate(-17-i*95,-128);
			}
			for(var i=0;i<4;i++) {
				optg.strokeStyle("rgb(0,0,0)");
				optg.translate(17+i*95,200);
				i += 4;
				if (currentsize == sizes[i]) {
					optg.strokeStyle("rgb(0,0,255)");
				}
					if (i == 7) {
						stickoutx = 27;
						stickouty = 22;
						optg.beginPath();
							optg.moveTo(stickoutx,0);
							optg.lineTo(0,0);
							optg.lineTo(0,stickouty);
							optg.moveTo(0,65-stickouty);
							optg.lineTo(0,65);
							optg.lineTo(stickoutx,65);
							optg.moveTo(80-stickoutx,65);
							optg.lineTo(80,65);
							optg.lineTo(80,65-stickouty);
							optg.moveTo(80,stickouty);
							optg.lineTo(80,0);
							optg.lineTo(80-stickoutx,0);
							optg.stroke();
						L.drawWord("FULL",optg,19,19,9,9,"rgb(0,0,0)");
						L.drawWord("SCREEN",optg,6,36,9,9,"rgb(0,0,0)");
					} else {
						optg.strokeRect(0,0,80,65);
						L.drawWord(Math.round(600*sizes[i])+"",optg,22-(Math.round(600*sizes[i])>999?9:0),12,10,10,"rgb(0,0,0)");
						L.drawWord("x",optg,35,27,11,11,"rgb(0,0,0)");
						L.drawWord(Math.round(500*sizes[i])+"",optg,22-(Math.round(500*sizes[i])>999?9:0),42,10,10,"rgb(0,0,0)");
					}
				i -= 4;
				optg.translate(-17-i*95,-200);
			}
			L.drawWord("Sound",optg,17,274,11,11,"rgb(0,0,0)");
			L.drawWord("Background Music",optg,17,314,11,11,"rgb(0,0,0)");
			optg.fillStyle('rgb(0,0,0)');
			optg.fillRect(17,297,280,3);
			optg.fillRect(17,337,280,3);
			optg.fillStyle('rgb(100,100,100)');
			optg.fillRect(17+125*ovol,289,30,18);
			optg.fillRect(17+125*obgvol,329,30,18);
			L.drawWord("Tutorial "+(c.g("tutorial")?"On":"Off"),optg,55,362,12,12,"rgb(0,0,0)");
			optg.strokeStyle("rgb(0,0,0)");
			optg.strokeRect(17,358,20,20);
			if (c.g("tutorial")) {
				optg.beginPath();
				optg.moveTo(17,358);
				optg.lineTo(37,378);
				optg.moveTo(37,358);
				optg.lineTo(17,378);
				optg.stroke();
			}
		optg.translate(0,-10);
	}
	
}
/* OLD HELP var htrans = false;
var hout = false;
$(document).ready(function() {
	$("#help #bar").bind('mousedown',function() {
		if (htrans) return;
		htrans = true;
		$('#help').animate({
			left : hout?-302:0
		},500,function(){htrans = false; hout = !hout;});
	});
});

        <div id="help">
        	<div id="bar">?</div>
            <div id="content">
            	Welcome to Swarm!<br><br>
                To move, use the WASD keys.<br>
                To fire, use the arrow keys.<br><br>
                At the top left are your stats for<br>
                HP, Attack, Speed, Firing rate,<br>
                Bullet speed, and coins.<br><br>
                The boxes 1-3 can hold items.<br>
                Press 1-3 to switch between them,<br>
                and spacebar to use them.<br>
                Finishing rooms recharges items.<br><br>
                There are normal rooms, [S] Shop,<br>
                [B] Boss Room, [C] Challenge Room,<br>
                [P] Powerup Room, Health Room, and<br>
                [F] Finish room, which is unlocked<br>
                when you complete all rooms on a floor<br><br>
                At the top right is a minimap of<br>
                the entire floor, M to enlarge.<br><br>
                Getting achievements can unlock<br>
                items and characters.<br><br>
                Ingame, options and pause are at<br>
                the bottom right. Or keys O and P.<br><br>
                Play and see how many floors<br>
                you can survive!<br><br><br><br><br><br>
                a game by Roger Li
            </div>
        </div> */






