/*!
 * extractorjs v0.0.1 - Extract common information from a string.
 * (c) 2014 Michal Srch
 */
!function(name, context, definition) {
    "function" == typeof define ? define(definition) : "undefined" != typeof module ? module.exports = definition() : context[name] = definition();
}("Extractor", this, function() {
    function Extractor(value, settings) {
        var config, add, key, string = _.isUndefined(value) || "" === value ? !1 : value, getSettings = _.isPlainObject(settings) ? settings : {}, result = {};
        if (string) {
            config = _.defaults(getSettings, extractorDefaults);
            for (key in patterns) patterns.hasOwnProperty(key) && (add = !0, config.filter.length && !~config.filter.indexOf(key) && (add = !1), 
            config.without.length && ~config.without.indexOf(key) && (add = !1), add && (result[key] = patterns[key](string, config.duplicates)));
            return result;
        }
        return _.clone(patterns);
    }
    function buildPattern(config) {
        return function(string, duplicates) {
            var unique = _.isUndefined(duplicates) ? extractorDefaults.duplicates : !!duplicates, result = (string + "").match(config.regexp) || [];
            return config.trim && (result = result.map(_.trim)), _.isFunction(config.postProcessor) && (result = result.map(config.postProcessor)), 
            unique || (result = _.unique(result)), result;
        };
    }
    function addPattern(settings) {
        var config, name;
        if (_.isPlainObject(settings)) {
            if (config = _.defaults(settings, patternDefaults), config.name && /^[a-zA-Z]+$/.test(config.name)) {
                if (_.isUndefined(patterns[config.name])) {
                    if (_.isRegExp(config.regexp)) {
                        if (_.isBoolean(config.trim)) {
                            if (config.postProcessor && !_.isFunction(config.postProcessor)) throw new Error("Extractor: If post-processor set it has to be type of function!");
                            return name = config.name + "", patterns[name] = buildPattern(config), patterns[name];
                        }
                        throw new Error("Extractor: Trim has to be a boolean value!");
                    }
                    throw new Error("Extractor: Not type of RegExp!");
                }
                throw new Error('Extractor: Pattern with "' + config.name + '" name already exists!');
            }
            throw new Error("Extractor: Invalid pattern name! Accepts only lowercase and uppercase letters.");
        }
        throw new Error("Extractor: Add new pattern by passing config object!");
    }
    function youTubeEmbedCode(videoId) {
        return function(w, h) {
            var width = _.isUndefined(w) ? 560 : w, height = _.isUndefined(h) ? 315 : h;
            return '<iframe width="' + width + '" height="' + height + '" src="//www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
        };
    }
    var _ = {}, root = this, previousExtractor = root.Extractor, patterns = {}, extractorDefaults = {
        filter: [],
        without: [],
        duplicates: !0
    }, patternDefaults = {
        name: null,
        regexp: null,
        trim: !0,
        postProcessor: null
    };
    return _.clone = function(obj) {
        var key, cloned = {};
        for (key in obj) obj.hasOwnProperty(key) && (cloned[key] = obj[key]);
        return cloned;
    }, _.defaults = function(obj, defaultObj) {
        var key, result = _.clone(obj);
        for (key in defaultObj) defaultObj.hasOwnProperty(key) && _.isUndefined(result[key]) && (result[key] = defaultObj[key]);
        return result;
    }, _.isBoolean = function(val) {
        return val === !0 || val === !1 || val && "[object Boolean]" === _.protoToString(val) || !1;
    }, _.isFunction = function(val) {
        return "function" == typeof val;
    }, _.isPlainObject = function(val) {
        return val && "[object Object]" === _.protoToString(val) || !1;
    }, _.isRegExp = function(val) {
        return val && "[object RegExp]" === _.protoToString(val) || !1;
    }, _.protoToString = function(val) {
        return Object.prototype.toString.call(val);
    }, _.isUndefined = function(val) {
        return "undefined" == typeof val;
    }, _.trim = function(str) {
        return ("" + str).replace(/^\s+|\s+$/g, "");
    }, _.unique = function(arr) {
        return arr.reduce(function(result, current) {
            return ~result.indexOf(current) || result.push(current), result;
        }, []);
    }, addPattern({
        name: "dates",
        regexp: function() {
            var month = "(?:january|jan\\.?|february|feb\\.?|march|mar\\.?|april|apr\\.?|may|june|jun\\.?|july|jul\\.?|august|aug\\.?|september|sep\\.?|october|oct\\.?|november|nov\\.?|december|dec\\.?)", day = "[0-3]?\\d(?:st|nd|rd|th)?", year = "\\d{2,4}", dateSlashed = "[0-3]?\\d[-/][0-3]?\\d[-/]" + year, dayMonth = day + "\\s+(?:of\\s+)?" + month, monthDay = month + "\\s+" + day, optionalYear = "(?:\\,)?\\s*(?:" + year + ")?";
            return new RegExp("(?:" + dayMonth + "|" + monthDay + ")" + optionalYear + "|" + dateSlashed, "gim");
        }()
    }), addPattern({
        name: "emails",
        regexp: /([a-z0-9!#$%&'*+\/=?^_`{|}~-]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)/gim
    }), addPattern({
        name: "hashtags",
        regexp: /#(.+?)(?=[\s.,:,]|$)/gim
    }), addPattern({
        name: "links",
        regexp: /\b((?:https?:\/\/|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\))+(?:\((?:[^\s()<>]+|(?:\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?\xab\xbb\u201c\u201d\u2018\u2019]))/gim
    }), addPattern({
        name: "mentions",
        regexp: /\B@([\w\-]+)/gim
    }), addPattern({
        name: "phones",
        regexp: /(\d?\W*(?:\(?\d{3}\)?\W*)?\d{3}\W*\d{4})/gim
    }), addPattern({
        name: "times",
        regexp: /\d{1,2}:\d{2}\s?(?:[ap]\.?m\.?)?|\d[ap]\.?m\.?/gim
    }), addPattern({
        name: "youtube",
        regexp: /(?:http|https|)(?::\/\/|)(?:www.|)(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/ytscreeningroom\?v=|\/feeds\/api\/videos\/|\/user\S*[^\w\-\s]|\S*[^\w\-\s]))([\w\-]{11})[a-z0-9;:@?&%=+\/\$_.-]*/gim,
        postProcessor: function(item) {
            var thumbLink = "http://img.youtube.com/vi/", findId = item.match(/(?:v=|\.be\/){1}([\w\-]{11}){1}/i), id = findId && !_.isUndefined(findId[1]) ? findId[1] : "";
            return {
                embed: youTubeEmbedCode(id),
                id: id,
                link: item,
                thumb: thumbLink + id + "/default.jpg",
                thumbHQ: thumbLink + id + "/hqdefault.jpg"
            };
        }
    }), Extractor.addPattern = addPattern, Extractor.noConflict = function() {
        return root.Extractor = previousExtractor, this;
    }, Extractor.VERSION = "0.0.1", Extractor;
});