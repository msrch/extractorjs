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
        return val === true || val === false || (val && _.protoToString(val) === '[object Boolean]') || false;
    };

    _.isFunction = function isFunction(val) {
        return typeof val === 'function';
    };

    _.isPlainObject = function isPlainObject(val) {
        return val && _.protoToString(val) === '[object Object]';
    };

    _.isRegExp = function isRegExp(val) {
        return val && _.protoToString(val) === '[object RegExp]';
    };

    _.protoToString = function protoToString(val) {
        return Object.prototype.toString.call(val);
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
        name: 'dates',
        regexp: (function () {
            var month = '(?:january|jan\\.?|february|feb\\.?|march|mar\\.?|april|apr\\.?|may|june|jun\\.?|july|jul\\.?|august|aug\\.?|september|sep\\.?|october|oct\\.?|november|nov\\.?|december|dec\\.?)',
                day = '[0-3]?\\d(?:st|nd|rd|th)?',
                year = '\\d{2,4}',
                dateSlashed = '[0-3]?\\d[-/][0-3]?\\d[-/]' + year,
                dayMonth = day + '\\s+(?:of\\s+)?' + month,
                monthDay = month + '\\s+' + day,
                optionalYear = '(?:\\,)?\\s*(?:' + year + ')?';
            return new RegExp('(?:' + dayMonth + '|' + monthDay + ')' + optionalYear + '|' + dateSlashed, 'gim');
        }())
    });

    addPattern({
        name: 'emails',
        regexp: /([a-z0-9!#$%&'*+\/=?^_`{|}~-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/gim
    });

    addPattern({
        name: 'hashtags',
        regexp: /#(.+?)(?=[\s.,:,]|$)/gim
    });

    addPattern({
        name: 'links',
        regexp: /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?\xab\xbb\u201c\u201d\u2018\u2019]))/gim
    });

    addPattern({
        name: 'mentions',
        regexp: /\B@([\w\-]+)/gim
    });

    addPattern({
        name: 'phones',
        regexp: /(\d?\W*(?:\(?\d{3}\)?\W*)?\d{3}\W*\d{4})/gim
    });

    addPattern({
        name: 'times',
        regexp: /\d{1,2}:\d{2}\s?(?:[ap]\.?m\.?)?|\d[ap]\.?m\.?/gim
    });

    function youTubeEmbedCode(videoId) {
        return function (w, h) {
            var width = _.isUndefined(w) ? 560 : w,
                height = _.isUndefined(h) ? 315 : h;
            return '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' +
                videoId + '" frameborder="0" allowfullscreen></iframe>'
        };
    }

    addPattern({
        name: 'youtube',
        regexp: /(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@?&%=+\/\$_.-]*/gim,
        postProcessor: function (item) {
            var thumbLink = 'http://img.youtube.com/vi/',
                findId = item.match(/(?:v=|\.be\/){1}([\w\-]{11}){1}/i),
                id = (findId && !_.isUndefined(findId[1])) ? findId[1] : '';
            return {
                embed: youTubeEmbedCode(id),
                id: id,
                link: item,
                thumb: thumbLink + id + '/default.jpg',
                thumbHQ: thumbLink + id + '/hqdefault.jpg'
            }
        }
    });



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
