var Images = {};
for(var i=0;i<imgs.length;i++) {
	Images[imgs[i][0]] = new Image();
	if (imgs[i][1].indexOf("image/png") > -1) {
		Images[imgs[i][0]].src = imgs[i][1];
	} else {
		Images[imgs[i][0]].src = "img/"+imgs[i][1]+".png";
	}
}