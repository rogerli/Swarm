var itemimgs = ("rocketlauncher,vampirescurse,shieldforce,heartgenerator,seeker,laser,vengeance,winds,ioncannon,firstaid,excalibur,halfdollar,flamethrower,speedball,ghostbullet,strongacid,piercer,rush,obesity,turret,infestation,steroids,"+
				"knockout").split(",");
var imgs = [["coin","coin"],["chalcoin","chalcoin"],
			["flyshoot","flyshoot"],["flyfrag","flyfrag"],["telefly","telefly"],
			["beetle","beetle"],["beetleshoot","beetleshoot"],
			["charger","charger"],["bombfly","bombfly"],["bouncer","bouncer"],["bouncer2","bouncer2"],
			["buzzer","buzzer"],["buzzermouth","buzzermouth"],["buzzerwing","buzzerwing"],
			["buzzkill","buzzkill"],["buzzkillmouth","buzzkillmouth"],["buzzkillwing","buzzkillwing"],
			["spinout","spinout/head"],["spinout_blade","spinout/blade"],["asteroid","asteroid"],["spiraler","spiraler"],
			["mine","mine"],["minefactory","minefactory"],["gsmall","gemini"]];
for(var i=0;i<itemimgs.length;i++) {
	imgs.push(["item"+i,"items/"+itemimgs[i]]);
}
