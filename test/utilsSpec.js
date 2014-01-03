describe('Utility functions', function () {

    describe('_.clone()', function () {

        it('Clone contains exact copy.', function () {
            var o = {a: 1, b: 'test'},
                cloned = _.clone(o);
            expect(o).toEqual(cloned);
        });

        it('Clone properties are not references.', function () {
            var o = {a: 1, b: 'test'},
                cloned = _.clone(o);
            expect(o.a).toEqual(cloned.a);
            expect(o.b).toEqual(cloned.b);
            o.a = 2;
            o.b = 'changed';
            expect(o.a).not.toEqual(cloned.a);
            expect(o.b).not.toEqual(cloned.b);
            expect(cloned.a).toEqual(1);
            expect(cloned.b).toEqual('test');
        });

        it('Empty object returns empty object', function () {
            expect(_.clone({})).toEqual({});
        });
    });

    describe('_.defaults()', function () {

        var defaults = {a: 1, b: 2, c: 3};

        it('Defaults applied correctly.', function () {

            var test1 = _.defaults({b: 'beta'}, defaults),
                test2 = _.defaults({a: 'alfa', b: 'beta'}, defaults),
                test3 = _.defaults({a: 'alfa', c: 'gama'}, defaults),
                test4 = _.defaults({b: 'beta', c: 'gama'}, defaults);

            expect(test1.a).toEqual(1);
            expect(test1.b).toEqual('beta');
            expect(test1.c).toEqual(3);

            expect(test2.a).toEqual('alfa');
            expect(test2.b).toEqual('beta');
            expect(test2.c).toEqual(3);

            expect(test3.a).toEqual('alfa');
            expect(test3.b).toEqual(2);
            expect(test3.c).toEqual('gama');

            expect(test4.a).toEqual(1);
            expect(test4.b).toEqual('beta');
            expect(test4.c).toEqual('gama');
        });

        it('Defaults should not be applied.', function () {
            var test = _.defaults({a: 'alfa', b: 'beta', c: 'gama'}, defaults);
            expect(test.a).toEqual('alfa');
            expect(test.b).toEqual('beta');
            expect(test.c).toEqual('gama');
        });

        it('All defaults should be applied.', function () {

            var test1 = _.defaults({}, defaults),
                test2 = _.defaults({d: 'delta'}, defaults);

            expect(test1.a).toEqual(1);
            expect(test1.b).toEqual(2);
            expect(test1.c).toEqual(3);

            expect(test2.a).toEqual(1);
            expect(test2.b).toEqual(2);
            expect(test2.c).toEqual(3);
        });
    });

    describe('_.isBoolean', function () {

        it('Should pass.', function () {
            expect(_.isBoolean(true)).toBe(true);
            expect(_.isBoolean(false)).toBe(true);
        });

        it('Should not pass.', function () {
            expect(_.isBoolean('string')).toBe(false);
            expect(_.isBoolean('')).toBe(false);
            expect(_.isBoolean(123.45)).toBe(false);
            expect(_.isBoolean(0)).toBe(false);
            expect(_.isBoolean([1, 2, 3])).toBe(false);
            expect(_.isBoolean([])).toBe(false);
            expect(_.isBoolean({a: 1, b: 2})).toBe(false);
            expect(_.isBoolean({})).toBe(false);
            expect(_.isBoolean(/^regex/i)).toBe(false);
            expect(_.isBoolean(function () {})).toBe(false);
            expect(_.isBoolean(null)).toBe(false);
            expect(_.isBoolean(void 0)).toBe(false);
            expect(_.isBoolean(new Date())).toBe(false);
        });
    });

    describe('_.isFunction', function () {

        it('Should pass.', function () {
            expect(_.isFunction(function () {})).toBe(true);
        });

        it('Should not pass.', function () {
            expect(_.isFunction(true)).toBe(false);
            expect(_.isFunction(false)).toBe(false);
            expect(_.isFunction('string')).toBe(false);
            expect(_.isFunction('')).toBe(false);
            expect(_.isFunction(123)).toBe(false);
            expect(_.isFunction(123.45)).toBe(false);
            expect(_.isFunction(0)).toBe(false);
            expect(_.isFunction([1, 2, 3])).toBe(false);
            expect(_.isFunction([])).toBe(false);
            expect(_.isFunction({a: 1, b: 2})).toBe(false);
            expect(_.isFunction({})).toBe(false);
            expect(_.isFunction(/^regex/i)).toBe(false);
            expect(_.isFunction(null)).toBe(false);
            expect(_.isFunction(void 0)).toBe(false);
            expect(_.isFunction(new Date())).toBe(false);
        });
    });

    describe('_.isPlainObject', function () {

        it('Should pass.', function () {
            expect(_.isPlainObject({a: 1, b: 2})).toBe(true);
            expect(_.isPlainObject({})).toBe(true);
        });

        it('Should not pass.', function () {
            expect(_.isPlainObject(function () {})).toBe(false);
            expect(_.isPlainObject(true)).toBe(false);
            expect(_.isPlainObject(false)).toBe(false);
            expect(_.isPlainObject('string')).toBe(false);
            expect(_.isPlainObject('')).toBe(false);
            expect(_.isPlainObject(123)).toBe(false);
            expect(_.isPlainObject(123.45)).toBe(false);
            expect(_.isPlainObject(0)).toBe(false);
            expect(_.isPlainObject([1, 2, 3])).toBe(false);
            expect(_.isPlainObject([])).toBe(false);
            expect(_.isPlainObject(/^regex/i)).toBe(false);
            expect(_.isPlainObject(null)).toBe(false);
            expect(_.isPlainObject(void 0)).toBe(false);
            expect(_.isPlainObject(new Date())).toBe(false);
        });
    });

    describe('_.isRegExp', function () {

        it('Should pass.', function () {
            expect(_.isRegExp(/^regex/i)).toBe(true);
        });

        it('Should not pass.', function () {
            expect(_.isRegExp(function () {})).toBe(false);
            expect(_.isRegExp(true)).toBe(false);
            expect(_.isRegExp(false)).toBe(false);
            expect(_.isRegExp('string')).toBe(false);
            expect(_.isRegExp('')).toBe(false);
            expect(_.isRegExp(123)).toBe(false);
            expect(_.isRegExp(123.45)).toBe(false);
            expect(_.isRegExp(0)).toBe(false);
            expect(_.isRegExp([1, 2, 3])).toBe(false);
            expect(_.isRegExp([])).toBe(false);
            expect(_.isRegExp({a: 1, b: 2})).toBe(false);
            expect(_.isRegExp({})).toBe(false);
            expect(_.isRegExp(null)).toBe(false);
            expect(_.isRegExp(void 0)).toBe(false);
            expect(_.isRegExp(new Date())).toBe(false);
        });
    });

    describe('_.protoToString', function () {

        it('Invoke toString method from Object prototype.', function () {
            expect(_.protoToString({})).toEqual('[object Object]');
            expect(_.protoToString(/^regex/i)).toEqual('[object RegExp]');
        });
    });

    describe('_.isUndefined', function () {

        it('Should pass.', function () {
            expect(_.isUndefined(void 0)).toBe(true);
        });

        it('Should not pass.', function () {
            expect(_.isUndefined(function () {})).toBe(false);
            expect(_.isUndefined(true)).toBe(false);
            expect(_.isUndefined(false)).toBe(false);
            expect(_.isUndefined('string')).toBe(false);
            expect(_.isUndefined('')).toBe(false);
            expect(_.isUndefined(123)).toBe(false);
            expect(_.isUndefined(123.45)).toBe(false);
            expect(_.isUndefined(0)).toBe(false);
            expect(_.isUndefined([1, 2, 3])).toBe(false);
            expect(_.isUndefined([])).toBe(false);
            expect(_.isUndefined({a: 1, b: 2})).toBe(false);
            expect(_.isUndefined({})).toBe(false);
            expect(_.isUndefined(null)).toBe(false);
            expect(_.isUndefined(/^regex/i)).toBe(false);
            expect(_.isUndefined(new Date())).toBe(false);
        });
    });

    describe('_.trim', function () {

        it('Should trim a white space.', function () {
            expect(_.trim('test ')).toEqual('test');
            expect(_.trim(' test')).toEqual('test');
            expect(_.trim(' test ')).toEqual('test');
            expect(_.trim('    test    ')).toEqual('test');
            expect(_.trim('    test test    ')).toEqual('test test');
        });

        it('Should not trim a white space', function () {
            expect(_.trim('')).toEqual('');
            expect(_.trim('test')).toEqual('test');
            expect(_.trim('test test')).toEqual('test test');
            expect(_.trim('test   test')).toEqual('test   test');
            expect(_.trim('test   test   test')).toEqual('test   test   test');
        });
    });

    describe('_.unique', function () {

        it('Should remove duplicates.', function () {
            expect(_.unique([1, 2, 3, 3])).toEqual([1, 2, 3]);
            expect(_.unique([1, 2, 3, 3, 3])).toEqual([1, 2, 3]);
            expect(_.unique([1, 1, 2, 2, 3, 3])).toEqual([1, 2, 3]);
            expect(_.unique([1, 2, 3, 1, 2, 3])).toEqual([1, 2, 3]);
        });

        it('Should not change anything.', function () {
            expect(_.unique([])).toEqual([]);
            expect(_.unique([1, 2, 3])).toEqual([1, 2, 3]);
        });
    });

});