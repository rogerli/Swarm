var noitem = ("Half Dollar,First Aid Kit").split(",");
function activateItem(name) {
	for(var i=0;i<noitem.length;i++) {
		if (noitem[i] == name) {
			return noitem.splice(i,1);
		}
	}
}
var unlocks = [
	["Rookie","Play a Game","",function() {return cr.type != ROOMS.STARTING;}],
	["First Floor","Finish a floor","",function() {return B.floor>1;}],
	["Consumer","Buy something from a shop",""],
	["Miser","Have at least 75 coins","Half Dollar Unlocked",function(){return B.coin>=75;},function(){activateItem("Half Dollar");},true],
	["Avarice","Have at least 150 coins","+7 Coin Start",function() {return B.coin>=150;}],
	["Family Bank","Have at least 300 coins","+7 Coin Start",function() {return B.coin>=300;}],
	["Wall Street","Have at least 600 coins","+9 Coin Start",function() {return B.coin>=600;}],
	["Powerhouse","Have at least 30 attack","Bees Unlocked",function() {return B.nattack>=30;},function() {c.s("bees_unl",true);}],
	["The Offensive","Have at least 80 attack","+1 Attack Start",function() {return B.nattack>=80;}],
	["Machine Gun","Have at least 30 firing","Locusts Unlocked",function() {return B.nfiring>=30;},function() {c.s("locusts_unl",true);}],
	["Rapid Fire","Have at least 80 firing","+1 Firing Start",function() {return B.nfiring>=80;}],
	["NASCAR","Have at least 35 speed","Butterflies Unlocked",function() {return B.nspeed>=35;},function() {c.s("butterflies_unl",true);}],
	["Healthy","Have at least 75 max hp","First Aid Kit Unlocked",function() {return B.maxhp>=75;},function(){activateItem("First Aid Kit");},true],
	["Health Hoarder","Have at least 150 hp","Ladybug Unlocked",function() {return B.hp>=150;},function() {c.s("ladybugs_unl",true);}],
	["Purity","Finish a floor without taking any powerups",""],
	["Double Digits","Make it to floor 10 on medium","Moths Unlocked",function() {return difficulty==2&&B.floor>=10;},function() {c.s("moths_unl",true);}],
	//["Double Digit God","Make it to floor 10 on hard","Moths Unlocked",function() {return difficulty==3&&B.floor>=10;},function() {c.s("moths_unl",true);}],
	["Suicidal","Die 100 times","",function() {return parseInt(c.g('deathcount'))>=100;}],
	["Deadly","Die 300 times","",function() {return parseInt(c.g('deathcount'))>=300;}],
	["Reincarnation","Die 750 times","",function() {return parseInt(c.g('deathcount'))>=750;}],
	["Resurrection","Die 2000 times","Wow.",function() {return parseInt(c.g('deathcount'))>=2000;}],
	["Untouchable","Finish a hard floor without getting hurt","+1/5 HP Start"],
	["Evasive","Finish 2 hard floors without getting hurt","+1/5 HP Start"],
	["Ninja Bug","Finish 3 hard floors without getting hurt","+2/5 HP Start"],
	["Who Needs Them","Finish floor 5 on hard on challenge Power Free","-5 Powerup Cost in Shop",function(){return chalon=="powerfree"&&B.floor>5&&difficulty==3;}],
	["Lovesick","Finish floor 5 on medium on challenge Heart Breaker","+5 HP Start",function(){return chalon=="heartbreak"&&B.floor>5&&difficulty==2;}],
	["Lost Love","Finish floor 4 on hard on challenge Heart Breaker","+1/5 HP Start",function(){return chalon=="heartbreak"&&B.floor>4&&difficulty==3;}],
	["Forever Alone","Finish floor 10 on hard on challenge Heart Breaker","+2/5 HP Start",function(){return chalon=="heartbreak"&&B.floor>10&&difficulty==3;}],
	["Banking","Finish floor 7 on hard on challenge The Miser","-3 Cost on Upgrades in Shop",function(){return chalon=="miser"&&B.floor>7&&difficulty==3;}],
	["Stroke of Luck","Finish floor 10 on hard on challenge Stunned","10% of shots do +50% damage",function(){return chalon=="stun"&&B.floor>10&&difficulty==3;}],
	["Fall of the Titans","Finish floor 7 on hard on challenge The Duo","-7% All Bosses Health",function(){return chalon=="duo"&&B.floor>7&&difficulty==3;}],
	["Power Path","Finish floor 6 on hard on challenge Self Destruct","-4 Powerup Cost in Shop",function(){return chalon=="self"&&B.floor>6&&difficulty==3;}],
	["Big Game Trophy","Finish floor 7 on hard on challenge Big Game Hunter","-8% All Bosses Health",function(){return chalon=="biggame"&&B.floor>7&&difficulty==3;},
	["Overload","Finish floor 11 on hard on challenge Self Destruct","-4 Powerup Cost in Shop",function(){return chalon=="self"&&B.floor>11&&difficulty==3;}]]
];
// ach name, str requirement, str complete, [bumped in bool ach complete], function check, function complete, bool func on startup
var ach_trans = 0;
var ach_timer = 0;
var ach_text, ach_text2;
for(var i=0;i<unlocks.length;i++) {
	unlocks[i].splice(3,0,c.i("ach"+unlocks[i][0],false));
	if (!unlocks[i][4]) {
		unlocks[i][4] = function(){return false;}
	}
	if (!unlocks[i][5]) {
		unlocks[i][5] = function(){}
	}
	if (unlocks[i][3] && unlocks[i][6] === true) {
		unlocks[i][5]();
	}
}

