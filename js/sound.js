
var soundmok = false;
function waitForSoundM() {
	if (soundmok) {
		soundok=true;
		return loadSounds();
	}
	setTimeout(waitForSoundM,25);
}
var soundok = false;
var music = true;
var bgmusic = true;
soundManager.setup({
	url: 'sound/swf/',
	useFlashBlock: false,
	onready: function() {
		setInterval(bgloop,25);
		soundmok = true;
	},
	debugMode: false,
	debugFlash: false
});

var vol = 100;
var S = {};
var Sobj = {};
var sarr = [["buzz","flybuzz.mp3",50],
			["woosh","woosh.mp3",30],
			["heart","woosh2.mp3",80]];
var bgmusicvol = [500,50,500,350];
for(var i=0;i<bgmusicvol.length;i++) {
	sarr.push(["bgmusic"+i,"main"+i+".mp3",bgmusicvol[i]]);
}

var multsounds = [["shoot",10,"shoot.mp3",100],["laser",20,"laser.mp3",25]];
var _ms_ = {};
for(var i=0;i<multsounds.length;i++) {
	ms = multsounds[i];
	for(var j=0;j<ms[1];j++) {
		sarr.push([ms[0]+j,ms[2],ms[3],ms[4]]);
	}
	_ms_[ms[0]] = [0,ms[1]];
}
function playSound(sound) {
	if (!soundok) return;
	if (S[sound]) {
		S[sound].play();
	}
}
function MultiPlay(sound) {
	if (!soundok) return;
	_ms_[sound][0] = _ms_[sound][0]==_ms_[sound][1]-1?0:_ms_[sound][0]+1;
	sname = sound+_ms_[sound][0];
	if (S[sname]) {
		if (S[sname].playState == 0) {
			S[sname].play();
		}
	}
}

function loadSound(obj) {
	Sobj[obj[0]] = {
		v : isNaN(obj[2])?vol:obj[2],
		av : isNaN(obj[2])?vol:obj[2],
		s : '',
		t : 'a',
		ov : 0
	};
	S[obj[0]] = soundManager.createSound({
		id: obj[0],
		url: 'sound/'+obj[1],
		autoLoad: true,
		autoPlay: false,
		onload: $.isFunction(obj[3])?obj[3]:function(){},
		volume: isNaN(obj[2])?vol:obj[2]
	});
}
function loadSounds() {
	for(var i=0;i<sarr.length;i++) {
		loadSound(sarr[i]);
	}
}

function updateVolume() {
	if (!soundok) return;
	c.s('vol',ovol);
	c.s('bgvol',obgvol);
	for(i in S) {
		S[i].setVolume(Sobj[i].av=Math.round(Sobj[i].v*window['o'+((i.indexOf("bgmusic")>-1)?"bg":"")+'vol']));
	}
}

var bgfadeout = false;
var ogvol = false;
var voltrans = 1;
var loopbg = false;
var bgm = 0;
function bgloop() {
	if (!soundok) return;
	if (loopbg) {
		for(var bgi=0;bgi<bgmusicvol.length;bgi++) {
			if (Sobj["bgmusic"+bgi].s == '') {
				if (bgi == bgm && S["bgmusic"+bgi].playState == 0) {
					S["bgmusic"+bgi].play();
				} else if (bgi != bgm && S["bgmusic"+bgi].playState > 0) {
					S["bgmusic"+bgi].stop();
				}
			}
			if (Sobj["bgmusic"+bgi].s == 'fi') {
				if (isNaN(Sobj["bgmusic"+bgi].t)) {
					Sobj["bgmusic"+bgi].t = -1;
					Sobj["bgmusic"+bgi].ov = Sobj["bgmusic"+bgi].av;
				}
				if (Sobj["bgmusic"+bgi].t >= 0 && S["bgmusic"+bgi].playState == 0) {
					S["bgmusic"+bgi].play();
				}
				Sobj["bgmusic"+bgi].t += 0.03;
				newvol = Math.round(Sobj["bgmusic"+bgi].ov * Sobj["bgmusic"+bgi].t);
				S["bgmusic"+bgi].setVolume((newvol<0)?0:newvol);
				if (Sobj["bgmusic"+bgi].t >= 1) {
					Sobj["bgmusic"+bgi].t = 'a';
					Sobj["bgmusic"+bgi].s = '';
					S["bgmusic"+bgi].setVolume(Sobj["bgmusic"+bgi].ov);
				}
			} else if (Sobj["bgmusic"+bgi].s == 'fo') {
				if (isNaN(Sobj["bgmusic"+bgi].t)) {
					Sobj["bgmusic"+bgi].t = 1;
					Sobj["bgmusic"+bgi].ov = Sobj["bgmusic"+bgi].av;
				}
				Sobj["bgmusic"+bgi].t -= 0.03;
				newvol = Math.round(Sobj["bgmusic"+bgi].ov * Sobj["bgmusic"+bgi].t);
				S["bgmusic"+bgi].setVolume(newvol);
				if (Sobj["bgmusic"+bgi].t <= 0) {
					if (lastfade) {
						loopbg = false;
						lastfade = false;
					}
					Sobj["bgmusic"+bgi].t = 'a';
					Sobj["bgmusic"+bgi].s = '';
					S["bgmusic"+bgi].stop();
					S["bgmusic"+bgi].setVolume(Sobj["bgmusic"+bgi].ov);
				}
			}
		}
	}
}
lastfade = false;
var waitbg = false;
function nextBG() {
	if (!soundok) return;
	Sobj["bgmusic"+bgm].s = 'fo';
	bgm++;
	if (bgm >= bgmusicvol.length) bgm = 0;
	Sobj["bgmusic"+bgm].s = 'fi';
}
function stopBG() {
	if (!soundok) return;
	Sobj["bgmusic"+bgm].s = 'fo';
	lastfade = true;
}
function startBG() {
	loopbg = true;
	bgm = Math.floor(Math.random()*bgmusicvol.length);
}














