var args = arguments[0] || {};

/**
 * Update the range of the scanner
 */
function doChangeKm(e){
	$.lblKmSetting.text = String.format("%d", e.value) + " KM";
	Alloy.Globals.searchradius = e.value; 
	$.win.title = L('hometitle') + " " + String.format("%d", e.value) + " KM";
	Ti.App.fireEvent("Discovery:searchradiuschanged");
}

function getRandomPercentage(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min + "%";
}

(function(){
	var bubbles = {};
	// pass reference to the required menu view
	$.settingsmenu.init({parentController: $});
	doChangeKm($.sldKmSetting);

	Ti.App.addEventListener("Discovery:foundsome", function(e){
		// if it already shown, handle the size
		_.each(e.list, function(obj){
			if(!bubbles.hasOwnProperty(obj.id)){
				// it is new add a bubble
				bubbles[obj.id] = obj;
				// create a new bubble
				var img = Ti.UI.createImageView({
					id: obj.id, 
					image: obj.imageuri,
					width: 40,
					height: 40,
					borderRadius: 20,
					top: getRandomPercentage(2,88),
					left: getRandomPercentage(2,88) 
				});
				img.addEventListener('click', function(e){
					var args = {"modelid": e.source.id};
					var detailwin = Alloy.createController("details", args).getView();
					detailwin.open({transition: Titanium.UI.iPhone.AnimationStyle.FLIP_FROM_LEFT});	
				});
				$.bubblescontainer.add(img);			
				// TODO size it based on range
			}
		});
	});

	Ti.App.addEventListener("Discovery:lostone", function(obj){
		// remove the bubble
		delete bubbles[obj.id];
		//also delete from the container
		_.each($.bubblescontainer.children, function(child){
			if(child.id === obj.id){
				$.bubblescontainer.remove(child);
			}
		});
	});
})();


