/**
 *
 * @constructor
 */
DataPoint = MongoObject.createSubType({name: 'DataPoint'});

/**
 * @type number
 */
DataPoint.prototype.mnt;

/**
 * @type Tag
 */
DataPoint.prototype.tag;


/**
 * @type string
 */
DataPoint.prototype.comment;

/**
 * @type Date
 */
DataPoint.prototype.date;

/**
 * @type string
 */
DataPoint.prototype.userId;


/**
 * @type Location
 */
DataPoint.prototype.location;

/**
 *
 * @param data actual data {tag,mnt,comment}
 * @param insert should the value be inserted ?
 * @returns {*}
 */
DataPoint.create = function (data, insert) {

    insert = insert !== undefined ? insert : true;

    data = data ? data : {};
    if (!data.tag) {
        throw "need to specify a tag";
    }
    if (!data.mnt) {
        data.mnt = 1;
    }

    var dataPoint = new DataPoint({
        tag: data.tag,
        mnt: data.mnt,
        comment: data.comment,
        date: Date.now(),
        userId: Meteor.userId(),
        location: data.location
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (location) {
            dataPoint.location = location;
            dataPoint.save();
        });
    } else {
        dataPoint.location = null;
    }

    dataPoint.save();

    Tag.create(data.tag);

    return new DataPoint(data);
}

DataPoint.prototype.getFood = function () {
    var food = Foods.findOne({tag: this.tag});
    return food;
}

DataPoint.prototype.isFood = function () {
    var food = this.getFood();
    return food !== undefined;
}

DataPoint.prototype.onTransform = function () {
    if (typeof this.mnt === 'string') {
        this.mnt = parseFloat(this.mnt);
    }
    this.date = new Date(this.date);
}

DataPoint.prototype.beforeSave = function () {
    if (this.date instanceof Date) {
        this.date = this.date.getTime();
    }
}