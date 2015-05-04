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
		$.close();
	}
}
