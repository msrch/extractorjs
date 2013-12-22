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
        previousExtractor = root.Extractor;



    var extractorDefaults = {
            filter: [],
            without: [],
            duplicates: true
    };

    var patternDefaults = {
            name: null,
            regexp: null,
            trim: true,
            postProcessor: null
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

    _.isBoolean = function isBoolean(val) {
        return val === true || val === false ||
            (val && Object.prototype.toString.call(val) === '[object Boolean]') || false;
    };

    _.isFunction = function isFunction(val) {
        return typeof val === 'function';
    };

    _.isPlainObject = function isPlainObject(val) {
        return val && Object.prototype.toString.call(val) === '[object Object]';
    };

    _.isRegExp = function isRegExp(val) {
        return val && Object.prototype.toString.call(val) === '[object RegExp]';
    };

    _.isUndefined = function isUndefined(val) {
        return typeof val === 'undefined';
    };

    _.trim = function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    _.unique = function unique(arr) {
        return arr.reduce(function (result, current) {
            if (!~result.indexOf(current)) result.push(current);
            return result;
        }, []);
    };



    function Extractor(value, settings) {

        var string = (!_.isUndefined(value) && value !== '') ? value : false,
            getSettings = _.isPlainObject(settings) ? settings : {},
            result = {},
            config,
            add,
            key;
        
        if (string) {

            // If text string supplied then process it and return object with results.
            config = _.defaults(getSettings, extractorDefaults);

            for (key in patterns) {
                if (patterns.hasOwnProperty(key)) {
                    add = true;
                    if (config.filter.length && !~config.filter.indexOf(key)) add = false;
                    if (config.without.length && ~config.without.indexOf(key)) add = false;
                    if (add) result[key] = patterns[key](string, config.duplicates);
                }
            }

            return result;

        } else {

            // If function called without any arguments then return pattern methods.
            return _.clone(patterns);
        }
    }

    function buildPattern(config) {

        return function findMatch(string, duplicates) {

            var unique = _.isUndefined(duplicates) ? extractorDefaults.duplicates : !!duplicates,
                result = (string + '').match(config.regexp) || [];

            if (config.trim) result = result.map(_.trim);
            if (_.isFunction(config.postProcessor)) result = result.map(config.postProcessor);
            if (!unique) result = _.unique(result);

            return result;
        };
    }

    function addPattern(settings) {

        var config;

        if (!_.isPlainObject(settings)) {
            throw new Error('Extractor: Add new pattern by passing config object!');
        } else {

            config = _.defaults(settings, patternDefaults);

            if (!config.name || !/^[a-zA-Z]+$/.test(config.name)) {
                throw new Error('Extractor: Invalid pattern name! Accepts only lowercase and uppercase letters.');
            } else if (!_.isUndefined(patterns[config.name])) {
                throw new Error('Extractor: Pattern with "' + config.name + '" name already exists!');
            } else if (!_.isRegExp(config.regexp)) {
                throw new Error('Extractor: Not type of RegExp!');
            } else if (!_.isBoolean(config.trim)) {
                throw new Error('Extractor: Trim has to be a boolean value!');
            } else if (config.postProcessor && !_.isFunction(config.postProcessor)) {
                throw new Error('Extractor: If post-processor set it has to be type of function!');
            } else {
                return patterns[config.name + ''] = buildPattern(config);
            }
        }
    }

    addPattern({
        name: 'emails',
        regexp: /([a-z0-9!#$%&'*+\/=?^_`{|}~-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/gmi
    });

    addPattern({
        name: 'links',
        regexp: /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?\xab\xbb\u201c\u201d\u2018\u2019]))/gmi
    });

    addPattern({
        name: 'phones',
        regexp: /(\d?\W*(?:\(?\d{3}\)?\W*)?\d{3}\W*\d{4})/gmi
    });

    addPattern({
        name: 'times',
        regexp: /\d{1,2}:\d{2}\s?(?:[ap]\.?m\.?)?|\d[ap]\.?m\.?/gmi
    });



    /*
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

    */

    /*

     class CommonRegex:

     def __init__(self, text=""):
     self.text = text

     if text:
     self.dates    = self.dates()
     self.times    = self.times()
     self.phones   = self.phones()
     self.links    = self.links()
     self.emails   = self.emails()

     def _opt(self, regex):
     return ur'(?:' + regex + ur')?'

     def _group(self, regex):
     return ur'(?:' + regex + ')'

     def _any(self, *regexes):
     return ur'|'.join(regexes)

     def _strip(fn, *args, **kwargs):
     def new_fn(*args, **kwargs):
     return [x.strip() for x in fn(*args, **kwargs)]
     return new_fn

     @_strip
     def dates(self, text=None):
     text = text or self.text
     month_regex = ur'(?:jan\.?|january|feb\.?|february|mar\.?|march|apr\.?|april|may|jun\.?|june|jul\.?|july|aug\.?|august|sep\.?|september|oct\.?|october|nov\.?|november|dec\.?|december)'
     day_regex = ur'(?<!\:)(?<!\:\d)[0-3]?\d(?:st|nd|rd|th)?'
     year_regex = ur'\d{4}'
     date_regex = self._group(self._any(day_regex + ur'\s+(?:of\s+)?' + month_regex, month_regex + ur'\s+' + day_regex)) + ur'(?:\,)?\s*' + self._opt(year_regex) + ur'|[0-3]?\d[-/][0-3]?\d[-/]\d{2,4}'
     return re.findall(date_regex, text, re.IGNORECASE)

     @_strip
     def times(self, text=None):
     text = text or self.text
     time_regex = ur'\d{1,2}:\d{2} ?(?:[ap]\.?m\.?)?|\d[ap]\.?m\.?'
     return re.findall(time_regex, text, re.IGNORECASE)

     @_strip
     def phones(self, text=None):
     text = text or self.text
     phone_regex = ur'(\d?\W*(?:\(?\d{3}\)?\W*)?\d{3}\W*\d{4})'
     return re.findall(phone_regex, text)

     @_strip
     def links(self, text=None):
     text = text or self.text
     link_regex = ur'(?i)\b((?:https?://|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?\xab\xbb\u201c\u201d\u2018\u2019]))'
     return re.findall(link_regex, text, re.IGNORECASE)

     @_strip
     def emails(self, text=None):
     text = text or self.text
     email_regex = ur"([a-z0-9!#$%&'*+\/=?^_`{|}~-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)"
     return re.findall(email_regex, text, re.IGNORECASE)

     if __name__ == "__main__":
     parse = CommonRegex("8:00 5:00AM Jan 9th 2012 8/23/12 www.google.com http://hotmail.com (520) 820 7123, 1-230-241-2422 john_smith@gmail.com")
     print parse.dates
     print parse.times
     print parse.phones
     print parse.links
     print parse.emails

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
