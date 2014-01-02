!function (name, context, definition) {

    if (typeof define === 'function') {
        define(definition);
    } else if (typeof module !== 'undefined') {
        module.exports = definition();
    } else {
        context[name] = definition();
    }

}('Extractor', this, function () {

    /* @inject extractor.js */

    /** Return public API */
    Extractor.VERSION = '@@version';
    return Extractor;
});
