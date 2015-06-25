var Drupal = require('drupal');

function ArrangementHandler(serviceuser, serviceroot, serviceendpoint){
	
	var _user = serviceuser;
	
	var _serviceroot = serviceroot;
	
	var _serviceendpoint = serviceendpoint; 
	
	var drupal = new Drupal();
	drupal.setRestPath(_serviceroot, _serviceendpoint);
	
	/**
	 * Helper method
	 * Private instance method used for formatting a data node
	 */
	var getAndFormatDate = function(datenode){
		date_from = null;
		if(datenode.und){
			if(datenode.und.length > 0){
				date_from = Date.parse(datenode.und[0].value.split(' ')[0].replace(/-/g,"/"));
			}
		}
		return date_from;
	};

	/**
	 * Helper method
	 * private instance method that filters a thumbnail image url from the data
	 */	
	var getThumbnailUri = function(obj){
		var thumb_uri = "";
		if(obj.images){
			if(obj.images.length > 0){
				thumb_uri = obj.images[0].thumbnail;
			}
		}
		return thumb_uri;
	};
	/**
	 * Helper method
	 * private instance method that filters an medium image url from the data
	 */	
	var getMediumUri = function(obj){
		var medium_uri = "";
		if(obj.images){
			if(obj.images.length > 0){
				medium_uri = obj.images[0].medium;
			}
		}
		return medium_uri;
	};

	/**
	 * Public instance method that loads data form the service and returns through the callback
	 */
	this.loadArrangementer = function(callback){
		// If we have network, we try to load fresh data
		if(Ti.Network.online){
			drupal.login(_user.name, _user.pass,
			    function(userData) {
			        // Lets fetch the data
			        var latestBackendTimestamp = "";
			        if(Ti.App.Properties.hasProperty("latestBackendTimestamp")){
			        	latestBackendTimestamp = Ti.App.Properties.getString("latestBackendTimestamp");
			        }
			        drupal.getResourceNoExtention("content/get", latestBackendTimestamp,
				        function(responseData){
				        	if(typeof(callback) === "function"){
				        		callback(responseData);
				        	}else{
				        		return responseData;
				        	}
				        },
				        function(err){
				        	Ti.API.info("failed" + JSON.stringify(err));
				        }); //resourceName, args, success, failure, headers;
			    },
			    function(err){
			        Ti.API.info('login failed.' + JSON.stringify(err));
			    }
			);
		}
	};
	
	function getUrl(node){
		if(node ? node.und : false){
			retval = node.und[0].url;	
		}
		return "";
	}
	function getUndSafeValue(node){
		retval = "";
		if(node ? node.und : false){
			retval = node.und[0].safe_value;	
		}
		return retval;
	}
	function getLocalizedString(desc_arr, lan){
		retval = "";
		if(!_.isEmpty(desc_arr)){
			try{
				retval = desc_arr[lan][0].value;	
			}catch(e){
				Ti.API.info("Error getting the description field");
			}
		}
		return retval;
	}
	this.updateDistance = function(){
		Ti.Geolocation.getCurrentPosition(function(e){
			var arrangementer = Alloy.Collections.instance("Arrangement");
			arrangementer.updateDistanceAndSync(e.coords);	
		});
	};	

	/**
	 *  public instance method for processing and storing the data returned by the service
	 */
	this.processArrangementer = function(json_obj){
	    var loc, newevent, image_uri, date_from, date_to, datepart, res;
	    var arrangementer = Alloy.Collections.instance("Arrangement");
	    var table = arrangementer.config.adapter.collection_name;
	    arrangementer.fetch();
	    _.each(json_obj, function(obj){
	    	if(obj.location){     // import the events that has a location
	    		if(obj.location.latitude && (obj.location.latitude != "0.000000")){
	    			var thumbnail_uri = getThumbnailUri(obj);
	    			var medium_uri = getMediumUri(obj);
	    			//var imageblob = getPicture(imageuri, obj.nid);  // TODO find the best way to load the images
					_.each(obj.translations.data, function(node){
						//Ti.API.info("nid: " + obj.nid + " language: " + node.language + " subtitle " + JSON.stringify(obj.field_subtitle));
						newevent = Alloy.createModel("Arrangement",{
							id: null,
		    				nid: obj.nid,
		    				language: node.language,
		    				kategori: obj.field_offer_type[node.language][0].tid,
		    				title: getLocalizedString(obj.title_field,node.language),
		    				subtitle: getLocalizedString(obj.field_subtitle,node.language),
		    				description: getLocalizedString(obj.field_offer_you_get, node.language),	
		    				from_date: getAndFormatDate(obj.field_show_from),
		    				to_date: getAndFormatDate(obj.field_show_to),
		    				latitude: obj.locations[0].latitude,
		    				longitude: obj.locations[0].longitude,
		    				street1: obj.locations[0].street,
		    				street2: obj.locations[0].additional,
		    				postal_code: obj.locations[0].postal_code,
		    				city: obj.locations[0].city,
		    				country_name: obj.locations[0].country_name,
		    				url: getUrl(obj.field_offer_url),
		    				email: getUndSafeValue(obj.field_offer_email),
		    				phone: getUndSafeValue(obj.field_phone),
		    				distance: 0,
	    					image_thumbnail_uri: thumbnail_uri,
	    					image_medium_uri : medium_uri
		    				//image: null  // TODO need to figure out how to best load these, maybe loaded and added when first displayed?
	    				});
						var res_arr = arrangementer.where({nid: parseInt(obj.nid), language: node.language});
						if(res_arr.length === 0){
		    				newevent.save();
		    				//Ti.API.info("New event: " + obj.nid + "  " + newevent.get("title"));
		    				//arrangementer.add(newevent, {silent: true});
						}else{
							// Found, update
							// TODO compare content and only update changed records and set listchangedflag if needed;
							newevent.set({id: res_arr[0].get("id")}, {silent: true});
							newevent.save();
		    				//Ti.API.info("Update event: " + obj.nid + "  " + newevent.get("title"));
						}
					});
	    		}
	    	}
	    });
	    if(json_obj.info){
	    	// Now the delete operation to clean up old events
	    	arrangementer.cleanUpAndSync(json_obj.info.nids);
	    	// grap the timestamp from info and clean up using the nid list
	    	Ti.App.Properties.setString("latestBackendTimestamp", json_obj.info.timestamp);
	    }
	};
	
	/**
	 * Private instance method that loads images as a blob 
	 * @param {Object} url
	 * @param {Object} nid
	 */
	var getPicture = function(url, nid) {
		if(url != ""){
			// Do we have network?
			if(Ti.Network.online){
				var xhr = Ti.Network.createHTTPClient();
				xhr.setTimeout(10000);
				xhr.open("GET", url);
				xhr.onload = function() {
					var b = xhr.getResponseData();
					//Ti.API.info("Blob length: " + nid + " : " + b.length);
					return b; 				
				};
				xhr.onerror = function(){
					//Ti.API.info("Error loading image: " + nid + " : " + this.error);
				}; 
				xhr.send();
			}
		}
		return null;
	};
}

module.exports = ArrangementHandler;
