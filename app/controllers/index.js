var servicelistener = require("ServiceListener");
var arrangementer = Alloy.Collections.instance("Arrangement");

(function(){
	var sl = new servicelistener();
	
	
	// Set up the GPS tracking
	Titanium.Geolocation.setDistanceFilter(100);
	Ti.Geolocation.addEventListener("location", function(e){
		// Default location if running on simulator  55.487276, 9.471406
		//var coords = {"latitude": parseFloat("55.487276"), "longitude": parseFloat("9.471406")};
		Ti.API.info("location change triggered");
		arrangementer.updateDistanceAndSync(e.coords);
	});
	
	$.index.open();
})();
