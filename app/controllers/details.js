var args = arguments[0] || {};

function doClose(e){
	args = null;
	$.off();
	$.destroy();
}

function doClickBack(e){
	if(OS_IOS){
		$.navwin.close();		
	}else{
		$.win.close();
	}
}


(function(){
	var arr = Alloy.Collections.Arrangement.get(args.modelid);
	$.arr_title.text = arr.get("title");	
	$.arr_image.image = arr.get("imageuri");
	$.arr_subtitle.text = arr.get("subtitle");	
})();