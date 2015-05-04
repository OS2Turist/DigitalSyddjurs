var geolib = require("geolib");

exports.definition = {
	config: {
		columns: {
			"id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "nid": "integer",
		    "language": "text",
		    "title": "text",
		    "subtitle": "text",
		    "from_date": "integer",
		    "to_date": "integer",
		    "latitude": "text",
		    "longitude": "text",
		    "distance" : "integer",
		    "imageuri": "text",
		    "imageextension": "text",
		    "image": "blob"
		},
		defaults: {
			nid: 0,
			language: "",
			title: "",
			subtitle: "",
			from_date: 0,
			from_date: 0,
			latitude: "",
			longitude: "",
			distance: 0,
			imageuri: "",
			imageextension: "",
			image: null
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
			sortBy: function(iterator, context){
				var onbj = this.models;
				var direction = this.sortDirection;
				
			},sortBy: function (iterator, context) {
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
			// extended functions and properties go here
			fetchForCurrentLanguage : function(){
				var table = this.config.adapter.collection_name;
				return this.fetch({query:'SELECT * from ' + table + ' where language="' + Ti.Locale.currentLanguage + '"'});
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
				    collection.trigger('sync');
				}
			},
			
			// TODO fetch for date range and language
			
			// TODO implement sorting
			
			// TODO fetch within a certain range
			
			// TODO fetch and add range
			
		});

		return Collection;
	}
};
