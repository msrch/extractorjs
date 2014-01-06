describe('Patterns tests', function () {

    describe('Test for all', function () {

        var text = '@friend I have sent you an email to your address name@web.com on 3rd of June 2013 at 14:36pm \n' +
            'about your web www.some-website.com. Watch this youtu.be/5Jp9_sgJcN0 and then call me (123) 456 7890. \n' +
            '#video #website';

        it('Get all results.', function () {

            var results = Extractor(text);

            expect(results.dates.length).toEqual(1);
            expect(results.dates[0]).toEqual('3rd of June 2013');

            expect(results.emails.length).toEqual(1);
            expect(results.emails[0]).toEqual('name@web.com');

            expect(results.hashtags.length).toEqual(2);
            expect(results.hashtags[0]).toEqual('video');
            expect(results.hashtags[1]).toEqual('website');

            expect(results.links.length).toEqual(2);
            expect(results.links[0]).toEqual('www.some-website.com');
            expect(results.links[1]).toEqual('youtu.be/5Jp9_sgJcN0');

            expect(results.mentions.length).toEqual(1);
            expect(results.mentions[0]).toEqual('friend');

            expect(results.phones.length).toEqual(1);
            expect(results.phones[0]).toEqual('(123) 456 7890');

            expect(results.times.length).toEqual(1);
            expect(results.times[0]).toEqual('14:36pm');

            expect(results.youtube.length).toEqual(1);
            expect(results.youtube[0].embed()).toEqual('<iframe width="560" height="315" src="//www.youtube.com/embed/5Jp9_sgJcN0" frameborder="0" allowfullscreen></iframe>');
            expect(results.youtube[0].id).toEqual('5Jp9_sgJcN0');
            expect(results.youtube[0].thumb).toEqual('http://img.youtube.com/vi/5Jp9_sgJcN0/default.jpg');
            expect(results.youtube[0].thumbHQ).toEqual('http://img.youtube.com/vi/5Jp9_sgJcN0/hqdefault.jpg');
        });
    });

    function buildSimpleTestList(text) {
        var arr = [];
        arr.push(text);
        arr.push('test ' + text);
        arr.push(text + ' test');
        arr.push('test. ' + text + ' test');
        arr.push('test: \ntest ' + text + ' test');
        arr.push('\n' + text + '\n');
        arr.push('   ' + text + '   ');
        return arr;
    }

    function buildHashAndMentionTestList(text) {
        var arr = [];
        arr.push(text + ': test');
        arr.push(text + '. test');
        arr.push(text + ', test');
        arr.push(text + '? test');
        arr.push(text + '! test');
        return arr;
    }

    function testWithList(pattern, list, generator, response, post) {
        var result, tests, i, t;
        for (i = 0; i < list.length; i += 1) {
            tests = generator(list[i]);
            for (t = 0; t < tests.length; t += 1) {
                result = pattern(tests[t]);
                if (response) {
                    expect(result.length).toEqual(1);
                    if (typeof post === 'function') {
                        expect(result[0]).toEqual(post(list[i]));
                    } else {
                        expect(result[0]).toEqual(list[i]);
                    }
                } else {
                    expect(result.length).toEqual(0);
                }
                console.log(tests[t], result);
            }
        }
    }

    function trimFirst(str) {
        return ('' + str).slice(1);
    }

    xdescribe('Pattern - Date formats', function () {

    });

    describe('Pattern - Email formats', function () {

        var pattern = Extractor().emails,
            correct = ['name@surname.com', 'name1.sname2@web.co.uk', 'nam_sur@test.info'],
            corrupted = ['@email.com', 'name@', '@.com', '@.', 'name@.biz', '@'];

        it('Should match.', function () {
            testWithList(pattern, correct, buildSimpleTestList, true);
        });

        it('Should not match.', function () {
            testWithList(pattern, corrupted, buildSimpleTestList, false);
        });
    });

    describe('Pattern - Hash tag values', function () {

        var pattern = Extractor().hashtags,
            correct = ['#test', '#test_name', '#other123'],
            corrupted = ['a#test', '#test#test', '#', '##', 'test#'];

        it('Should match.', function () {
            testWithList(pattern, correct, buildSimpleTestList, true, trimFirst);
            testWithList(pattern, correct, buildHashAndMentionTestList, true, trimFirst);
        });

        it('Should not match.', function () {
            testWithList(pattern, corrupted, buildSimpleTestList, false, trimFirst);
        });
    });

});