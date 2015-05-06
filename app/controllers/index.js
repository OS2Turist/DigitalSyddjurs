var ServiceListener = require("ServiceListener");

var timer = null;

var user = {
    name: "app",
    pass: "app"
};
var sl = new ServiceListener(user, "http://os2turist.bellcom.dk/", "app");
timer = setInterval(function(){
	sl.loadData(sl.processJSON);	
}, 300000);



(function(){
	$.index.open();
})();
