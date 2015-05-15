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

	kh.loadKategorier(kh.processKategorier);	
	ah.loadArrangementer(ah.processArrangementer);
	timer = setInterval(function(){
		kh.loadKategorier(kh.processKategorier);	
		ah.loadArrangementer(ah.processArrangementer);
	}, 300000);
}

module.exports = ServiceListener;