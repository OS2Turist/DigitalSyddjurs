var servicelistener = require("ServiceListener");
var arrangementer = Alloy.Collections.instance("Arrangement");

(function(){
	var sl = new servicelistener();
	
	
	// Set up the GPS tracking
	Titanium.Geolocation.setDistanceFilter(100);
	Ti.Geolocation.addEventListener("location", function(e){
		Ti.API.info("location change triggered");
		arrangementer.updateDistanceAndSync(e.coords);
	});
	
	$.index.open();
})();
