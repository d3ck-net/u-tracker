/**
 * Base class to be able to easily save object changes to the db
 * @constructor
 */
MongoObject = function MongoObject() {
    this._instanceId = Tools.uid();
};

/**
 *
 * @returns {string}
 */
MongoObject.prototype.getId = function () {
    return this._id ? this._id : this._instanceId;
}

/**
 *
 */
MongoObject.prototype.clearId = function () {
    delete this._id;
    this._instanceId = Tools.uid();
}


/**
 *
 * @param data
 */
MongoObject.prototype.setFromData = function (data) {
    if (data) {
        Tools.extend(this, data);
    }
}

/**
 * @returns {Collection}
 */
MongoObject.prototype.getCollection = function () {
    throw "this should have be override by MongoObject.create or some custom code";
}

/**
 * returns the name of the associated Collection
 * @returns {string}
 */
MongoObject.prototype.getCollectionName = function () {
    throw "this should have be override by MongoObject.create or some custom code";
};

MongoObject.prototype.beforeDelete = function () {

};

/**
 * sets the _delete option which is filtered by default
 */
MongoObject.prototype.delete = function () {
    this.beforeDelete();
    this._deleted = true;
    this.save();
}

/**
 * override to be called after object got transformed
 */
MongoObject.prototype.onTransform = function () {

}

/**
 * callback to be ovveridden and called before save operations
 */
MongoObject.prototype.beforeSave = function () {

};

MongoObject.prototype.createListUI = function()
{
    
}

MongoObject.purgeDeleted = function()
{
    MongoObject.each(function (typeName, ctor) {
        var collection = ctor.prototype.getCollection();
        collection.remove({_deleted:true});
    });
}

MongoObject.export = function (nameOnly) {
    var res = {};
    MongoObject.each(function (typeName, ctor) {
        var collectionName = ctor.prototype.getCollectionName();
        if (!nameOnly || collectionName === nameOnly) {
            var collection = ctor.prototype.getCollection();
            res[collectionName] = collection.find().fetch();
        }
    });
    if (nameOnly && !res[nameOnly]) {
        console.error("no collection with name:" + nameOnly);
    }

    return res;
};

/**
 *
 * @param cb
 */
MongoObject.prototype.save = function (cb) {

    this.beforeSave();
    if (this._id) {
        this.update(cb);
    }
    else {
        this.insert(cb);
    }
}

MongoObject.moveField = function(collection,name1,name2)
{
    collection.find().forEach(function(ent){
         if(ent[name1] && !ent[name2])
         {
             var set = {$set:{},$unset:{}};
             set.$set[name2] = ent[name1];
             set.$unset[name1] = '';
             collection.update(ent._id,set);
         }
    });
}

MongoObject.prototype.unStackedSave = MongoObject.prototype.save;

MongoObject.prototype.save = function (done) {

    var self = this;
    Tools.stackedTimeout(function () {
        self.unStackedSave(done);
    }, this.getCollectionName() + ":save:" + this.getId())
}

/**
 *
 * @type {{}}
 */
MongoObject.prototype.mongoObjectOptions = {};


/**
 * helper function to excape keys to be used in mogodb
 * @param string
 * @returns {string}
 */
MongoObject.escapeKey = function (string) {
    return string.replace(/\./g, "").replace(/\$/g, "");
};

MongoObject.setAll = function (type, update) {

}

MongoObject.allTypes = {};

/**
 * iterate through all monog object types
 * @param callback
 */
MongoObject.each = function (callback) {
    Tools.each(MongoObject.allTypes, callback);
}

MongoObject.groundCollections = function () {
    MongoObject.each(function (name, ctor) {
        Ground.Collection(ctor.prototype.getCollection());
    });

    if (typeof Users === 'undefined') {
        Ground.Collection(Meteor.users);
    }
}
MongoObject.subscribeColletions = function () {

    MongoObject.each(function (name, ctor) {
        Meteor.subscribe(ctor.prototype.getCollectionName());
    });
}

MongoObject.publishCollections = function () {
    MongoObject.each(function (name, ctor) {

        var collection = ctor.prototype.getCollection();
        var collectionName = ctor.prototype.getCollectionName();

        collection.allow(ctor.prototype.mongoObjectOptions.allow);

        Meteor.publish(collectionName, function () {
            return collection.find(ctor.prototype.mongoObjectOptions.publish(this));
        });
    });

};

MongoObject.prototype.insert = function (cb) {
    var self = this;
    if (Meteor && Meteor.isServer) {
        this._id = this.getCollection().insert(this);
        if (cb) {
            cb(this._id);
        }
        return this._id;
    }
    else {
        this._id = this.getCollection().insert(this, function (err, id) {
            if (err) {
                console.error("could not save MongoObject", err);
                cb(null, err);
            }
            else {

                self._id = typeof id === "string" ? id : id.ops[0]._id;
                if (cb) {
                    cb(self._id);
                }
            }
        });
    }
}
MongoObject.prototype.getUpdateData = function () {
    return {"$set": this};
}
MongoObject.prototype.update = function (cb) {

    if (!this._id) {
        throw "can not update data without id";
    }

    this.beforeSave();
    var id = this._id;
    delete this._id;

    this.getCollection().update({_id: id}, this.getUpdateData(), false, cb);
    this._id = id;
}

MongoObject.createSubType = function (options) {
    if (typeof options === 'string') {
        options = {name: options};
    }

    var name = options.name;

    if (!name) {
        throw "subTypes mus have a name!";
    }

    var collectionName = name + "s";

    /** create or assign constructor
     *
     * @type {Mongo.Collection}
     */

    var ctor = options.ctor;
    if (!ctor) {
        ctor = new Function(
            "return function " + name + "(data){ this.setFromData(data);}"
        )();
    }
    if (global[name] && global[name] !== ctor) {
        throw "name already taken!";
    }
    global[name] = ctor;

    MongoObject.allTypes[name] = ctor;

    if (!options.prototype) {
        options.prototype = MongoObject;
    }
    var prototype = options.prototype;

    ctor.prototype = new prototype();

    ctor.prototype.getCollectionName = function () {
        return collectionName;
    }

    if (global[collectionName]) {
        throw "name already taken!";
    }

    options.publish = options.publish ? options.publish : MongoObject.defaults.publish;
    options.allow = options.allow ? options.allow : MongoObject.defaults.allow
    ctor.prototype.mongoObjectOptions = options;


    if (Meteor) {

        var collectionName = ctor.prototype.getCollectionName();

        var collection = options.collection ? options.collection : new Mongo.Collection(collectionName, {
            transform: function (doc) {
                var obj = new ctor();
                obj.setFromData(doc);
                obj.onTransform();
                return obj;
            }
        });

        var filter = function (userId, selector) {
            if (selector && typeof selector._deleted === 'undefined') {
                selector._deleted = {$ne: true};
            }
        };

        ctor.prototype.getCollection = function () {
            return collection;
        }
        if (!options.collection) {
            collection.before.find(filter);
            collection.before.findOne(filter);
        }

        global[collectionName] = collection;

    }
    else {
        ctor.prototype.getCollection = function () {
            return global[collectionName];
        }
    }

    return ctor;

};

MongoObject.defaults = {
    publish: function (self) {
        return {
            $or: [
                {userId: self.userId},
                {userId: {$exists: false}},
                {userId: null}
            ], _deleted: {$ne: true}
        }
    },
    allow: {
        insert: function () {
            return true;
        },
        update: function () {
            return true;
        },
        remove: function () {
            return true;
        }
    }
}