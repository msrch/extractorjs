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
            if (defaultObj.hasOwnProperty(key) && _.isUndefined(result[key])) result[key] = defaultObj[key];
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

    _.trim = function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };



    function Extractor(text, settings) {

        var string = (!_.isUndefined(text) && text !== '') ? text : false,
            config = _.isPlainObject(settings) ? settings : {},
            result = {},
            add,
            key;
        
        if (string) {

            // If text string supplied then process it and return object with results.
            config = _.defaults(config, settingDefaults);

            for (key in patterns) {
                if (patterns.hasOwnProperty(key)) {
                    add = true;
                    if (config.filter.length && !~config.filter.indexOf(key)) add = false;
                    if (config.without.length && ~config.without.indexOf(key)) add = false;
                    if (add) result[key] = patterns[key](string);
                }
            }

            return result;

        } else {

            // If function called without any arguments then return pattern methods.
            return _.clone(patterns);
        }
    }

    function buildPattern(regexp) {

        return function findMatch(string) {
            var matches = (string + '').match(regexp) || [];
            return matches.map(_.trim);
        };
    }

    function addPattern(name, regexp) {

        if (!_.isUndefined(patterns[name])) {
            throw new Error('Extractor: Pattern with "' + name + '" name already exists!');
        } else if (!name || !/^[a-zA-Z]+$/.test(name)) {
            throw new Error('Extractor: Invalid pattern name! Accepts only lowercase and uppercase letters.');
        } else if (!_.isRegExp(regexp)) {
            throw new Error('Extractor: Not type of RegExp!');
        } else {
            return patterns[name + ''] = buildPattern(regexp);
        }
    }


    addPattern('emails', /([a-z0-9!#$%&'*+\/=?^_`{|}~-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/gmi);
    addPattern('links', /((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?\xab\xbb\u201c\u201d\u2018\u2019]))/gmi);
    addPattern('times', /\d{1,2}:\d{2}\s?(?:[ap]\.?m\.?)?|\d[ap]\.?m\.?/gmi);
    addPattern('phones', /(\d?\W*(?:\(?\d{3}\)?\W*)?\d{3}\W*\d{4})/gmi);

    function datesRegExp() {
        var month = '(?:jan\\.?|january|feb\\.?|february|mar\\.?|march|apr\\.?|april|may|jun\\.?|june|jul\\.?|july|aug\\.?|august|sep\\.?|september|oct\\.?|october|nov\\.?|november|dec\\.?|december)',
//            day = '(?<!\\:)(?<!\\:\\d)[0-3]?\\d(?:st|nd|rd|th)?',
            day = '(\\d)[0-3]?\\d(?:st|nd|rd|th)?',
            year = '\\d{4}',
            dayMonth = day + '\\s+(?:of\\s+)?' + month,
            monthDay = month + '\\s+' + day,
            optionalYear = '';


        return new RegExp('(?:' + dayMonth + '|' + monthDay + ')' + optionalYear, 'gmi');
    }

    addPattern('dates', datesRegExp());


    /*

     month_regex = ur'(?:jan\.?|january|feb\.?|february|mar\.?|march|apr\.?|april|may|jun\.?|june|jul\.?|july|aug\.?|august|sep\.?|september|oct\.?|october|nov\.?|november|dec\.?|december)'
     day_regex = ur'(?<!\:)(?<!\:\d)[0-3]?\d(?:st|nd|rd|th)?'
     year_regex = ur'\d{4}'
     date_regex = self._group(self._any(day_regex + ur'\s+(?:of\s+)?' + month_regex, month_regex + ur'\s+' + day_regex)) + ur'(?:\,)?\s*' + self._opt(year_regex) + ur'|[0-3]?\d[-/][0-3]?\d[-/]\d{2,4}'

     */

    Extractor.VERSION = '0.0.1';
    Extractor.addPattern = addPattern;
    Extractor.noConflict = function noConflict() {
        root.Extractor = previousExtractor;
        return this;
    };

    Extractor._ = _;
    Extractor.patterns = patterns;

    return Extractor;
});
