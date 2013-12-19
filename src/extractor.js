!function (name, context, definition) {

    if (typeof define === 'function') {
        define(definition);
    } else if (typeof module !== 'undefined') {
        module.exports = definition();
    } else {
        context[name] = definition();
    }

}('Extractor', this, function () {

    var root = this,
        previousExtractor = root.Extractor;
    
    var _ = {
      
        isDef: function (val) {
            return typeof val !== 'undefined';
        },
        
        sortDesc: function (arr) {
            return arr.sort(function (a, b) {
                return b - a;
            });
        },
        
        uniqueArray: function (arr) {
            return arr.reduce(function(p, c) {
                if (p.indexOf(c) < 0) {
                    p.push(c)
                }
                return p;
            }, []);
        },
        
        strPad: function (arr, len, str) {
            str += '';
            while (str.length < len) {
                str += str[0];
            }
            return arr.map(function (chunk) {
                return (str + chunk).slice(-len);
            });
        }
    };

    function Extr(settings) {

        var config = (typeof settings !== 'object') ? {} : settings;
        
        if (!(this instanceof dPack)) {
            return new dPack(settings);
        }
        
        this.table = _.uniqueArray((_.isDef(config.list) ? config.list : defaults.list).split(''));
        this.delimiter = _.isDef(config.delimiter) ? config.delimiter : defaults.delimiter;
        this.chunk = _.isDef(config.chunk) ? config.chunk : defaults.chunk;
        
        if (this.table.indexOf(this.delimiter) !== -1) {
            throw Error('Delimiter can not be part of the char list!');
        }
    }


    Extr.VERSION = '0.0.1';

    Extr.noConflict = function () {
        root.Extractor = previousExtractor;
        return this;
    };

    return Extr;
});
