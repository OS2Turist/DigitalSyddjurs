var args = arguments[0] || {};
var kategorier = Alloy.Collections.instance("Kategori");
var arrangementer = Alloy.Collections.Arrangement;

function cleanup() {
	args = null;
	kategorier = null;
	arrangementer = null;
    $.destroy();
    $.off();
}

function doItemclick(e){
	//Ti.API.info("doItemClick " + e.itemId +" " + JSON.stringify(e));
	//if(e.accessoryClicked){
		// Show the detail window and using $model to pass data
		var args = {"modelid": e.itemId};
		var detailwin = Alloy.createController("details", args).getView();
		detailwin.open({transition: Titanium.UI.iPhone.AnimationStyle.CURL_UP});	
	//}		
}

function refreshList(){
	var kat_arr = kategorier.getSelectedArray(Ti.Locale.currentLanguage);
	arrangementer.setSortField("distance", "ASC");
	arrangementer.sort();
	arrangementer.fetchWithKategoriFilter(kat_arr);
}

function languageFilter(collection) {
	return collection.where({language: Ti.Locale.currentLanguage});
}


function formatDistance(rawdist){
	if(rawdist > 999){
		return (rawdist / 1000).toFixed(1).toLocaleString() + " km";
	}else{
		return rawdist + "  m";
	}
}

function formatData(model){
	 var transform = model.toJSON();
	 transform.distanceString = formatDistance(transform.distance);
	 return transform;
}

(function(){
	$.settingsmenu.init({parentController: $});

	kategorier.on('sync', function(){
		refreshList();
	});

	arrangementer.on('sync', function(){
		refreshList();
	});
	refreshList();
})();
