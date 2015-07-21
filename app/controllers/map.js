var args = arguments[0] || {};

var firstfocus = true;
// Centreret på djursland
var defaultlocation = {latitude:56.369152, longitude:10.583272,latitudeDelta:0.7, longitudeDelta:0.7};

function cleanup() {
	args = null;
	kategorier = null;
	arrangementer = null;
	firstfocus = null;
	defaultlocation = null;
    $.destroy();
    $.off();
}

function doClickAnnotation(e){
	Ti.API.info("Annotation clicked");
	Alloy.createController("details", {"modelid": e.source.id}).getView().open({transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});
}

var mapview = Alloy.Globals.Map.createView({
	id: "mapview",
	zIndex: -1,
	mapType: Alloy.Globals.Map.NORMAL_TYPE,
	region: defaultlocation, 
    animate:true,
    regionFit:true,
    userLocation:true,
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
});

$.updateAnnotations = function(arr){
	var pins = [];
	if(mapview){
		mapview.removeAllAnnotations();
		_.each(arr,function(point){
			var img = Ti.UI.createImageView({
				id: point.payload.id, 
				image: point.payload.image_thumbnail_uri,
				width: 60,
				height: 60,
				borderRadius: 30,
			});
			//img.addEventListener('click', doClickAnnotation);
			img.addEventListener('click', function(e){
				Ti.API.info("Someone clicked a map");
			});
			var pin = Alloy.Globals.Map.createAnnotation({
				titleid: point.payload.id,
			    latitude: point.payload.latitude,
			    longitude: point.payload.longitude,
			    title: point.payload.title,
			    rightView: img,
			    animate: true,
			    draggable:false
			});
			//pin.addEventListener('click', doClickAnnotation);
			pins.push(pin);
		});
		mapview.addAnnotations(pins);
	}
};

// Center on device
function centerOnMe(){
	Ti.Geolocation.getCurrentPosition(function(e){
		if(e.success){
			mapview.setLocation({latitude: e.coords.latitude, longitude: e.coords.longitude, animate: true});
		}else{
			Ti.API.info("Error code: " + e.code + " Error message: " + e.error);	
		}
	});	
}

// wait a few and then center on current location
function doFocus(e){
	if(firstfocus){
		setTimeout(function(){
			centerOnMe(null);
		}, 3000);
		firstfocus = false;		
	}
}

(function(){
	$.settingsmenu.init({parentController: $});
	// Add the map to the window
	$.win.add(mapview);
	
	// Create the button that centers the map on the device
	var centerButton = Ti.UI.createImageView({
		image: "CenterDirection50.png",
		bottom: 10,
		right: 10
	});
	centerButton.addEventListener("click", centerOnMe);
	mapview.add(centerButton);
	
})();
