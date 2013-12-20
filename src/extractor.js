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

    Extr.addPattern = function addPattern(name, regex) {

    };

    Extr.changePattern = function changePattern(name, regex) {

    };

    Extr.removePattern = function removePattern(name) {

    };


    Extr.VERSION = '0.0.1';

    Extr.noConflict = function noConflict() {
        root.Extractor = previousExtractor;
        return this;
    };

    return Extr;
});
