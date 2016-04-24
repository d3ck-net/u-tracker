Food = MongoObject.createSubType({name: "Food"});

Food.prototype.values = {
    protein: 0,
    carbohydrates: 0,
    fat: 0
}

Food.prototype.tag = "";
// Food.prototype.name = "";


Food.calcIntake = function (array, factor, interpolationLength) {
    var values = {protein:0,fat:0,carbohydrates:0};
    if (factor === undefined) {
        factor = 1
    }
    var dateBase = Date.now() - interpolationLength;

    array.each(function (i, p) {
        var food = Foods.findOne({tag: p.tag});
        if (food) {
            var factorFood = p.mnt / 100;
            var timeFactor = interpolationLength ? (p.date - dateBase) / interpolationLength : 1;
            $.each(food.values, function (key, val) {
                if (!values[key]) {
                    values[key] = 0;
                }

                values[key] += val * factorFood * factor * timeFactor;
            });
        }
    });
    var calories = 0;
    Tools.each(values, function (i, o) {
        if (Food.caloryFactors[i]) {
            calories += o * Food.caloryFactors[i];
        }
        values[i] = Tools.round(o ) ;
        values[i] = values[i] === undefined ? 0 : values[i];
    });
    values['calories'] = Tools.round(calories );
    return values;

}





Food.caloryFactors = {
    protein: 4,
    fat: 9,
    carbohydrates: 4
}
Food.reccomendedRatios = {
    protein: 0.15,
    fat: 0.65,
    carbohydrates: 0.2
}