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
		doDataBind();		
	}
}

function doClickBubble(e){
	var args = {"modelid": e.source.modelid};
	var detailwin = Alloy.createController("details", args).getView();
	detailwin.open({transition: Titanium.UI.iPhone.AnimationStyle.CURL_UP});
}
var pos_arr = [];
function getPositionAndSize(distance, id){
	// have we rendered this one before?
	var pos = _.find(pos_arr, function(searchpos){ return searchpos.id == id; });
	//Ti.API.info("pos" + pos);
	if(!pos){

		pos = {};
		pos.id = id;
		pos.left = getRandomPercentage(10, 70);
		pos.top = getRandomPercentage(10, 70);
		//Ti.API.info("new pos generated " + pos);

	}
	if(distance <= 1000){
		pos.side = 80;
		pos.radius = 40;;
	}else if(distance > 1000 && distance < 2000){
		pos.side = 60;
		pos.radius = 30;;
	}else if(distance > 2000 && distance < 4000){
		pos.side = 40;
		pos.radius = 20;;
	}else{
		pos.side = 20;
		pos.radius = 10;;
	}
	pos_arr.push(pos);
	//Ti.API.info("pos returned " + JSON.stringify(pos));
	
	return pos;
}

function rangeFilter(collection){
	return collection.filter(function(mod){
		return (parseInt(mod.get("distance")) <= ($.sldKmSetting.value * 1000)); 
	});
}



function transformData(model){
	var transform = model.toJSON();
	var size = getPositionAndSize(transform.distance, transform.id);
	transform.left = size.left;
	transform.top = size.top;
	transform.width = size.side;
	transform.height = size.side;
	transform.radius = size.radius;
	return transform;
}


(function(){
	
	// add sync listeners to the model
	arrangementer.on('sync', function(){
		Ti.API.info("arrangement sync ");
		//doDataBind();
	});
	
	
	// pass reference to the required menu view
	$.settingsmenu.init({parentController: $});
	$.win.title = L('hometitle') + " 4 KM";
})();


