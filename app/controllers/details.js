var args = arguments[0] || {};

function doClose(e){
	args = null;
	$.off();
	$.destroy();
}

function doClickBack(e){
	if(OS_IOS){
		$.navwin.close();		
	}else{
		$.win.close();
	}
}


function addImage(url){
	if(url ? url != "" : false){
		var img = Ti.UI.createImageView({
			image: url, width: "40%", height: Ti.UI.SIZE, borderRadius: 8, borderWidth: 0
		});	
		$.maincontainer.add(img);
	}	
}

function addLabel(labelbody){
	if(labelbody ? labelbody != "" : false){
		var wlv = Ti.UI.createView({
			top: 5,
			layout: "vertical",
			width: "90%",
			height: Titanium.UI.SIZE,
			backgroundColor: "#fff",
			borderRadius: 8,
			borderWidth: 0
		});
		wlv.add(Ti.UI.createLabel({
			text: labelbody,
			width: "90%",
			height: Titanium.UI.SIZE,
			backgroundColor: "#fff",
			color: "#595959",
			font: {fontFamily:'HelveticaNeue'}
		}));
		$.maincontainer.add(wlv);
	}
}

(function(){
	var arr = Alloy.Collections.Arrangement.get(args.modelid);
	
	addLabel(arr.get("title"));
	addImage(arr.get("image_medium_uri"));	
	addLabel(arr.get("subtitle"));
	addLabel(arr.get("description"));
	addLabel(arr.get("street1"));
	addLabel(arr.get("street2"));
	addLabel(arr.get("postal_code") + " " + arr.get("city"));
	addLabel(arr.get("url"));
	addLabel(arr.get("email"));
	addLabel(arr.get("phone"));
})();