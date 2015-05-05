var Drupal = require('drupal');
// This Class is responsible for calling the drupal service and fetch the latest data on regular intervals



function ServiceListener(serviceuser, serviceroot, serviceendpoint){
	
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
	 * private instance method that filters an image url from the data
	 */	
	var getImageUri = function(obj){
		var image_uri = "";
		if(obj.images){
			if(obj.images.length > 0){
				image_uri = obj.images[0].thumbnail;
			}
		}
		return image_uri;
	};
	
	/**
	 * Helper method
	 * Private instance method that filters the image extension from the the data node
	 */
	var getImageExtension = function (url){
		if(url != ""){
			var arr1 = url.split('/');
			var ext = arr1[arr1.length-1].split('?')[0].split('.')[1];
			return ext;
		}else{
			return "";
		}
	};

	/**
	 * Public instance method that loads data form the service and returns through the callback
	 */
	this.loadData = function(callback){
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
	};
	
	/**
	 *  public instance method for processing and storing the data returened by the service
	 */
	this.processJSON = function(json_obj){
	    var loc, newevent, image_uri, date_from, date_to, datepart, res;
	    var arrangementer = Alloy.Collections.instance("Arrangement");
	    var table = arrangementer.config.adapter.collection_name;
	    arrangementer.fetch();
	    _.each(json_obj, function(obj){
	    	if(obj.location){     // import the events that has a location
	    		if(obj.location.latitude && (obj.location.latitude != "0.000000")){
	    			var imageuri = getImageUri(obj);
	    			var imageext = getImageExtension(imageuri);
	    			//var imageblob = getPicture(imageuri, obj.nid);  // TODO find the best way to load the images
					_.each(obj.translations.data, function(node){
						newevent = Alloy.createModel("Arrangement",{
							id: null,
		    				nid: obj.nid,
		    				language: node.language,
		    				title: obj.title_field[node.language][0].safe_value,
		    				subtitle: obj.field_subtitle[node.language][0].safe_value,
		    				from_date: getAndFormatDate(obj.field_show_from),
		    				to_date: getAndFormatDate(obj.field_show_to),
		    				latitude: obj.locations[0].latitude,
		    				longitude: obj.locations[0].longitude,
		    				distance: 0,
	    					imageuri: imageuri,
	    					imageextension : imageext,
		    				image: null  // TODO need to figure out how to best load these, maybe loaded and added when first displayed?
	    				});
	    				
	   					var res_arr = arrangementer.where({nid: parseInt(obj.nid), language: node.language});
						if(res_arr.length === 0){
		    				newevent.save();
		    				arrangementer.add(newevent);
						}else{
							// Found, update
							newevent.set({id: res_arr[0].get("id")});
							newevent.save();
						}						
					});
	    		}
	    	}
	    });
	    if(json_obj.info){
	    	// grap the timestamp from info and clean up using the nid list
	    	Ti.App.Properties.setString("latestBackendTimestamp", json_obj.info.timestamp);
	    	// Now the delete operation to clean up old events
	    	arrangementer.cleanUpAndSync(json_obj.info.nids);
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

module.exports = ServiceListener;