/**
 * @copyright Copyright (c) 2011 Romain d'Alverny
 * @license http://www.gnu.org/licenses/gpl-3.0.html GNU GPL v3 and later
 *
 * Redirect browser online IF it is in online mode.
 * Or stay on offline page and listen to online event.
 *
 * Browser targets: Mozilla Firefox 3.6+, Konqueror.
*/

function StartPage(url, image) {
    this.location = url;
    this.onlinePx = image;
}

StartPage.prototype.run = function () {
    if (navigator.onLine !== null) {
        if (navigator.onLine) {
          this.actOnline();
        } else {
          this.actOffline();
        }
    } else { // for khtml-based browsers
        try {
            var sp = this,
                i = document.createElement('img');

            window.alert = function() {};

            i.id = 'i';
            i.onload = function () { console.log(sp); sp.actOnline(); };
            i.onerror = function () { sp.actOffline(); };
            i.src = this.onlinePx + '?' + new Date().getTime();
            document.getElementsByTagName('body').item(0).appendChild(i);
        }
        catch (e) { return false; }
    }

    return true;
};

StartPage.prototype.actOnline = function () {
    var product_id = '',
        lang = '',
        args = [];

    document.getElementsByTagName("body").item(0).setAttribute("class", "");

    if (null !== (product_id = this.getProductId())) {
        args.push('p=' + product_id);
    }

    if (null !== (lang = this.getLocale())) {
        args.push('l=' + lang);
    }

    if (args.length > 0) {
        this.location = [this.location, args.join('&')].join('?');
    }
    parent.location = this.location;

    return true;
};

StartPage.prototype.actOffline = function () {
    var p = this,
        i = document.getElementById("i");

    if (null !== i) {
        i.parentNode.removeChild(i);
    }
    document.getElementsByTagName("body").item(0).setAttribute("class", "offline");
    document.body.addEventListener("online", function () { p.actOnline(); }, false);

    return true;
};

StartPage.prototype.getLocale = function () {
    var ret = null;

    try {
        ret = parent.window.document.documentElement.attributes.getNamedItem('lang').value.trim();
    } catch (e) {}

    return ret;
};

StartPage.prototype.getProductId = function () {
    var ret = null,
        t = document.getElementsByTagName('meta');

    for (var i = 0; i < t.length; i += 1) {
        if (t.item(i).getAttribute('name') === 'product:id') {
            ret = t.item(i).getAttribute('content').trim();
            break;
        }
    }

    return ret;
};
