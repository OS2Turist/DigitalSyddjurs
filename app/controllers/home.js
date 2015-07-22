var args = arguments[0] || {};
var masterarr = [];

function cleanup() {
	args = null;
	pos_arr = null;
    $.destroy();
    $.off();
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
		//refreshUI();
		Alloy.Globals.geofacade.setTriggerRange(parseInt(e.value * 1000));
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
	var pos = _.find($.bubblescontainer.children, function(searchpos){ return searchpos.modelid == id; });
	//Ti.API.info("pos" + pos);
	if(!pos){

		pos = {};
		pos.id = id;
		pos.left = getRandomPercentage(10, 70);
		pos.top = getRandomPercentage(10, 70);
		//Ti.API.info("new pos generated " + pos);

	}
	if(distance <= 1000){
		pos.side = 100;
		pos.radius = 50;
	}else if(distance > 1000 && distance < 2000){
		pos.side = 80;
		pos.radius = 40;
	}else if(distance > 2000 && distance < 4000){
		pos.side = 60;
		pos.radius = 30;
	}else{
		pos.side = 40;
		pos.radius = 20;
	}
	
	//Ti.API.info("pos returned " + JSON.stringify(pos));
	
	return pos;
}



$.updateHome = function(arr){
	Ti.API.info("updateHome: " + arr.length);
	masterarr = arr;
	refreshUI(arr);	
};
function refreshUI(arr){
	//<ImageView modelid="{id}" image="{image_thumbnail_uri}" top="{top}" left="{left}" width="{width}" height="{height}" borderRadius="{radius}" onClick="doClickBubble" />
	// first account for range
	if(!arr){
		arr = masterarr;
	}
	
	//first we remove the ones not in the list
	_.each($.bubblescontainer.children, function(bubble){
		if(!_.find(arr, function(sp){return sp.payload.id == bubble.modelid;})){
			// not found, delete
			bubble.removeEventListener("click", doClickBubble);
			$.bubblescontainer.remove(bubble);
		}
	}); 

	_.each(arr, function(point){
		var elem = _.find($.bubblescontainer.children, function(bill){ return bill.modelid == point.payload.id; });
		if(point.withinrange){
			var place = getPositionAndSize(point.distance, point.payload.id);
			if(elem){
				elem.applyProperties({modelid: point.payload.id, image: point.payload.image_thumbnail_uri, top: place.top, left: place.left, borderRadius: place.radius});				
			}else{
				var bub = Ti.UI.createImageView({modelid: point.payload.id, image: point.payload.image_thumbnail_uri, top: place.top, left: place.left, borderRadius: place.radius});
				bub.addEventListener("click", doClickBubble);
				$.bubblescontainer.add(bub);
			}
		}else{
			if(elem){
				elem.removeEventListener("click", doClickBubble);
				$.bubblescontainer.remove(elem);
			}
		}
	});
}

/*
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

*/
(function(){
	

	refreshUI();
	// pass reference to the required menu view
	$.settingsmenu.init({parentController: $});
	$.win.title = L('hometitle') + " 30 KM";
})();


