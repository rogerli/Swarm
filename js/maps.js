var m = [];
var mw, mh;

var maps = [[0,0],[0,1],[1,1],[1,2],[-1,0],[-1,-1]];
var gmap_posit = [[-1,0],[0,-1],[1,0],[0,1]];

var roomtrans = false;
var nextfloor = false, nftrans = 1;
var rtr = 0;
var nrdir,nrx,nry;

function goToRoom(dir) {
	if (roomtrans || !bk[dir]) return;
	B.rattack = 0;
	B.rfiring = 0;
	B.rspeed = 0;
	B.rshotspeed = 0;
	roomtrans = true;
	rtr = 0;
	nrdir = dir;
	npos = gmap_posit[dir];
	nrx = B.rx + npos[0];
	nry = B.ry + npos[1];
	nrmoved = false;
	nkeepx=nkeepy=false;
	B.vx = 0;
	B.vy = 0;
	m[nrx][nry].bullets = [];
	m[nrx][nry].bulletsplash = [];
	m[nrx][nry].smoke = [];
	if (dir == 0 || dir == 2) nkeepy = true;
	else nkeepx = true;
}

function generateMap(rooms) {
	var gmap = new Array();
	gmap.push([0,0,ROOMS.STARTING]);
	lx=lxy=ly=lyx=hx=hxy=hy=hyx=0;
	for(var i=0;i<rooms-2;i++) {
		while(true) {
			num = Math.floor(Math.random()*gmap.length);
			room = gmap[num];
			posit_ind = Math.floor(Math.random()*gmap_posit.length);
			newdir = gmap_posit[posit_ind];
			newcoords = [room[0]+newdir[0],room[1]+newdir[1]];
			alreadyexist = false;
			for(var j=0;j<gmap.length;j++) {
				if (newcoords[0] == gmap[j][0] && newcoords[1] == gmap[j][1]) {
					alreadyexist = true;
					break;
				}
			}
			if(alreadyexist) continue;
			gmap.push([newcoords[0],newcoords[1],ROOMS.NORMAL]);
			if (newcoords[0] < lx || (newcoords[0] == lx && Math.random()<0.5)) {lx = newcoords[0]; lxy = newcoords[1];}
			if (newcoords[0] > hx || (newcoords[0] == hx && Math.random()<0.5)) {hx = newcoords[0]; hxy = newcoords[1];}
			if (newcoords[1] < ly || (newcoords[1] == ly && Math.random()<0.5)) {ly = newcoords[1]; lyx = newcoords[0];}
			if (newcoords[1] > hy || (newcoords[1] == hy && Math.random()<0.5)) {hy = newcoords[1]; hyx = newcoords[0];}
			break;
		}
	}
	var posar = [[0,lx,lxy],[1,lyx,ly],[2,hx,hxy],[3,hyx,hy]];
	for(var _looproom=0;_looproom<3;_looproom++) {
		posi = Math.floor(Math.random()*posar.length);
		pd = posar[posi][0];
		px = posar[posi][1];
		py = posar[posi][2];
		px += gmap_posit[pd][0];
		py += gmap_posit[pd][1];
		gmap.push([px,py,ROOMS.NORMAL]);
		
		posar.splice(posi,1);
	}
	gmap = designMap(gmap);
	m = getMapArr(gmap);
	mw = m.length;
	mh = m[0].length;
}

function designMap(rooms) {
	r = rooms;
	for(var i=0;i<r.length;i++) {
		rx = r[i][0];
		ry = r[i][1];
		adjrooms = 0;
		for(var j=0;j<r.length;j++) {
			if (i == j) continue;
			isadj = false;
			for(var k=0;k<gmap_posit.length;k++) {
				nrx = rx + gmap_posit[k][0];
				nry = ry + gmap_posit[k][1];
				if (nrx == r[j][0] && nry == r[j][1]) {
					isadj = true; break;
				}
			}
			if (isadj) adjrooms++;
		}
		r[i][3] = adjrooms;
	}
	// [3] = # adjacent rooms
	dist = 0; farth = 0;
	for(var i=0;i<r.length;i++) {
		if (r[i][3] == 1 && r[i][2] == ROOMS.NORMAL) {
			rx = r[i][0];
			ry = r[i][1];
			if (Math.sqrt(rx*rx+ry*ry) > dist) {
				dist = Math.sqrt(rx*rx+ry*ry);
				farth = i;
			}
		}
	}
	r[farth][2] = ROOMS.COMPLETE;
	dist = 0; farth = 0;
	for(var i=0;i<r.length;i++) {
		if (r[i][3] == 1 && r[i][2] == ROOMS.NORMAL) {
			rx = r[i][0];
			ry = r[i][1];
			if (Math.sqrt(rx*rx+ry*ry) > dist) {
				dist = Math.sqrt(rx*rx+ry*ry);
				farth = i;
			}
		}
	}
	r[farth][2] = ROOMS.BOSS;
	dist = 0; farth = 0;
	for(var i=0;i<r.length;i++) {
		if (r[i][3] == 1 && r[i][2] == ROOMS.NORMAL) {
			rx = r[i][0];	
			ry = r[i][1];
			if (Math.sqrt(rx*rx+ry*ry) > dist) {
				dist = Math.sqrt(rx*rx+ry*ry);
				farth = i;
			}
		}
	}
	r[farth][2] = ROOMS.SECRET;
	while(true && chalon != "miser") {
		rind = Math.floor(Math.random()*r.length);
		if (r[rind][2] == ROOMS.NORMAL) {
			rooms[rind][2] = ROOMS.SHOP;
			break;
		}
	}
	while(true && chalon != "powerfree") {
		rind = Math.floor(Math.random()*r.length);
		if (r[rind][2] == ROOMS.NORMAL) {
			rooms[rind][2] = ROOMS.POWERUP;
			break;
		}
	}
	while(true && chalon != "heartbreak") {
		rind = Math.floor(Math.random()*r.length);
		if (r[rind][2] == ROOMS.NORMAL) {
			rooms[rind][2] = ROOMS.HEALTH;
			break;
		}
	}
	while(true) {
		rind = Math.floor(Math.random()*r.length);
		if (r[rind][2] == ROOMS.NORMAL) {
			rooms[rind][2] = ROOMS.CHALLENGE;
			break;
		}
	}
	
	return r;
}

function getMapArr(marr) {
	var offx=0,offy=0,mw=2,mh=2;
	for(var i=0;i<marr.length;i++) {
		if (marr[i][0] < offx) offx = marr[i][0];
		if (marr[i][1] < offy) offy = marr[i][1];
		if (marr[i][0]+1 > mw) mw = marr[i][0]+1;
		if (marr[i][1]+1 > mh) mh = marr[i][1]+1;
	}
	var grooms = new Array();
	mw -= offx;
	mh -= offy;
	for(var i=0;i<mw;i++) {
		grooms[i] = new Array();
		for(var j=0;j<mh;j++) {
			grooms[i][j] = false;
		}
	}
	for(var i=0;i<marr.length;i++) {
		mr = marr[i];
		mr[0] -= offx;
		mr[1] -= offy;
		grooms[mr[0]][mr[1]] = {
			x : mr[0],
			y : mr[1],
			init : false,
			complete : false,
			exist : true,
			type : mr[2],
			adjNum : mr[3],
			dopen : 1
		};
	}
	return grooms;
}










