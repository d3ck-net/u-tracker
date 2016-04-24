Date.prototype.getAge = function() {
    var today = new Date();
    var birthDate = this;
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

Date.prototype.getStartOfDay = function()
{
    var date = new Date(this);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    return date;
}
