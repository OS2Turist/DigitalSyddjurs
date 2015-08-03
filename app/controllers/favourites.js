var args = arguments[0] || {};
var events = Alloy.Collections.Arrangement;
function cleanup() {
	args = null;
    $.destroy();
    $.off();
}

function favouritesFilter(collection) {
	return collection.where({language: Ti.Locale.currentLanguage, favorit: 1});
}

function doItemclick(e){
	Alloy.createController("details", {"modelid": e.itemId}).getView().open({transition: Titanium.UI.iPhone.AnimationStyle.CURL_UP});
}

function doFocus(){
	doUpdateFavourites();
}

(function(){
	events.fetch();
	doUpdateFavourites();
	
})();