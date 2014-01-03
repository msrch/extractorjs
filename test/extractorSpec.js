describe('Extractor instance', function () {

    describe('Extractor()', function () {

        it('Should return results', function () {

            var test1 = Extractor('time 12:00'),
                test2 = Extractor('time 12:00AM and 24:00'),
                test3 = Extractor('time 12:00 and again 12:00');

            expect(test1.times.length).toEqual(1);
            expect(test1.times[0]).toEqual('12:00');
            expect(test1.dates.length).toEqual(0);

            expect(test2.times.length).toEqual(2);
            expect(test2.times[0]).toEqual('12:00AM');
            expect(test2.times[1]).toEqual('24:00');

            expect(test3.times.length).toEqual(2);
            expect(test3.times[0]).toEqual('12:00');
            expect(test3.times[1]).toEqual('12:00');
        });

        it('Should accept settings and remove duplicates', function () {
            var test = Extractor('time 12:00 and again 12:00', {duplicates: false});
            expect(test.times.length).toEqual(1);
            expect(test.times[0]).toEqual('12:00');
        });

        it('Should accept settings and filter only times', function () {
            var test = Extractor('time 12:00', {filter: ['times']});
            expect(test.times.length).toEqual(1);
            expect(test.times[0]).toEqual('12:00');
            expect(test.dates).not.toBeDefined();
        });

        it('Should accept settings and return results without times', function () {
            var test = Extractor('time 12:00', {without: ['times']});
            expect(test.times).not.toBeDefined();
            expect(test.dates).toBeDefined();
            expect(test.dates.length).toEqual(0);
        });

        it('If string not supplied return pattern methods', function () {
            var test = Extractor();
            expect(test.times).toBeDefined();
            expect(typeof test.times === 'function').toBe(true);
            expect(test.times('time 12:00')[0]).toEqual('12:00');
        });
    });

    describe('addPattern()', function () {

        it('Should throw an error', function () {
            expect(function() {Extractor.addPattern();}).toThrow();
            expect(function() {Extractor.addPattern({name: ''});}).toThrow();
            expect(function() {Extractor.addPattern({name: '!@£$%^&* '});}).toThrow();
            expect(function() {Extractor.addPattern({name: 'times'});}).toThrow();
            expect(function() {Extractor.addPattern({name: 'test', regexp: 'not'});}).toThrow();
            expect(function() {Extractor.addPattern({name: 'test', regexp: /^test$/gim, trim: 'string'});}).toThrow();
            expect(function() {Extractor.addPattern({name: 'test', regexp: /^test$/gim, trim: true, postProcessor: 'noop'});}).toThrow();
        });

        it('Should add a new pattern.', function () {

            var test;

            expect(function() {
                test = Extractor.addPattern({
                    name: 'testOne',
                    regexp: /test/gim,
                    trim: true,
                    postProcessor: function (val) {
                        return val + '1';
                    }
                });
            }).not.toThrow();

            expect(typeof test === 'function').toBe(true);
            expect(test('test new pattern')[0]).toEqual('test1');
            expect(test('test and TEST').length).toEqual(2);
            expect(test('not a match')).toEqual([]);
        });

        it('New pattern should be added.', function () {
            var test = Extractor();
            expect(test.testOne).toBeDefined();
            expect(typeof test.testOne === 'function').toBe(true);
            expect(test.testOne('test new pattern')[0]).toEqual('test1');
        });
    });

});
