MongoObject.purgeDeleted();

Tag.purgeUnusedTags();

Tags._ensureIndex({"tag": 1}, {unique: true});
Foods._ensureIndex({"tag": 1}, {unique: true});

//Meteor.AppCache.config();
Meteor.startup(function () {
    MongoObject.publishCollections();

    Meteor.users.deny({
        update: function (userId, method, params) {
            return userId !== method._id || params[0] !== "profile";
        }
    });
    Meteor.publish("userData", function () {
        if (this.userId) {
            var userId = this.userId;

            var users = Meteor.users.find({_id: userId});
            return users;
        } else {
            this.ready();
        }
    });


    if(process.env.NODE_ENV !== 'development') {
        Email.send({
            from: 'mail@u-tracker.d3ck.net',
            to: 'd3ck@gmx.net',
            subject: 'u-tracker restarted',
            text: 'u-tracker restarted: ' + new Date(Date.now()).toISOString()
        });
    }
})