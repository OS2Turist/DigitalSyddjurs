var geolib = require("geolib");
var args = arguments[0] || {};
var arrangementer = Alloy.Collections.instance("Arrangement");
var listloadinprogress = false;

// MOCK, get the system language
var lan = Ti.Locale.currentLanguage;

function doItemclick(e){
	Ti.API.info("ItemClicked");	
}


var curpos = {latitude: 55.49015426635742, longitude: 9.47851276397705};

function loadEventList(){
	if(Alloy.Globals.Tracker.CurrentPosition){
		Ti.API.info(Alloy.Globals.Tracker.CurrentPosition);
		listloadinprogress = true;
		arrangementer.fetchForCurrentLanguage(Ti.Locale.getCurrentLanguage());
		arrangementer.each(function(arrangement){
			var dist = geolib.getDistance(
		    	{latitude: parseFloat(arrangement.get("latitude")), longitude: parseFloat(arrangement.get("longitude"))},
		    	Alloy.Globals.Tracker.CurrentPosition
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
	
	Ti.App.addEventListener("Tracker:locationchanged", function(e){
		// The location has changed, reload the list
		if(!listloadinprogress){
			//loadEventList();	
		}
	});
	
	Ti.App.addEventListener("ServiceListener:listdatachanged", function(e){
		// The data has changed, reload the list
		if(!listloadinprogress){
			//loadEventList();	
		}
	});
	
	//loadEventList();	
})();
