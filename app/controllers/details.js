var args = arguments[0] || {};
var arr = null;

function doClose(e){
	args = null;
	arr = null;
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

function doLinkFB(e){
	Ti.Platform.openURL("https://www.facebook.com");
}

function doToggleFavourite(e){
	if(arr.get("favorit") == 0){
		arr = arr.setFavourite();
	}else{
		arr = arr.removeFavourite();
	}
	setFavText(arr.get("favorit"));
}

function doDialUp(e){
	//Ti.API.info($.phone.phonenumber);
	Titanium.Platform.openURL("tel:" + $.phone.phonenumber);
}

function setFavText(val){
	if(val == 0){
		$.favourite.title = L("addtofavourites");
	}else{
		$.favourite.title = L("removefromfavourites");
	}

}

(function(){
	arr = Alloy.Collections.Arrangement.get(args.modelid);
	
	$.title.text = arr.get("title");
	$.adresse.text = arr.get("street1") + ", " + arr.get("postal_code") + " " + arr.get("city");
	$.description.text = arr.get("description"); 	
	$.mainImage.image = arr.get("image_medium_uri");
	$.phone.title = L("phone") + arr.get("phone");
	$.phone.phonenumber = arr.get("phone");
	setFavText(arr.get("favorit"));
})();