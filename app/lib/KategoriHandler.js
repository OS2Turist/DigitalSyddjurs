var Drupal = require('drupal');

/**
 * Fetches Kategori data from the drupal service and stores it in the Kategori model Collection
 * @param {Object} serviceuser user object
 * @param {String} serviceroot The root of the service
 * @param {String} serviceendpoint The endpoint to call
 */
function KategoriHandler(serviceuser, serviceroot, serviceendpoint){
	var drupal = new Drupal();
	var timer = null;
	
	drupal.setRestPath(serviceroot, serviceendpoint);
	
	this.loadKategorier = function(callback){
		// if we have network
		if(Ti.Network.online){
			drupal.login(serviceuser.name, serviceuser.pass,
			    function(userData) {
			        // Lets fetch the data
			        var latestBackendTimestamp = "";
			        if(Ti.App.Properties.hasProperty("latestBackendTimestamp")){
			        	latestBackendTimestamp = Ti.App.Properties.getString("latestBackendTimestamp");
			        }
			        drupal.getResourceNoExtention("categories/get", latestBackendTimestamp,
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
	
	/**
	 * Get the data from the service and update the model
 	 * @param {Object} jsonObj containing the kategori data from the service
	 */
	this.processKategorier = function(json_obj){
		var listchangedflag = false;
		var newkat = null;
		var kategorier = Alloy.Collections.instance("Kategori");
	    var table = kategorier.config.adapter.collection_name;
	    kategorier.fetch();
		_.each(json_obj, function(obj){
			_.each(Object.keys(obj.name), function(key){
				var res_kat = kategorier.where({tid: parseInt(obj.tid), language: key});
				if(res_kat.length === 0){
					newkat = Alloy.createModel("Kategori",{
						tid: obj.tid,
						language: key,
						title: obj.name[key][0].safe_value,
						selected: 1
					});
    				newkat.save();
    				kategorier.add(newkat);
    				listchangedflag = true;
				}else{
					// Found, update
					res_kat[0].set({
						tid: obj.tid,
						language: key,
						title: obj.name[key][0].safe_value
					});
					// TODO compare content and only update changed records and set listchangedflag if needed;
					res_kat[0].save();
    				listchangedflag = true;
				}						
			});
		});
	};
}

module.exports = KategoriHandler;