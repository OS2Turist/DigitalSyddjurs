var args = arguments[0] || {};

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

(function(){
	$.favourite_events.fetch();
})();