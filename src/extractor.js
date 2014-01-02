/** Utility values. */
var _ = {},
    root = this,
    previousExtractor = root.Extractor;

/**
 * Object holding pattern methods.
 *
 * @type {Object} Pattern container.
 */
var patterns = {};

/**
 * Default config object for Extractor attributes.
 *
 * @type {Object}
 */
var extractorDefaults = {
    filter: [],
    without: [],
    duplicates: true
};

/**
 * Default config object for addPattern attributes.
 *
 * @type {Object}
 */
var patternDefaults = {
    name: null,
    regexp: null,
    trim: true,
    postProcessor: null
};



/**
 * Clone passed object - shallow copy.
 *
 * @param {Object} obj Source object.
 * @returns {Object} Cloned object.
 */
_.clone = function clone (obj) {
    var cloned = {},
        key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) cloned[key] = obj[key];
    }
    return cloned;
};

/**
 * Apply defaults on passed object.
 *
 * @param {Object} obj Source object.
 * @param {Object} defaultObj Object containing defaults.
 * @returns {Object} Object with applied defaults.
 */
_.defaults = function defaults(obj, defaultObj) {
    var result = _.clone(obj),
        key;
    for (key in defaultObj) {
        if (defaultObj.hasOwnProperty(key) && _.isUndefined(result[key])) result[key] = defaultObj[key];
    }
    return result;
};

/**
 * Test if a value is a type of boolean.
 *
 * @param {Object} val The value to be tested.
 * @returns {Boolean} Test result.
 */
_.isBoolean = function isBoolean(val) {
    return val === true || val === false || (val && _.protoToString(val) === '[object Boolean]') || false;
};

/**
 * Test if a value is a type of function.
 *
 * @param {Object} val The value to be tested.
 * @returns {Boolean} Test result.
 */
_.isFunction = function isFunction(val) {
    return typeof val === 'function';
};

/**
 * Test if a value is a type of plain object.
 *
 * @param {Object} val The value to be tested.
 * @returns {Boolean} Test result.
 */
_.isPlainObject = function isPlainObject(val) {
    return val && _.protoToString(val) === '[object Object]';
};

/**
 * Test if a value is a type of regular expression.
 *
 * @param {Object} val The value to be tested.
 * @returns {Boolean} Test result.
 */
_.isRegExp = function isRegExp(val) {
    return val && _.protoToString(val) === '[object RegExp]';
};

/**
 * Test if a value is a type of string.
 *
 * @param {Object} val The value to be tested.
 * @returns {Boolean} Test result.
 */
_.protoToString = function protoToString(val) {
    return Object.prototype.toString.call(val);
};

/**
 * Test if a value is undefined.
 *
 * @param {Object} val The value to be tested.
 * @returns {Boolean} Test result.
 */
_.isUndefined = function isUndefined(val) {
    return typeof val === 'undefined';
};

/**
 * Safe trim of a white space from a string.
 *
 * @param {String} str String to be trimmed.
 * @returns {String} Trimmed string.
 */
_.trim = function trim(str) {
    return ('' + str).replace(/^\s+|\s+$/g, '');
};

/**
 * Remove duplicates from an array.
 *
 * @param {Array} arr Source array.
 * @returns {Array} Array without duplicates.
 */
_.unique = function unique(arr) {
    return arr.reduce(function (result, current) {
        if (!~result.indexOf(current)) result.push(current);
        return result;
    }, []);
};



/**
 * Main Extractor instance.
 * If you pass a string value (and settings) you will receive an object with results.
 * Otherwise you will get an object with pattern methods.
 *
 * @param {string} [value=false] String value to be parsed.
 * @param {Object} [settings={}] Optional settings.
 * @returns {Object} Extractor methods or results.
 */
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

/**
 * Used to crate a pattern method from config object.
 *
 * @param {Object} config Pattern settings.
 * @returns {Function} Pre-filled function which accepts String and a Boolean as a flag: true - include duplicates,
 *   false - remove duplicates (default: true)
 */
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

/**
 * Add a pattern to the library of methods.
 * Performs a validation of the config object.
 *
 * @param {Object} settings Pattern settings.
 * @returns {Function} Created methods.
 */
function addPattern(settings) {

    var config,
        name;

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
            name = config.name + '';
            patterns[name] = buildPattern(config);
            return patterns[name];
        }
    }
}


/** Pattern - Date formats */
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

/** Pattern - Email formats */
addPattern({
    name: 'emails',
    regexp: /([a-z0-9!#$%&'*+\/=?^_`{|}~-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/gim
});

/** Pattern - Hash tag values */
addPattern({
    name: 'hashtags',
    regexp: /#(.+?)(?=[\s.,:,]|$)/gim
});

/** Pattern - Web links */
addPattern({
    name: 'links',
    regexp: /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?\xab\xbb\u201c\u201d\u2018\u2019]))/gim
});

/** Pattern - Mention values */
addPattern({
    name: 'mentions',
    regexp: /\B@([\w\-]+)/gim
});

/** Pattern - Phone formats */
addPattern({
    name: 'phones',
    regexp: /(\d?\W*(?:\(?\d{3}\)?\W*)?\d{3}\W*\d{4})/gim
});

/** Pattern - Time formats */
addPattern({
    name: 'times',
    regexp: /\d{1,2}:\d{2}\s?(?:[ap]\.?m\.?)?|\d[ap]\.?m\.?/gim
});

/**
 * Helper for YouTube pattern method.
 * Creates a function that returns an embed code - you can set custom width and height otherwise it will fallback
 * to default values (560x315).
 *
 * @param {String} videoId Video ID.
 * @returns {Function} Pre-filled function that returns an embed code.
 */
function youTubeEmbedCode(videoId) {
    return function (w, h) {
        var width = _.isUndefined(w) ? 560 : w,
            height = _.isUndefined(h) ? 315 : h;
        return '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' +
            videoId + '" frameborder="0" allowfullscreen></iframe>';
    };
}

/** Pattern - YouTube links (returns an object with: embed code, id, link and thumbnail image link) */
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
        };
    }
});



/** Build public API */
Extractor.addPattern = addPattern;
Extractor.noConflict = function noConflict() {
    root.Extractor = previousExtractor;
    return this;
};
