var args = arguments[0] || {};
var masterarr = [];
var viewsize = {width:320, height: 568};
var maxDis = 30000;
var circle = null;



this.init = function(params){
	args = params;
};


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
	var km = String.format("%d", $.sldKmSetting.value) + " KM";
	$.lblKmSetting.text = km;
	$.win.title = L('hometitle') + " " + km;
	maxDis = $.sldKmSetting.value;
	if(e){
		refreshUI();
		//Alloy.Globals.geofacade.setTriggerRange(parseInt(e.value));
	}
}

function doClickBubble(e){
	Alloy.createController("details", {"modelid": e.source.modelid, root: args.parent}).getView().open({transition: Titanium.UI.iPhone.AnimationStyle.CURL_UP});
}

var pos_arr = [];
function getPositionAndSize(point, maxdistance, vc, callback){
	
	
	//Ti.API.info(point.payload.title + " " + point.directionFromMyLocation + " " + point.distance);
	var distance = point.distance;
	var id = point.payload.id;
	// have we rendered this one before?
	var place = _.find(pos_arr, function(searchpos){ return searchpos.id == id; });

	if(!place){
		place = {};
		place.id = id;
		//place.rotation = Math.random() * (2 * Math.PI); 
	}
	place.rotation = point.directionFromMyLocation * Math.PI / 180;
	place.side = 60;
	place.radius = 30;
	vc.center = {x: vc.x - place.radius, y:vc.y - place.radius};
	
	//value = (itemDis/maxDis)*9 + 1;
	//var rotation = Math.random() * (2 * Math.PI);
	//relDis = Math.log(value, 10);
	var value = (distance/maxdistance)*9 + 1;
	var relDis = Math.log(value) * (Math.E / 10); // = value between 0-1
	//Ti.API.info("distance: " + distance + " maxdistance: " + maxdistance + "relDis: " + relDis);
	place.top = vc.center.y + (vc.y * relDis * (Math.sin(place.rotation) * -1));
	place.left = vc.center.x + (vc.x * relDis * Math.cos(place.rotation));
	
	pos_arr.push(place);	


	callback(place);
}



$.updateHome = function(arr){
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
		if(bubble.modelid){
			if(!_.find(arr, function(sp){return sp.payload.id == bubble.modelid;})){
				// not found, delete
				bubble.removeEventListener("click", doClickBubble);
				$.bubblescontainer.remove(bubble);
			}
		}
	}); 

	_.each(arr, function(point){
		var elem = _.find($.bubblescontainer.children, function(bill){ return bill.modelid == point.payload.id; });
		
		if(point.distance < $.sldKmSetting.value){
			//var place = getPositionAndSize(point);
			getPositionAndSize(point, maxDis, viewsize, function(place){
				if(elem){
					elem.applyProperties({modelid: point.payload.id, image: point.payload.image_thumbnail_uri, top: place.top, left: place.left, width: place.side, height: place.side, borderRadius: place.radius});				
				}else{
					// This is a new bubble, how do we show that?
					var bub = Ti.UI.createImageView({modelid: point.payload.id, image: point.payload.image_thumbnail_uri, top: place.top, left: place.left, width: place.side, height: place.side, borderRadius: place.radius});
					bub.addEventListener("click", doClickBubble);
					$.bubblescontainer.add(bub);
				}
			});
		}else{
			if(elem){
				elem.removeEventListener("click", doClickBubble);
				$.bubblescontainer.remove(elem);
			}
		}
	});
}


(function(){
	
	// get the max distance
	maxDis = $.sldKmSetting.value;
	
	// get the size of the view object
	var tmp = $.bubblescontainer.toImage();
	viewsize.width = tmp.width;
	viewsize.height = tmp.height;
	viewsize.x = viewsize.width / 2;
	viewsize.y = viewsize.width / 2;
	
	var circ = Titanium.UI.createImageView({width:viewsize.width-60, height: viewsize.width-60, top: 30, left: 30, backgroundColor: "#fff", borderRadius: (viewsize.width - 60)/2 });
	$.bubblescontainer.add(circ);

	//refreshUI();
	// pass reference to the required menu view
	$.settingsmenu.init({parentController: $});
	$.win.title = L('hometitle') + " 30 KM";
})();


