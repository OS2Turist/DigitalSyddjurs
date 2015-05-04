var args = arguments[0] || {};

function doClose(e){
	args = null;
	$.off();
	$.destroy();
}