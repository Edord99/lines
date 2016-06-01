Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function HueToRgb(m1, m2, hue) {
    var v;
    if (hue < 0)
        hue += 1;
    else if (hue > 1)
        hue -= 1;

    if (6 * hue < 1)
        v = m1 + (m2 - m1) * hue * 6;
    else if (2 * hue < 1)
        v = m2;
    else if (3 * hue < 2)
        v = m1 + (m2 - m1) * (2/3 - hue) * 6;
    else
        v = m1;

    return 255 * v;
}

function hsl2Hex(color) {
    var m1, m2, hue;
    var r, g, b
    var h = Number(color.split(",")[0].split("(")[1]);
    var s = Number(color.split(",")[1].split("%")[0]);
    var l = Number(color.split(",")[2].split("%")[0]);
    s /=100;
    l /= 100;

    if (s == 0)
        r = g = b = (l * 255);
    else {
        if (l <= 0.5)
            m2 = l * (s + 1);
        else
            m2 = l + s - l * s;
        m1 = l * 2 - m2;
        hue = h / 360;
        r = Math.round(HueToRgb(m1, m2, hue + 1/3));
        g = Math.round(HueToRgb(m1, m2, hue));
        b = Math.round(HueToRgb(m1, m2, hue - 1/3));
    }
    var str = componentToHex(r) + componentToHex(g) + componentToHex(b);
    return str;
}

var keys = {
	"67":"c",
	"68":"d",
	"69":"e",
	"73":"i",
	"77":"m",
	"79":"o",
	"82":"r",
	"83":"s",
	"86":"v",
	"87":"w",
	"88":"x",
	"90":"z",
	"32":"space"
}

// vector stuff
function getDistance(a, b) {
	var xs = 0;
	var ys = 0;
	xs = b.x - a.x;
	xs = xs * xs;
	ys = b.y - a.y;
	ys = ys * ys;
	return Math.sqrt(xs + ys);
}

function Point(x, y) {
	this.x = x;
	this.y = y;
}

function Vector(a, b) {
	this.x = a.x - b.x;
	this.y = a.y - b.y;
	this.subtract = function(vector) {
		this.x -= vector.x;
		this.y -= vector.y;
	};
	this.multiply = function(n) {
		this.x *= n;
		this.y *= n;
	};
	this.divide = function(n) {
		this.x /= n;
		this.y /= n;
	};
	this.magnitude = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y);
	};
	
	this.normalize = function() {
		var m = this.magnitude();
		if (m != 0 && m != 1) this.divide(m);
	};
}