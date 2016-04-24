/**
 *
 * @constructor
 */
Tag = MongoObject.createSubType({name:"Tag"});

Tag.create = function (name) {
    try {
        name = name.trim();
        Tags.insert({tag: name, userId: Meteor.userId()});
    }
    catch (e) {
        //debugger;
    }
}

/**
 * @type string
 */
Tag.prototype.tag;

/**
 * @type string
 */
Tag.prototype.userId;

Tag.rename = function (oldName, newName)
{
    
}

Tag.taggedTypes = {
    DataPoints:'tag',
    Foods:'tag'
};

Tag.renameTag = function()
{

}

Tag.purgeUnusedTags = function()
{
    Tags.remove({'tag':{$in:Tag.getUnusedTags()}});
}

Tag.getUnusedTags = function(colls)
{
    var res = [];
    var map = {};
    colls = colls ? colls : Tag.taggedTypes;

    Tools.each(colls,function(i,field){
        var coll = global[i];
        coll.find().forEach(function(o){
            if(!map[o[field]])
            {
                res.push(o[field]);
            }
            map[o[field]] = true;
        });
    })

    var tagNames = [];
    Tags.find({'tag':{$nin:res}}).forEach(function(o){
        tagNames.push(o.tag);
    });

    return tagNames;

}