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

});