maxunlh = unlocks.length*39-314;
unloff = 0;
barh = 100;
barypos = 0;

function seekAch(name) {
	for(var _i=0;_i<unlocks.length;_i++) {
		if (unlocks[_i][0] == name) {
			return _i;
		}
	}
	return -1;
}
var hurt = 0, powertaken = 0;
function unlVars() {
	powertaken = 0;
	hurt = 0;
}
function unlNewGame() {
	
	unlVars();
}
function unlockAch(i) {
	unlocks[i][3] = true;
	c.s("ach"+unlocks[i][0],true);
	ach_text = unlocks[i][0];
	ach_text2 = unlocks[i][2];
	ach_timer = 5000;
}
function unlNextFloor() {
	i = seekAch("Purity")
	if (!c.g("achPurity") && powertaken == 0) {
		unlockAch(i);
	}
	i = seekAch("Untouchable");
	j = seekAch("Evasive");
	k = seekAch("Ninja Bug");
	if (hurt == 0 && difficulty == 3) {
		if (!c.g("achUntouchable")) unlockAch(i);
		if (!c.g("achEvasive") && B.floor > 2) unlockAch(j);
		if (!c.g("achNinja Bug") && B.floor > 3) unlockAch(k);
	}
	unlVars();
}
function checkUnlocks() {
	for(var i=0;i<unlocks.length;i++) {
		if (unlocks[i][3]) continue;
		if (unlocks[i][4]()) {
			unlocks[i][5]();
			unlockAch(i);
		}
	}
}

$(".ach .all, .ach .f, .ach .unf").click(function() {
	var mask = parseInt($(this).attr("mask"));
	var el = $(this).parent().find('.box > div').each(function() {
		var done = ($(this).attr("done")=="true");
		if (mask == 1 ||
			(mask == 2 && done) ||
			(mask == 3 && !done)) $(this).css("display","block");
		else $(this).css("display","none");
	});
});

function showAchMenu() {
	unloff = 0;
	barypos = 0;
	vis.ach = true;
	$('#ach').css('opacity',0).css('display','block').animate({
		opacity: 1
	},400);
	drawAch();
	$('.ach .box').html("");
	for(var i=0;i<unlocks.length;i++) {
		var d = $("<div>").attr("ind",i);
		d.css({
			width:440,
			marginLeft : 20,
			marginTop : 10,
			marginBottom : 10
		});
		var e = $("<span>").html(unlocks[i][0]+"<br>").attr("class","a");
		e.css({
			cursor:"pointer",
			textDecoration : unlocks[i][3]?"line-through":"none",
			fontWeight:"bold"
		});
		var f = $("<span>").html(unlocks[i][1]+((unlocks[i][2].length > 0)?("<br>Reward: "+unlocks[i][2]):"")).css({
			position:"relative",
			left:10
		});
		d.append(e);
		d.append(f);
		d.attr("done",unlocks[i][3]);
		$(".ach .box").append(d);
	}
}

function hideAchMenu() {
	try {
		$('#ach').css('display','block').animate({
			opacity: 0
		},400,function() {
			$(this).css('display','none');
			vis.ach = false;
		});
	} catch(e) {}
}

function drawAch() {return;
	achg.fillStyle("rgb(210,210,210)");
	achg.fillRect(0,0,500,400);
	if (unlocks.length > 8) {
		r = barypos / (317-barh);
		unloff = r * maxunlh;
		achg.fillStyle("rgb(50,50,50)");
		achg.fillRect(470,68+barypos,20,barh);
		achg.beginPath();
			achg.moveTo(470,68);
			achg.lineTo(470,385);
			achg.stroke();
	}
	achg.translate(0,-unloff);
	for(var i=Math.floor(unloff/39);i<unlocks.length&&i<Math.ceil(unloff/39)+8;i++) {
		achg.strokeStyle("rgb(0,0,0)");
		achg.strokeRect(22,76+i*39,27,27);
		if (unlocks[i][3]) {
			achg.beginPath();
			achg.moveTo(22,76+i*39);
			achg.lineTo(49,103+i*39);
			achg.moveTo(49,76+i*39);
			achg.lineTo(22,103+i*39);
			achg.stroke();
		}
		L.drawWord(unlocks[i][0],achg,64,83+i*39,10,12);
	}
	achg.translate(0,unloff);
	achg.fillStyle("rgb(210,210,210)");
	achg.fillRect(0,0,500,68);
	achg.fillRect(0,385,500,15);
	achg.strokeStyle("rgb(50,50,50)");
	achg.strokeRect(10,68,480,317);
	L.drawWord("ACHIEVEMENTS",achg,39,26,27,27,"rgb(50,50,50)");
	L.drawWord("X",achg,480,5,15,15,"rgb(50,50,50)");
	if (overach > -1) {
		achg.fillStyle("rgb(240,240,240)");
		achg.fillRect(overachx,overachy-3,unlocks[overach][1].split("").length*10+22,20);
		L.drawWord(unlocks[overach][1],achg,overachx+17,overachy+3,7,9,"rgb(0,0,0)");
	}
}
















