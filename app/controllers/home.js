var args = arguments[0] || {};

function doTest(e){
	Ti.API.info(JSON.stringify(Alloy.Globals.Tracker.currentPosition));	
}


/**
 * Update the range of the scanner
 */
function doChangeKm(e){
	$.lblKmSetting.text = String.format("%d", e.value) + " KM";
	$.win.title = L('hometitle') + " " + String.format("%d", e.value) + " KM";
}

(function(){
	doChangeKm($.sldKmSetting);	
})();


