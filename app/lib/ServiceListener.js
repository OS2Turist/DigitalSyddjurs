var kategorihandler = require("KategoriHandler");
var arrangementhandler = require("ArrangementHandler");

function ServiceListener(){
	var timer = null;
	var user = {
	    name: "app",
	    pass: "app"
	};
	
	// Load the kategories, this will continue to run on a timer
	var kh = new kategorihandler(user, "http://os2turist.bellcom.dk/", "app"); 
	var ah = new arrangementhandler(user, "http://os2turist.bellcom.dk/", "app");

	
	timer = setInterval(function(){
		kh.loadKategorier(kh.processKategorier);	
		ah.loadArrangementer(ah.processArrangementer);
		
	}, 30000);
	kh.loadKategorier(kh.processKategorier);	
	ah.loadArrangementer(ah.processArrangementer);
	ah.updateDistance();
}

module.exports = ServiceListener;