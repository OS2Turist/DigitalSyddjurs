var args = arguments[0] || {};
var pinurl = "/map/purplepin_20x55.png";

var firstfocus = true;
// Centreret på djursland
var defaultlocation = {latitude:56.369152, longitude:10.583272,latitudeDelta:0.7, longitudeDelta:0.7};

this.init = function(params){
	args = params;
};


function cleanup() {
	args = null;
	mapview = null;
	pinurl = null;
	firstfocus = null;
	defaultlocation = null;
    $.destroy();
    $.off();
}


function clickNotation(e){
	Alloy.createController("details", {"modelid": e.source.arr_id, root: args.parent}).getView().open({transition: Titanium.UI.iPhone.AnimationStyle.CURL_UP});
}

function createAnnotationImage(payload){
	return Ti.UI.createImageView({
		id: payload.id, 
		image: payload.image_thumbnail_uri,
		width: 60,
		height: 60
	});
}

function createAnnotationButton(id){
	var btnview = Ti.UI.createView({
		width: "60",
		height: "60",
		layout: "composite"
	});
	var btn = Ti.UI.createButton({
		arr_id: id,
		title: ">>",
		width:"40",
		height: "40",
		top: "0",
		color: "#595959",
		font: {fontFamily:'HelveticaNeue'}
	});
	btn.addEventListener("click", clickNotation);
	btnview.add(btn);
	return btnview;
}

function updateAnnotation(ann, payload){
	ann.applyProperties({
		arr_id: payload.id,
	    latitude: payload.latitude,
	    longitude: payload.longitude,
	    title: payload.title,
	    image: pinurl,
	    leftView: createAnnotationImage(payload),
	    rightView:  createAnnotationButton(payload.id),
	    animate: true,
	    draggable:false
	});	
}

function createAnnotation(payload){
	var pin = Alloy.Globals.Map.createAnnotation({
		arr_id: payload.id,
	    latitude: payload.latitude,
	    longitude: payload.longitude,
	    title: payload.title,
	    image: pinurl,
	    leftView: createAnnotationImage(payload),
	    rightView: createAnnotationButton(payload.id),
	    animate: true,
	    draggable:false
	});
	mapview.addAnnotation(pin);

}

var mapview = Alloy.Globals.Map.createView({
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
	
	mapview.addEventListener("click",function(evt){
		//Ti.API.info("Annotation " + evt.title + " clicked, id: " + evt.annotation.arr_id);
	});
	
	// Create the button that centers the map on the device
	var centerButton = Ti.UI.createImageView({
		image: "CenterDirection50.png",
		bottom: 10,
		right: 10
	});
	centerButton.addEventListener("click", centerOnMe);
	mapview.add(centerButton);
})();
