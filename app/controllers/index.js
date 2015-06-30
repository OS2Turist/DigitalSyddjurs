var servicelistener = require("ServiceListener");
var arrangementer = Alloy.Collections.instance("Arrangement");
var trackerrunning = false;
var lastsync = 0;

function cleanup() {
	servicelistener = null;
	arrangementer = null;
	trackerrunning = null;
	lastsync = null;
    $.destroy();
    $.off();
}


function startTracker(){
	// Set up the GPS tracking
	trackerrunning = true;
	Titanium.Geolocation.setDistanceFilter(20);
	Ti.Geolocation.addEventListener("location", function(e){
		var c = e.coords;
		if(!c){
			c = JSON.parse(Ti.Geolocation.getLastGeolocation());
		}
		if(c){
			// not faster than 1 location change every 10 seconds
			var timestamp = Math.floor(Date.now() / 1000);
			if((lastsync === 0) || ((timestamp - lastsync) > 10)){
				Ti.API.info("Loc: " + JSON.stringify(c));
				lastsync = timestamp;
				arrangementer.updateDistanceAndSync(c);
			}
		}else{
			Ti.API.info("NO LOCATION AVAILABLE - startTracker");
			// Distance is not updated
		}
	});
}


(function(){
	var sl = new servicelistener();
	if(Ti.Geolocation.getLocationServicesEnabled){
		if(!trackerrunning){
			startTracker();
		}
	}
	
	Ti.Geolocation.addEventListener("authorization", function (e){
		if(e.authorizationStatus > 2){
			// Authorized	
			if(!trackerrunning){
				startTracker();
			}
		}else{
			// Denied
			Ti.Geolocation.removeEventListener("location");
			trackerrunning = false;
		}
	});
	
	
	
	$.index.open();
})();
