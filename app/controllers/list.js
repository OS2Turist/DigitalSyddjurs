var args = arguments[0] || {};

this.init = function(params){
	args = params;
};

function cleanup() {
	args = null;
    $.destroy();
    $.off();
}
function doItemclick(e){
	Alloy.createController("details", {"modelid": e.itemId, root: args.parent}).getView().open({transition: Titanium.UI.iPhone.AnimationStyle.CURL_UP});
}

function doRowAction(e){
	if(e.action == L("removefromfavourites")){
		args.parent.removeFavourite(e.itemId);
	}else if(e.action == L("addtofavourites")){
		args.parent.setFavourite(e.itemId);
	}
	args.parent.doListUpdate();
}

function doFocus(e){
	if(args.parent){
		args.parent.doListUpdate();
	}
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
		Ti.API.info("favorit "+ point.payload.favorit);
		var formatted_distance = formatDistance(point.distance);
		var action_arr = [];
		if(parseInt(point.payload.favorit) == 1){
			// This is a favorite, offer to remove from favourites
			action_arr.push({color: "red", style: Titanium.UI.iOS.ROW_ACTION_STYLE_DEFAULT, title: L("removefromfavourites")});
		}else{
			action_arr.push({color: "green", style: Titanium.UI.iOS.ROW_ACTION_STYLE_DEFAULT, title: L("addtofavourites")});
			// Other way around
		}
		dataSet.push({ 
			properties:{
				itemId: point.payload.id,
				canEdit: true,
				editActions: action_arr, 
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
