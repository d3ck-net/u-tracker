/**
 *
 * @constructor
 */
Tools = function Tools()
{

}

/**
 * converts an object to an array
 * @param {{}} obj
 * @returns {Array}
 */
Tools.arrayify = function (obj) {
    var result = [];
    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {

            result.push(obj[key]);
        }
    }
    return result;
};
Tools.each = function(data,cb)
{
    for(var key in data)
    {
        if(cb(key,data[key]) === false)
        {
            return;
        }
    }
}

Tools.copyTextToClipboard = function (text) {
    var textArea = document.createElement("textarea");

    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a flash,
    // so some of these are just precautions. However in IE the element
    // is visible whilst the popup box asking the user for permission for
    // the web page to copy to the clipboard.
    //

    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;

    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';

    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;

    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';

    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';


    textArea.value = text;

    document.body.appendChild(textArea);

    textArea.select();

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Copying text command was ' + msg);
    } catch (err) {
        console.log('Oops, unable to copy');
    }

    document.body.removeChild(textArea);
}

Tools.uid = function()
{
    return "uid";
}
Tools.round = function(x)
{
    var prec = 10;
    return Math.round(x*prec)/prec;
}
Tools.extend = function(a,b)
{
    for(var key in b)
    {
        a[key] = b[key];
    }
}
Tools.stackedTimeouts = {};
Tools.stackedTimeout = function (func, name, time) {
    if (!func) {
        throw "define a funcion";
    }
    if (!name) {
        "define a name";
    }
    if (!time) {
        time = 100;
    }

    clearTimeout(Tools.stackedTimeouts[name]);
    Tools.stackedTimeouts[name] = setTimeout(func, time);
}