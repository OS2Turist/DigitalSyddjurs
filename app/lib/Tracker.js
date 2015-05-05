
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
		this._currentPosition = {latitude: position.coords.latitude, longitude: position.coords.longitude};
	});
	
	/**
	 * Public instance method that returns the current position
	 */
	this.CurrentPosition = function(){
		return self._currentPosition;	
	};
	
	/**
	 * Start the timer to update the position and fire an App wide event if the position has changed more than the set trigger range
	 */
	var timer = setInterval(function(){
		
		Ti.Geolocation.getCurrentPosition(function(position){
			// TODO fix this fucking mess
			// If the current position has moved more than 100 meter from the last one, we need to fire an event
			if(geolib.getDistance(_currentPosition, position.coords, 10) > _trigger_range){
				_currentPosition = {latitude: position.coords.latitude, longitude: position.coords.longitude};
				Ti.API.info("getting the current position of the device " + JSON.stringify(_currentPosition));	
				Ti.App.fireEvent("Tracker:locationchanged", _currentPosition);
			}
		});
	},_interval);
}
module.exports = Tracker;