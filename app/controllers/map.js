var args = arguments[0] || {};
var arrangementer = Alloy.Collections.instance("Arrangement");

var firstfocus = true;
// We do not need the best accuracy, so lets save some power
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
// Centreret på djursland
var defaultlocation = {latitude:56.369152, longitude:10.583272,latitudeDelta:0.7, longitudeDelta:0.7};


var mapview = Alloy.Globals.Map.createView({
	id: "mapview",
	mapType: Alloy.Globals.Map.NORMAL_TYPE,
	region: defaultlocation, 
    animate:true,
    regionFit:true,
    userLocation:true
});

function loadAnnotations(){
	var pins = [];	 
	if(mapview){
		mapview.removeAllAnnotations();
		arrangementer.fetchForCurrentLanguage();
		arrangementer.each(function(arrangement){
			pins.push(Alloy.Globals.Map.createAnnotation({
				titleid: arrangement.get("id"),
			    latitude: arrangement.get("latitude"),
			    longitude: arrangement.get("longitude"),
			    title: arrangement.get("title"),
			    animate: true,
			    draggable:false
			}));
		});
		
		mapview.addAnnotations(pins);
	}
}

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


// Create the button that centers the map on the device
var centerButton = Ti.UI.createImageView({
	image: "CenterDirection50.png",
	bottom: 10,
	right: 10
});
centerButton.addEventListener("click", centerOnMe);


function doFocus(e){
	if(firstfocus){
		setTimeout(function(){
			centerOnMe(null);
		}, 3000);
		firstfocus = false;		
	}
}
// wait a few and then center on current location

(function(){
	// Add the map to the window
	$.mapwin.add(mapview);

	mapview.add(centerButton);
	// Load the locations and events
	
	loadAnnotations();
	
})();
