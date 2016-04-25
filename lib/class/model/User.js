User = MongoObject.createSubType({'name': 'User', collection: Meteor.users});

User.prototype.getAge = function () {
    return this.profile.birthdate.getAge();
}
User.prototype.getCholoricNeed = function () {

    var res;
    switch (this.profile.gender) {
        case 'female':
            res = 10 * this.profile.weight + 6.25 * this.profile.height - 5 * this.getAge() - 161.;
            break;
        case 'male':
        default:
            res = 10 * this.profile.weight + 6.25 * this.profile.height - 5 * this.getAge();
            break;
    }

    return (this.profile.activityLevel / 100 * 0.7 + 1.2) * res;
}

User.prototype.getUpdateData = function () {
    return {"$set": {'profile': this.profile}};
}
User.prototype.getCustomRatios = function () {
    return {
        protein: this.profile.distribution.protein,//.ratios[0],
        fat: this.profile.distribution.fat - this.profile.distribution.protein,//this.profile.ratios[1] - this.profile.ratios[0],
        carbohydrates: 100 - this.profile.distribution.fat
    }
}
User.prototype.getRecommendedValues = function () {
    var res = {};
    var all = this.getCholoricNeed();
    var customFactors = this.getCustomRatios();
    Tools.each(Food.caloryFactors, function (name, factor) {
        res[name] = all / factor * customFactors[name] / 100;
    });
    res['calories'] = all;
    return res;
}

/**
 *
 * @param date
 */
User.prototype.getDaylyIntake = function (date) {
    if (!date) {
        date = new Date(Date.now());
    }
    date = date.getStartOfDay();
    
    var date2 = new Date(date);
    date2.setDate(date2.getDate() + 1);

    var points = DataPoints.find({date: {$gte: date.getTime(), $lt: date2.getTime()}});
    return Food.calcIntake(points.fetch());
}

User.prototype.get24HourIntake = function () {
    var hour = 60 * 60 * 1000;
    var day = hour * 24;
    var points = DataPoints.find({date: {$gt: Date.now() - day}});
    return Food.calcIntake(points.fetch());
}


User.prototype.getInterpolatedIntake = function () {
    var hour = 60 * 60 * 1000;
    var day = hour * 24;
    var points = DataPoints.find({date: {$gt: Date.now() - day}});
    return Food.calcIntake(points.fetch(), 1, day);
}

User.prototype.getDeficits = function () {

    var deltas = {};
    var intake = this.getDaylyIntake();
    var target = this.getRecommendedValues();
    Tools.each(target, function (i, o) {
        deltas[i] = Tools.round(o - intake[i]);
    });
    return deltas
}

User.prototype.getProteinSuggestions = function()
{
    return {
        'maintain': 0.8 * this.profile.weight * (100-this.profile.bodyFat)*0.01,
        'grow': 2.2 * this.profile.weight * (100-this.profile.bodyFat)*0.01,
    }
}
User.prototype.getPercentageIntake = function (date) {

    var res = {};
    var eaten = this.getDaylyIntake(date);
    var should = this.getRecommendedValues();

    Tools.each(eaten, function (name, values) {
        res[name] = eaten[name] / should[name] * 100;
    });
    return res;
}
User.prototype.getRationsChart = function (view) {
    var grams = this.getRecommendedValues();
    var ratios = this.getCustomRatios();

    var labels = [];

    var values = view === 'mass' ? grams : ratios;

    Tools.each(grams, function (i) {
        labels.push(Tools.round(grams[i]) + "g / " + Tools.round(ratios[i]) + "%");
    });

    return {
        labels: labels,
        series: [values.protein, values.fat, values.carbohydrates]
    }
}
User.prototype.getHistoryChart = function (start,days) {


    start = start ? start : new Date(Date.now());
    if (!Foods.find().count() || !DataPoints.find().count() || !Meteor.user()) {
        return;
    }
    
    days = days ? days : 7;

    var labels = [];
    var series = [[], [], [], []];

    var hour = 60 * 60 * 1000;
    var day = hour * 24;
    for (var i = days; --i >= 0;) {

        var date = new Date(start.getTime() - day * i);
        // debugger;
        var today = this.getPercentageIntake(date)

        series[0].push(today.protein - 100);
        series[1].push(today.fat - 100);
        series[2].push(today.carbohydrates - 100);
        series[3].push(today.calories - 100);
        if (i === 0) {
            labels.push('today');
        }
        else {

            labels.push(date.toDateString());
        }
    }

    return {
        labels: labels,
        series: series
    };
}

User.prototype.getGramChart = function () {
    var eaten = this.getDaylyIntake();
    var toGo = this.getDeficits();
    return {
        labels: ['to-go', 'eaten'],
        series: [
            [toGo.protein, eaten.protein],
            [toGo.fat, eaten.fat],
            [toGo.carbohydrates, eaten.carbohydrates],
            // [toGo.calories,eaten.calories]
        ]
    }
}

User.prototype.getStatChart = function (days) {


    var days = days ? days : 1;
    var labels = [];
    var series = [[], [], [], []];
    var tmpVals = [[], [], [], []]
    var hour = 60 * 60 * 1000;
    var day = hour * 24;

    for (var i = 0; i < days; i++) {

        var date = new Date(Date.now() - day * i);
        var today = this.getPercentageIntake(date)

        tmpVals[0].push(today.protein);
        tmpVals[1].push(today.fat);
        tmpVals[2].push(today.carbohydrates);
        tmpVals[3].push(today.calories);

    }

    series[0].push(tmpVals[0].sum() / days - 100);
    series[1].push(tmpVals[1].sum() / days - 100);
    series[2].push(tmpVals[2].sum() / days - 100);
    series[3].push(tmpVals[3].sum() / days - 100);
    labels.push(days == 1 ? "today" : "last " + days + " days");

    return {
        labels: labels,
        series: series
    };
}