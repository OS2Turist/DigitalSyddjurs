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
	$.title.text = arr.get("title");	
	$.image.image = arr.get("image_medium_uri");
	$.subtitle.text = arr.get("subtitle");
	$.description.text = arr.get("description");
	$.street1.text = arr.get("street1");
	$.street2.text = arr.get("street2");
	$.postal_code.text = arr.get("postal_code");
	$.city.text = arr.get("city");
	$.url.text = arr.get("url");
	$.email.text = arr.get("email");
	$.phone.text = arr.get("phone");

})();