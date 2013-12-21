!function (name, context, definition) {

    if (typeof define === 'function') {
        define(definition);
    } else if (typeof module !== 'undefined') {
        module.exports = definition();
    } else {
        context[name] = definition();
    }

}('Extractor', this, function () {

    var _ = {},
        root = this,
        patterns = {},
        previousExtractor = root.Extractor,
        settingDefaults = {
            filter: [],
            without: []
        };

    _.clone = function clone (obj) {
        var cloned = {},
            key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) cloned[key] = obj[key];
        }
        return cloned;
    };

    _.defaults = function defaults(obj, defaultObj) {
        var result = _.clone(obj),
            key;
        for (key in defaultObj) {
            if (defaultObj.hasOwnProperty(key) && _.isUndefined(obj[key])) obj[key] = defaultObj[key];
        }
        return result;
    };

    _.identity = function identity(val) {
        return val;
    };

    _.isPlainObject = function isPlainObject(val) {
        return val && Object.prototype.toString.call(val) === '[object Object]';
    };

    _.isRegExp = function isRegExp(val) {
        return val && Object.prototype.toString.call(val) === '[object RegExp]';
    };

    _.isNot = function isNot(result) {
        return !result;
    };

    _.isUndefined = function isUndefined(val) {
        return typeof val === 'undefined';
    };



    function Extr(text, settings) {

        var string = !_.isUndefined(text) && text !== '' ? text : false,
            config = _.isPlainObject(settings) ? settings : {};
        
        if (string) {

            config = _.defaults(config, settingDefaults);

        } else {
            return _.clone(patterns);
        }
    }

    function buildPattern(regexp) {

        return function findMatch(string) {
            return (string + '').match(regexp) || [];
        };
    }

    function addPattern(name, regexp) {

        if (!_.isUndefined(patterns[name])) {
            throw new Error('Extractor: Pattern already exists!');
        }

        if (name && _.isRegExp(regexp)) {
            patterns[name + ''] = buildPattern(regexp);
            return true;
        } else {
            return false;
        }
    }


    Extr.VERSION = '0.0.1';
    Extr.addPattern = addPattern;

    Extr.noConflict = function noConflict() {
        root.Extractor = previousExtractor;
        return this;
    };

    Extr._ = _;
    Extr.patterns = patterns;

    return Extr;
});
