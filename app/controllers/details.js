var fb = require('facebook');
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

function doToggleFavourite(e){
	if(arr){
		if(arr.payload.favorit === 0){
			arr = args.root.setFavourite(args.modelid);
		}else{
			arr = args.root.removeFavourite(args.modelid);
		}
		setFavText(arr.payload.favorit);
	}else{
		Ti.API.info("arr is null");
	}
	//args.modelid
	args.root.doListUpdate();
}

function doDialUp(e){
	//Ti.API.info($.phone.phonenumber);
	Titanium.Platform.openURL("tel:" + $.phone.phonenumber);
}

function doFindRoute(e){
	alert(L("notimplemetedinbeta"));
}

function doBuyTicket(e){
	alert(L("notimplemetedinbeta"));
}

function setFavText(val){
	if(val == 0){
		$.favourite.title = L("addtofavourites");
	}else{
		$.favourite.title = L("removefromfavourites");
	}
}

(function(){
	//events.fetch();
	arr = args.root.getArrangement(args.modelid);
	
	$.title.text = arr.payload.title;
	$.adresse.text = arr.payload.street1 + ", " + arr.payload.postal_code + " " + arr.payload.city;
	$.description.text = arr.payload.description; 	
	$.mainImage.image = arr.payload.image_medium_uri;
	$.phone.title = L("phone") + arr.payload.phone;
	$.phone.phonenumber = arr.payload.phone;
	setFavText(arr.payload.favorit);
	
	// Add the facebook button to the container view
	var likeButton = fb.createLikeButton({
		top: "12",
        height: "48", // Note: on iOS setting Ti.UI.SIZE dimensions prevents the button from being clicked
        width: "100%",
        objectId: "https://www.facebook.com/smartdjursland",
        objectType: 'page', // iOS only
        foregroundColor: "white",
        //likeViewStyle: 'button',
        likeViewStyle: 'box_count',
        auxiliaryViewPosition: 'left',
        horizontalAlignment: 'center',
        soundEnabled: true // iOS only
	});
	$.fb_button_view.add(likeButton);	
	
})();