Array.prototype.sum = function()
{
    var sum = 0;
    for(var i = this.length; -- i >= 0 ;)
    {
        sum += (this[i] === null || this[i] === undefined) ? 0 : this[i];
    }

    return sum;
}

Array.prototype.avarage = function()
{
    return this.sum() / this.length;
}

Array.prototype.each = function(callback)
{
    for(var i = this.length; -- i >= 0 ;)
    {
        if(false === callback(i,this[i]))
        {
            return;
        }
    }
}