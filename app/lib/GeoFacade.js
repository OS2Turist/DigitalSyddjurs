function GeoFacade(geolib, accuracy){
	var _this = this;
	var _lastcoords = null;
	var _geolib = geolib;
	var _triggerrange = 50;
	var _trackpoints = [];
	var _accuracy = accuracy || 10;
	var _tracking = false;
	

	this.setTrackPoints = function(trackpoints){
		_trackpoints = trackpoints || [];
	};
	
	
	
	this.setWithinRange = function(point){
		if(point.distance < _triggerrange){
			point.withinrange = true;
		}else{
			point.withinrange = false;
		}
	};
	
	/**
	 * After changing the trigger range we need to relaunch the tracking to fire the needed events
	 */
	this.setTriggerRange = function(triggerrange){
		_triggerrange = triggerrange;
		_this.stop();
		_this.start();
	};

	this.handleLocationChange = function(newlocation){
		// do we have any points to track?
		if(_trackpoints.length > 0){
			_.each(_trackpoints, function(point){
				// calculate the distance
				point.distance = geolib.getDistance(newlocation, point);
				// set if the point is within range
				_this.setWithinRange(point);
			});
			// sort the list by distance
			var t_arr = _.sortBy(_trackpoints,function(elem){
    			return elem.distance;
  			});
  			_trackpoints = t_arr;
			
		}
		Ti.App.fireEvent("geofacade:location", {location: newlocation, trackpoints: _trackpoints});
	};

	this.locationListener = function(e){
		if(e.coords){
			if(!_lastcoords){
				_lastcoords = e.coords;
			}else{
				// Did we move far enough?
				var dist = geolib.getDistance(_lastcoords, e.coords);
				if(dist > _accuracy){
					_lastcoords = e.coords;
					_this.handleLocationChange(e.coords);
				}				
			}
		}
	};
	
	
	
	this.stop = function(){
		_tracking = false;
		Ti.Geolocation.removeEventListener("location", _this.locationListener);
		Ti.Geolocation.removeEventListener("authorization", _this.handleAuthChange);	
	};
	
	this.start = function(){
		if(Ti.Geolocation.getLocationServicesEnabled){
			// Setup the tracking
			_tracking = true;
			//Ti.Geolocation.setTrackSignificantLocationChange(true);
			Ti.Geolocation.setAccuracy(Ti.Geolocation.ACCURACY_NEAREST_TEN_METERS);
			// Get the initial position
			Ti.Geolocation.getCurrentPosition(function(e){
				if(e.coords){
					_lastcoords = e.coords;
					// First time
					_this.handleLocationChange(e.coords);
				}
			});
			Ti.Geolocation.setDistanceFilter(10);
			Ti.Geolocation.addEventListener("location", _this.locationListener);
		}
		Ti.Geolocation.addEventListener("authorization", _this.handleAuthChange);
	};
	
	this.handleAuthChange = function(e){
		if(e.authorizationStatus > 2){
			// Authorized	
			if(!_tracking){
				_this.start();
			}
		}else{
			// Denied
			_this.stop();
		}
	};
	
}

GeoFacade.prototype.setTrackPoints = function(trackpoint_array){
	this.setTrackPoints(trackpoint_array);
};

GeoFacade.prototype.stopTracking = function(){
	this.stop();
};

GeoFacade.prototype.startTracking = function(){
	this.start();	
};

GeoFacade.prototype.setTriggerRange = function(triggerrange){
	this.setTriggerRange(triggerrange);
};


module.exports = GeoFacade;