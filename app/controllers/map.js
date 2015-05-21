var args = arguments[0] || {};
var arrangementer = Alloy.Collections.instance("Arrangement");
var kategorier = Alloy.Collections.instance("Kategori");

var firstfocus = true;
// We do not need the best accuracy, so lets save some power
Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
// Centreret på djursland
var defaultlocation = {latitude:56.369152, longitude:10.583272,latitudeDelta:0.7, longitudeDelta:0.7};

var mapview = Alloy.Globals.Map.createView({
	id: "mapview",
	zIndex: -1,
	mapType: Alloy.Globals.Map.NORMAL_TYPE,
	region: defaultlocation, 
    animate:true,
    regionFit:true,
    userLocation:true
});

function loadAnnotations(){
	var pins = [];
	var kat_arr = kategorier.getSelectedArray();
	if(mapview){
		mapview.removeAllAnnotations();
		arrangementer.fetchWithKategoriFilter(kat_arr);
		arrangementer.each(function(arrangement){
			
			var img = Ti.UI.createImageView({
				id: arrangement.get("id"), 
				image: arrangement.get("imageuri"),
				width: 40,
				height: 40,
				borderRadius: 20,
			});
			img.addEventListener('click', function(e){
					var args = {"modelid": e.source.id};
					var detailwin = Alloy.createController("details", args).getView();
					detailwin.open({transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});	
			});
			var pin = Alloy.Globals.Map.createAnnotation({
				titleid: arrangement.get("id"),
			    latitude: arrangement.get("latitude"),
			    longitude: arrangement.get("longitude"),
			    title: arrangement.get("title"),
			    rightView: img,
			    animate: true,
			    draggable:false
			});
			pins.push(pin);
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
	$.win.add(mapview);

	mapview.add(centerButton);
	// Load the locations and events
	
	
	loadAnnotations();
	
	kategorier.on('sync', function(){
		loadAnnotations();
		//Ti.API.info("change fired on kategorier");
	});
	
})();
