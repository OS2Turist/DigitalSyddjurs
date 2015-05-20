var geolib = require("geolib");
var args = arguments[0] || {};
var arrangementer = Alloy.Collections.instance("Arrangement");
var kategorier = Alloy.Collections.instance("Kategori");
var listloadinprogress = false;
var curpos = null;

function doItemclick(e){
	Ti.API.info("ItemClicked " + e.section.getItemAt(e.itemIndex).rowView.model );
	if(e.accessoryClicked){
		// Show the detail window and using $model to pass data
		var args = {"modelid": e.section.getItemAt(e.itemIndex).rowView.model};
		var detailwin = Alloy.createController("details", args).getView();
		detailwin.open();	
	}	
}

function formatDistance(rawdist){
	if(rawdist > 999){
		return (rawdist / 1000).toFixed(1).toLocaleString() + " km";
	}else{
		return rawdist + "  m";
	}
}

function loadEventList(position){
	if(position){
		listloadinprogress = true;
		var kat_arr = kategorier.getSelectedArray();
		arrangementer.fetchWithKategoriFilter(kat_arr);
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
			var dist = formatDistance(arrangement.get("distance"));
			arr.push({ 
				properties: prop,
				rowView: {model: arrangement.get("id")},
				title: {text: arrangement.get("title"), color: "#000"},
				distance: {text: dist, color: '#000'},
				arrimage: {image: arrangement.get("imageuri"), width: 50, height:50, borderRadius: 25}
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
	
	kategorier.on('sync', function(){
		loadEventList(curpos);	
	});
	


})();
