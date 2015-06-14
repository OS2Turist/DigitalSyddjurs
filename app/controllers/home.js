var args = arguments[0] || {};
var arrangementer = Alloy.Collections.Arrangement;
var kategorier = Alloy.Collections.instance("Kategori");

function cleanup() {
    $.destroy();
}

/**
 * Helper function to randomize bubble position
 */
function getRandomPercentage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min + "%";
}
/**
 * Update the range of the scanner
 */
function doChangeKm(e){
	$.lblKmSetting.text = String.format("%d", $.sldKmSetting.value) + " KM";
	$.win.title = L('hometitle') + " " + String.format("%d", $.sldKmSetting.value) + " KM";
	if(e){
		updateGui();		
	}
}

function doClickBubble(e){
	var args = {"modelid": e.source.modelid};
	var detailwin = Alloy.createController("details", args).getView();
	detailwin.open({transition: Titanium.UI.iPhone.AnimationStyle.CURL_UP});
}

function getPositionAndSize(distance){
	size = {};
	if(distance <= 1000){
		size = {side: 80, radius: 40};
	}else if(distance > 1000 && size < 2000){
		size = {side: 60, radius: 30};
	}else if(distance > 2000 && size < 4000){
		size = {side: 40, radius: 20};
	}else{
		size = {side: 20, radius: 10};
	}
	size.left = getRandomPercentage(10, 70);
	size.top = getRandomPercentage(10, 70);
	return size;
}

function rangeFilter(collection){
	return collection.filter(function(mod){
		return (parseInt(mod.get("distance")) <= ($.sldKmSetting.value * 1000)); 
	});
}

function transformData(model){
	var transform = model.toJSON();
	var size = getPositionAndSize(transform.distance);
	transform.left = size.left;
	transform.top = size.top;
	transform.width = size.side;
	transform.height = size.side;
	transform.radius = size.radius;
	return transform;
}

function updateGui(){
	var kat_arr = kategorier.getSelectedArray();
	//arrangementer.setSortField("distance", "ASC");
	//arrangementer.sort();
	arrangementer.fetchWithKategoriFilter(kat_arr);
}

(function(){
	
	// add sync listeners to the model
	arrangementer.on('sync', function(){
		//Ti.API.info("Hey the Collection changed! do something");
		updateGui();
	});
	kategorier.on('sync', function(){
		//Ti.API.info("Hey the Collection changed! do something");
		updateGui();
	});
	
	
	// pass reference to the required menu view
	$.settingsmenu.init({parentController: $});
	//doChangeKm();


	updateGui();
	$.win.title = L('hometitle') + "4 KM";


})();


