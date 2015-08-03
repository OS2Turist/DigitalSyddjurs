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

function doClickMap(e){
	Ti.API.info("Annotation clicked, source: " + e.clicksource);
	if(e.clicksource == "rightButton"){
		Ti.API.info("rightButton clicked");
	}
	//Alloy.createController("details", {"modelid": e.source.id}).getView().open({transition: Titanium.UI.iPhone.AnimationStyle.CURL_UP});
}

function updateAnnotation(ann, payload){
	var img = Ti.UI.createImageView({
		id: payload.id, 
		image: payload.image_thumbnail_uri,
		width: 60,
		height: 60,
		borderRadius: 30,
	});
	ann.applyProperties({
		arr_id: payload.id,
	    latitude: payload.latitude,
	    longitude: payload.longitude,
	    title: payload.title,
	    leftView: img,
	    //rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
	    animate: true,
	    draggable:false
	});	
}

function createAnnotation(payload){
	var img = Ti.UI.createImageView({
		arr_id: payload.id, 
		image: payload.image_thumbnail_uri,
		width: 60,
		height: 60,
		borderRadius: 30,
	});
	img.addEventListener("click", function(e){Ti.API.info("IMAGE CLICKED");});
	var pin = Alloy.Globals.Map.createAnnotation({
		arr_id: payload.id,
	    latitude: payload.latitude,
	    longitude: payload.longitude,
	    title: payload.title,
	    leftView: img,
	    //rightButton: Titanium.UI.iPhone.SystemButton.DISCLOSURE,
	    animate: true,
	    draggable:false
	});
	mapview.addAnnotation(pin);

}

mapview = Alloy.Globals.Map.createView({
	id: "mapview",
//	zIndex: -1,
	mapType: Alloy.Globals.Map.NORMAL_TYPE,
	region: defaultlocation, 
    animate:true,
    regionFit:true,
    userLocation:true,
    width: Ti.UI.FILL,
    height: Ti.UI.FILL
});

$.updateAnnotations = function(arr){
	// first we loop the current ones and remove the ones not in the new array
	_.each(mapview.annotations, function(ann){
		if(!_.find(arr, function(sp){return sp.payload.id == ann.arr_id;})){
			// not found, delete
			mapview.removeAnnotation(ann);
		}
	}); 

	// the we process the ones that are left 	
	_.each(arr, function(elem){
		var found_ann = _.find(mapview.annotations, function(searchpos){return searchpos.arr_id == elem.payload.id;});
		if(found_ann){
			var alteredflag = false;
			// yes it is, does it need updating?
			if(parseFloat(found_ann.latitude) != parseFloat(elem.payload.latitude)){
				alteredflag = true;
			}
			if(parseFloat(found_ann.longitude) != parseFloat(elem.payload.longitude)){
				alteredflag = true;
			}
			if(found_ann.title != elem.payload.title){
				alteredflag = true;
			}
			if(alteredflag){
				// Update the annotation	
				updateAnnotation(found_ann, elem.payload);
			}
		}else{
			// no it is not, create it
			createAnnotation(elem.payload);
		}
	});
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
