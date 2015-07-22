var servicelistener = require("ServiceListener");
var masterarr = [];

function cleanup() {
	servicelistener = null;
	masterarr = null;
	Ti.App.removeEventListener("geofacade:location", updateArrangementer);
    $.destroy();
    $.off();
}

function updateArrangementer(e){
	//
	masterarr = e.trackpoints;
	updateList();
}

function updateList(){
	var selected = Alloy.Collections.instance("Kategori").getSelectedArray();
	//Ti.API.info(JSON.stringify(selected));
	var arr = _.filter(masterarr, function(point){
		return _.contains(selected, point.payload.kategori);
	});
	$.listwin.updateList(arr);
	$.mapwin.updateAnnotations(arr);
	$.homewin.updateHome(arr);
}

(function(){
	Ti.App.addEventListener("geofacade:location", updateArrangementer);
	var sl = new servicelistener();
	$.index.open();
	
	Alloy.Collections.instance("Kategori").on('sync', function(){
		updateList();
	});
	

})();
