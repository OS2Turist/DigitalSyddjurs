exports.definition = {
	config: {
		columns: {
		    "id": "INTEGER PRIMARY KEY AUTOINCREMENT",
		    "tid": "integer",
		    "language": "text",
		    "title": "text",
		    "selected": "integer"
		},
		default: {
			tid: -1,
			language: "da",
			title: "Kategori titel",
			selected: 1
		},
		adapter: {
			type: "sql",
			collection_name: "Kategori",
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
			getSelectedArray : function(lan){
				var arr = [];
				var collection = this;
			    var dbName = collection.config.adapter.db_name;
			    var table = collection.config.adapter.collection_name;
			    var sql = "SELECT * FROM " + table + " WHERE selected = 1 and language = '"+ lan +"'";
			    db = Ti.Database.open(dbName);
			    var rows = db.execute(sql);
			    while(rows.isValidRow()){
			    	arr.push(rows.fieldByName("tid"));
			    	rows.next();
			    }
   			    db.close();
   			    rows.close();

				return arr;
			},
			setSelected: function(id, selectedvalue){
				var collection = this;
			    var dbName = collection.config.adapter.db_name;
			    var table = collection.config.adapter.collection_name;
			    var sql = "UPDATE " + table + " SET selected = "+ selectedvalue +" WHERE id = " + id;
			    db = Ti.Database.open(dbName);
			    db.execute(sql);
			    db.close();
			    collection.trigger('sync');
			}
			// extended functions and properties go here

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			}
			*/
		});
		return Collection;
	}
};

