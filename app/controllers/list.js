var geolib = require("geolib");
var args = arguments[0] || {};
var arrangementer = Alloy.Collections.instance("Arrangement");
var listloadinprogress = false;
var curpos = null;

function doItemclick(e){
	Ti.API.info("ItemClicked");	
}

function loadEventList(position){
	if(position){
		listloadinprogress = true;
		arrangementer.fetchForCurrentLanguage(Ti.Locale.getCurrentLanguage());
		arrangementer.each(function(arrangement){
			var dist = geolib.getDistance(
		    	{latitude: parseFloat(arrangement.get("latitude")), longitude: parseFloat(arrangement.get("longitude"))},
		    	position
			);
			arrangement.set({distance: dist});
		});
		arrangementer.setSortField("distance", "ASC");
		arrangementer.sort();
		
		var arr = [];
		var prop = {};
		var col = {};
		arrangementer.each(function(arrangement){
			prop = {height: Ti.UI.SIZE, backgroundColor: "#FFF", accessoryType: Ti.UI.LIST_ACCESSORY_TYPE_DETAIL};
			arr.push({ 
				properties: prop,
				rowView: {model: arrangement.get("id")},
				title: {text: arrangement.get("title"), color: "#000"},
				distance: {text: arrangement.get("distance"), color: '#000'}
				//arrimage: {image: arrangement.get("imageuri")}
				
				//subtitle: {text: arrangement.get("subtitle"), color: "#000"}	
			});
		});
		$.lvEvents.sections[0].setItems(arr);	
		listloadinprogress = false;
	}else{
		Ti.API.info("Location not set");
	}
}

(function(){

	$.settingsmenu.init({parentController: $});

	// save the currentPosition
	Ti.Geolocation.getCurrentPosition(function(position){
		curpos = {"latitude": position.coords.latitude, "longitude": position.coords.longitude};
		loadEventList(curpos);
	});
	
	Ti.App.addEventListener("Tracker:locationchanged", function(e){
		// The location has changed, reload the list
		Ti.API.info("Tracker:locationchanged: " + JSON.stringify(e));
		// save the current position
		if(!listloadinprogress){
			loadEventList(curpos);	
		}
	});
	
	Ti.App.addEventListener("ServiceListener:listdatachanged", function(e){
		// The data has changed, reload the list with the current position
		if(!listloadinprogress){
			loadEventList(curpos);	
		}
	});


})();
