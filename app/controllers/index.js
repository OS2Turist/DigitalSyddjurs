var servicelistener = require("ServiceListener");
var categories = Alloy.Collections.instance("Kategori");
var events = Alloy.Collections.instance("Arrangement");
var masterarr = [];

function cleanup() {
	servicelistener = null;
	masterarr = null;
	categories.off('sync');
	categories = null;
	events = null;
	Ti.App.removeEventListener("geofacade:location", updateArrangementer);
    $.destroy();
    $.off();
}

function updateArrangementer(e){
	//
	masterarr = e.trackpoints;
	events.fetch();
	updateList();
}

this.getArrangement = function(id){
	return _.find(masterarr, function(point){
		return point.payload.id === id;
	});
};

this.setFavourite = function(id){
	Ti.API.info("1 events: " + JSON.stringify(events));
	var event = events.get(id); 
	Ti.API.info("2 event: " + JSON.stringify(event));
	event.setFavourite();
	var p = _.find(masterarr, function(point){
		return point.payload.id === id;
	});
	p.payload.favorit = 1;
	return p;
};

this.removeFavourite = function(id){
	events.get(id).removeFavourite();
	var p = _.find(masterarr, function(point){
		return point.payload.id === id;
	});
	p.payload.favorit = 0;
	return p;
};

function updateList(){
	var selected = categories.getSelectedArray();
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
	
	categories.on('sync', function(){
		updateList();
	});
	
	events.fetch();
})();
