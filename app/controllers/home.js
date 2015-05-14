var args = arguments[0] || {};

function doTest(e){
	Ti.API.info(JSON.stringify(Alloy.Globals.Tracker.getCurrentPosition()));	
}


/**
 * Update the range of the scanner
 */
function doChangeKm(e){
	$.lblKmSetting.text = String.format("%d", e.value) + " KM";
	$.win.title = L('hometitle') + " " + String.format("%d", e.value) + " KM";
}


(function(){
	// pass reference to the required menu view
	$.settingsmenu.init({parentController: $});
	doChangeKm($.sldKmSetting);	
})();


