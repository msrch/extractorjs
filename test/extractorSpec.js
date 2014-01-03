describe('Extractor instance', function () {

    describe('Extractor constructor', function () {

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


    });

});