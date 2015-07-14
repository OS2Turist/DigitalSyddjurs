var geolib = require("geolib");

exports.definition = {
	config: {
		columns: {
			"id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "nid": "integer",
		    "language": "text",
		    "kategori": "integer",
		    "favorit": "integer",
		    "title": "text",
		    "subtitle": "text",
		    "description": "text",
		    "from_date": "integer",
		    "to_date": "integer",
		    "latitude": "text",
		    "longitude": "text",
		    "street1": "text",
		    "street2": "text",
		    "postal_code": "text",
		    "city": "text",
		    "country_name": "text",
		    "url": "text",
		    "email": "text",
		    "phone": "text", 
		    "distance" : "integer",
		    "image_thumbnail_uri": "text",
		    "image_medium_uri": "text"
		},
		defaults: {
			nid: 0,
			language: "",
			kategori: 0,
			favorit: 0,
			title: "",
			subtitle: "",
			description: "",
			from_date: 0,
			from_date: 0,
			latitude: "",
			longitude: "",
			street1: "",
			street2: "",
			postal_code: "",
			city: "",
			country_name: "",
			url: "",
			email: "",
			phone: "",
			distance: 0,
			image_thumbnail_uri: "",
			image_medium_uri: ""
		},
		adapter: {
			type: "sql",
			collection_name: "Arrangement",
			idAttribute: "id"
		}
	},
	extendModel: function(Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
			updateDistance: function(position){
				var model = this;
				model.set({distance: geolib.getDistance({latitude: parseFloat(model.get("latitude")), longitude: parseFloat(model.get("longitude"))},position)}, {silent: true});
				model.save({silent: true});
			},
			setFavourite: function(){
				var model = this;
				model.set({favorit: 1});
				model.save();
				return model;
			},
			removeFavourite: function(){
				var model = this;
				model.set({favorit: 0});
				model.save();
				return model;
			}
		});

		return Model;
	},
	extendCollection: function(Collection) {
		_.extend(Collection.prototype, {
			// Setup default sorting
			initialize: function(){
				this.sortField = "title";
				this.sortDirection = "ASC";
			},
			// Use set field to set the sort option before calling sort
			setSortField: function(field, direction){
				this.sortField = field;
				this.sortDirection = direction;
			},
			comparator: function(collection){
				return collection.get(this.sortField);
			},
			sortBy: function (iterator, context) {
                var obj = this.models;
                var direction = this.sortDirection;
 
                return _.pluck(_.map(obj, function (value, index, list) {
                    return {
                        value: value,
                        index: index,
                        criteria: iterator.call(context, value, index, list)
                    };
                }).sort(function (left, right) {
                    // swap a and b for reverse sort
                    var a = direction === "ASC" ? left.criteria : right.criteria;
                    var b = direction === "ASC" ? right.criteria : left.criteria;
 
                    if (a !== b) {
                        if (a > b || a === void 0) return 1;
                        if (a < b || b === void 0) return -1;
                    }
                    return left.index < right.index ? -1 : 1;
                }), 'value');
            },
            fetchFavourites: function(){
				var table = this.config.adapter.collection_name;
				return this.fetch({query:'SELECT * from ' + table + ' where favorit = 1'});
            },
			fetchWithKategoriFilter : function(kat_arr){
				var table = this.config.adapter.collection_name;
				return this.fetch({query:'SELECT * from ' + table + ' where kategori IN (' + kat_arr.join(",") + ') AND language="' + Ti.Locale.currentLanguage + '"'});
			},
			cleanUpAndSync: function(active_arr){
				if(active_arr ? active_arr.length > 0 : false){
					var collection = this;
				    var dbName = collection.config.adapter.db_name;
				    var table = collection.config.adapter.collection_name;
				    var sql = "DELETE FROM " + table + " WHERE nid NOT IN (" + active_arr.join(",") + ")";
				    db = Ti.Database.open(collection.config.adapter.db_name);
				    db.execute(sql);
				    db.close();
				    //collection.trigger('sync');
				    return true;
				}else{
					return false;
				}
			},
			/**
			 * Loop through the records and recalculate the distance to the current position of the device, end with calling sync to update databinding  
 			 * @param {Object} position
			 */
			updateDistanceAndSync: function(position){
				var collection = this;
				collection.each(function(model){
					model.updateDistance(position);
				});
				collection.trigger('sync');
				return true;
			},
			getEventsWithinRange: function(range){
				var arr = this.models.filter(function(model) {
				    return (model.get('distance') <= range);
				 });
				 return arr;
			}
		});
		return Collection;
	}
};
