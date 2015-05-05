
var geolib = require("geolib");
/**
 * Class that wraps the fetching of position
 * This will be implemented globally
 * @param {integer} interval
 */
function Tracker(interval){
	var self = this;
	var _interval = 5000;
	var _trigger_range = 100;
	var _currentPosition = null;
	
	Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS;
	
	if(interval){
		this._interval = interval;	
	}
	
	Ti.Geolocation.getCurrentPosition(function(position){
		_currentPosition = position;
	});
	
	/**
	 * Public instance method that returns the current position
	 */
	this.CurrentPosition = function(){
		return _currentPosition;	
	};
	
	/**
	 * Start the timer to update the position
	 */
	var timer = setInterval(function(){
		Ti.API.info("getting the current position of the device");
		Ti.Geolocation.getCurrentPosition(function(position){
			// If the current position has moved more than 100 meter from the last one, we need to fire an event
			if(geolib.getDistance(_currentPosition.coords, position.coords, 10) > _trigger_range){
				_currentPosition = position;	
				Ti.App.fireEvent("Tracker:locationchanged", _currentPosition);
			}
		});
	},_interval);
}
module.exports = Tracker;