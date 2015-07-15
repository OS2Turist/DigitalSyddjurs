var args = arguments[0] || {};

function cleanup() {
	args = null;
    $.destroy();
    $.off();
}
function doItemclick(e){
	Alloy.createController("details", {"modelid": e.itemId}).getView().open({transition: Titanium.UI.iPhone.AnimationStyle.CURL_UP});
}

function formatDistance(rawdist){
	if(rawdist > 999){
		return (rawdist / 1000).toFixed(1).toLocaleString() + " km";
	}else{
		return rawdist + "  m";
	}
}

$.updateList = function(trackpoints){
	var dataSet = [];
	_.each(trackpoints, function(point){
		//<ListItem itemId="{id}" template="{template}" arrimage:image="{image_thumbnail_uri}" title:text="{title}" searchableText="{title}"
		// distance:text="{distanceString}" accessoryType="Titanium.UI.LIST_ACCESSORY_TYPE_DETAIL"/>
		var formatted_distance = formatDistance(point.distance);
		dataSet.push({ 
			properties:{
				itemId: point.payload.id,
				template: "template",
				searchableText: point.payload.title,
				accessoryType: "Titanium.UI.LIST_ACCESSORY_TYPE_DETAIL"
			},
    		arrimage: {image: point.payload.image_thumbnail_uri},
    		title: {text: point.payload.title},
    		distance: {text: formatted_distance}
        });
	});
	$.lvEvents.sections[0].setItems(dataSet);   	
	
};

function refreshList(){
	//var kat_arr = kategorier.getSelectedArray(Ti.Locale.currentLanguage);
	/*
	arrangementer.setSortField("distance", "ASC");
	arrangementer.sort();
	arrangementer.fetchWithKategoriFilter(kat_arr);
	*/
	
}

(function(){
	$.settingsmenu.init({parentController: $});
	/*

	*/
})();
