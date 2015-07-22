var kategorihandler = require("KategoriHandler");
var arrangementhandler = require("ArrangementHandler");

function ServiceListener(callback){
	var _this = this;
	var _callback = callback;
	var timer = null;
	var user = {
	    name: "app",
	    pass: "app"
	};
	// Load the kategories, this will continue to run on a timer
	var kh = new kategorihandler(user, "http://os2turist.bellcom.dk/", "app"); 
	var ah = new arrangementhandler(user, "http://os2turist.bellcom.dk/", "app");

	this.updateTrackPoints = function(arr){
		//Ti.API.info("updateTrackPoints " + JSON.stringify(arr));
		var tparray = [];
		_.each(arr, function(rec){
			tparray.push({id: rec.id, latitude: rec.latitude, longitude: rec.longitude, distance: -1, withinrange: false, payload: rec}); 
		});
		
		Alloy.Globals.geofacade.setTrackPoints(tparray);
		Alloy.Globals.geofacade.startTracking();
	};
	
	this.loadKategorierFromService = function(){
		kh.loadKategorier(function(data){
			kh.processKategorier(data);	
		});	
	};
	
	this.loadArrangementerFromService = function(){
		ah.loadArrangementer(function(json_obj){
			ah.processArrangementer(json_obj, function(language_specific_array){
				// now we have loaded and stored data from the service, time to update the track points
				_this.updateTrackPoints(language_specific_array);
			});	
		});
	};
	
	// first we load what we have in the database
	ah.getArrangementerAsArray(function(arr){
		_this.updateTrackPoints(arr);
		// then we call the service
		_this.loadArrangementerFromService();
	
	});
	
	kh.getKategorierAsArray(function(kat_arr){
		_this.loadKategorierFromService();		
	});
	
	// and we keep checking in with the service every 30 minutes
	timer = setInterval(function(){
		_this.loadArrangementerFromService();
		_this.loadKategorierFromService();	
	}, 1800000);
	
	
}

module.exports = ServiceListener;