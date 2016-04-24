Meal = MongoObject.createSubType({name: 'Meal'});

Meal.prototype.addIngridient = function (ingridient) {
    this.ingridients.push(ingridient);
}

Meal.prototype.getNutrinialValues = function () {
    return Foot.calcIntake(this.ingridients, this.eatPercentage);
}

Meal.prototype.eatPercentage = 1;
Meal.prototype.ingridients = [];

Meal.prototype.eat = function () {

}