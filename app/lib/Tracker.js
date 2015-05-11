
var geolib = require("geolib");
/**
 * Class that wraps the fetching of position
 *  * @param {integer} interval
 */
function Tracker(interval){
	var self = this;
	var _interval = 5000;
	var _trigger_range = 100;
	var _lastPosition = null;
	
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
	
	if(interval){
		this._interval = interval;	
	}
	
	Ti.Geolocation.getCurrentPosition(function(position){
		_lastPosition = {"latitude": position.coords.latitude, "longitude": position.coords.longitude};
	});
	
	/**
	 * Returns last known position
	 */
	this.getCurrentPosition = function(){
		return _lastPosition;
	};
	
	/**
	 * Start the timer to update the position and fire an App wide event if the position has changed more than the set trigger range
	 */
	var timer = setInterval(function(){
		Ti.Geolocation.getCurrentPosition(function(position){
			// If the current position has moved more than 100 meter from the last one, we need to fire an event
			var pos = {"latitude": position.coords.latitude, "longitude": position.coords.longitude};
			if(geolib.getDistance(_lastPosition, pos, 10) > _trigger_range){
				_lastPosition = pos;
				Ti.App.fireEvent("Tracker:locationchanged", pos);
			}
		});
	},_interval);
}
module.exports = Tracker;