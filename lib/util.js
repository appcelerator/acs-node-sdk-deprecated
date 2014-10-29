var capitalizedString = function(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
};

var typeOf = function(value) {
	if (null === value) {
		return 'null';
	}
	var type = typeof value;
	if ('object' === type) {
		var typeString = Object.prototype.toString.call(value);
		switch (typeString) {
			case '[object Array]':
				return 'array';
			case '[object Date]':
				return 'date';
			case '[object Boolean]':
				return 'boolean';
			case '[object Number]':
				return 'number';
			case '[object Function]':
				return 'function';
			case '[object RegExp]':
				return 'regexp';
			case '[object Object]':
				return 'object';
			default:
				return 'unknown';
		}
	}
	return type;
};

module.exports.capitalizedString = capitalizedString;
module.exports.typeOf = typeOf;
