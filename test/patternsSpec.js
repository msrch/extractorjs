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
            expect(results.youtube[0].link).toEqual('youtu.be/5Jp9_sgJcN0');
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
            }
        }
    }

    function trimFirst(str) {
        return ('' + str).slice(1);
    }

    describe('Pattern - Date formats', function () {

        var pattern = Extractor().dates,
            correct = [
                '1/1/2014',
                '1/12/2014',
                '01/12/2014',
                '12/12/2014',
                '12/12/14',
                '12-12-2014',
                '1st January',
                '2nd February 2014',
                '3rd Jun 2014',
                '4th Oct',
                '12th of December 2014',
                '28 July 2014',
                'May 12 2014',
                'March 31st 2014'
            ],
            corrupted = [
                '2014 12 8',
                '2014/12/8',
                '12_02_2014',
                '12 2 2014',
                '40/60/20',
                '12-12-',
                '1212-2013',
                '12 Dc 2013'
            ];

        it('Should match.', function () {
            testWithList(pattern, correct, buildSimpleTestList, true);
        });

        it('Should not match.', function () {
            testWithList(pattern, corrupted, buildSimpleTestList, false);
        });
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

    describe('Pattern - Web links', function () {

        var pattern = Extractor().links,
            correct = [
                'www.link.com',
                'www.li-nk.com',
                'www.li-nk01.co.uk',
                'www.link.com/',
                'http://www.link.com',
                'http://link.com',
                'https://www.link.com/',
                'http://www.link.com/test',
                'link.com/test',
                'http://www.link.com/test.html',
                'http://www.link.com/test.html?q=1',
                'http://www.link.com/test.html?q=1&w=2',
                'http://www.link.com/test.html?q=1&w=2#test'
            ],
            corrupted = ['www. link. com', 'www link. com', 'www link.com'];

        it('Should match.', function () {
            testWithList(pattern, correct, buildSimpleTestList, true);
        });

        it('Should not match.', function () {
            testWithList(pattern, corrupted, buildSimpleTestList, false);
        });
    });

    describe('Pattern - Mention values', function () {

        var pattern = Extractor().mentions,
            correct = ['@test', '@test_name', '@oth-er123'],
            corrupted = ['a@test', '@test@test', '@', '@@', 'test@'];

        it('Should match.', function () {
            testWithList(pattern, correct, buildSimpleTestList, true, trimFirst);
            testWithList(pattern, correct, buildHashAndMentionTestList, true, trimFirst);
        });

        it('Should not match.', function () {
            testWithList(pattern, corrupted, buildSimpleTestList, false, trimFirst);
        });
    });

    describe('Pattern - Mention values', function () {

        var pattern = Extractor().mentions,
            correct = ['@test', '@test_name', '@oth-er123'],
            corrupted = ['a@test', '@test@test', '@', '@@', 'test@'];

        it('Should match.', function () {
            testWithList(pattern, correct, buildSimpleTestList, true, trimFirst);
            testWithList(pattern, correct, buildHashAndMentionTestList, true, trimFirst);
        });

        it('Should not match.', function () {
            testWithList(pattern, corrupted, buildSimpleTestList, false, trimFirst);
        });
    });

    describe('Pattern - Phone formats', function () {

        var pattern = Extractor().phones,
            correct = [
                '123-456-7890',
                '123 456 7890',
                '123 - 456 - 7890',
                '(123) 456 7890',
                '(123)-456-7890',
                '+44 123 456 7890',
                '+441234567890',
                '0044 123 456 7890',
                '0044-123-456-7890',
                '(+44) 123 456 7890',
                '(+44) 1234567890',
                '0123 456 7890',
                '0123 4567890',
                '01234567890',
                '456 7890'
            ],
            corrupted = [
                '123-45a-7890',
                '123-456-789a',
                '123456',
                '12345',
                '1234',
                '123',
                '12',
                '1'
            ];

        it('Should match.', function () {
            testWithList(pattern, correct, buildSimpleTestList, true);
        });

        it('Should not match.', function () {
            testWithList(pattern, corrupted, buildSimpleTestList, false);
        });
    });

    describe('Pattern - Time formats', function () {

        var pattern = Extractor().times,
            correct = [
                '12:00:00',
                '12:00.00',
                '24:00:00am',
                '24:00:00 am',
                '12:00:00PM',
                '12:00:00 P.M.',
                '1am',
                '3p.M.',
                '1:11',
                '1:11aM',
                '1:11 aM',
                '1:11Pm',
                '01:11',
                '01:11Am',
                '01:11pM',
                '01:11a.m.',
                '01:11p.m.',
                '01:11 A.m.',
                '01:11 p.M.'
            ],
            corrupted = ['12.12.12', '12/12', '12-12', '12:am'];

        it('Should match.', function () {
            testWithList(pattern, correct, buildSimpleTestList, true);
        });

        it('Should not match.', function () {
            testWithList(pattern, corrupted, buildSimpleTestList, false);
        });
    });

    describe('Pattern - YouTube links', function () {

        var pattern = Extractor().youtube,
            id = '5Jp9_sgJcN0',
            correct = [
                'https://youtu.be/' + id,
                'https://www.youtube.com/embed/' + id,
                'youtu.be/' + id,
                'youtube.com/watch?v=' + id,
                'http://youtu.be/' + id,
                'http://www.youtube.com/embed/' + id,
                'http://www.youtube.com/watch?v=' + id,
                'http://www.youtube.com/watch?v=' + id + '&feature=g-vrec',
                'http://www.youtube.com/watch?v=' + id + '&feature=player_embedded',
                'http://www.youtube.com/v/' + id + '?fs=1&hl=en_US',
                'http://www.youtube.com/ytscreeningroom?v=' + id,
                'http://www.youtube.com/watch?NR=1&feature=endscreen&v=' + id,
                'http://www.youtube.com/user/SomeUser#p/u/1/' + id,
                'http://www.youtube.com/watch?v=' + id + '&feature=c4-overview-vl&list=PLbzoR-pLrL6qucl8-lOnzvhFc2UM1tcZA'
            ],
            corrupted = [
                'http://www.youtube.com /embed/' + id,
                'http://www.youtube.com' + id + '?fs=1&hl=en_US',
                'http://www.youtubee.com/' + id,
                'youtu.be.com/' + id
            ];

        it('Should match.', function () {
            var result, tests, i, t;
            for (i = 0; i < correct.length; i += 1) {
                tests = buildSimpleTestList(correct[i]);
                for (t = 0; t < tests.length; t += 1) {
                    result = pattern(tests[t]);
                    expect(result.length).toEqual(1);
                    expect(result[0].link).toEqual(correct[i]);
                }
            }
        });

        it('Should return correct structure.', function () {
            var result = pattern(correct[0]);
            expect(result.length).toEqual(1);
            expect(result[0].id).toEqual(id);
            expect(result[0].link).toEqual(correct[0]);
            expect(result[0].thumb).toEqual('http://img.youtube.com/vi/' + id + '/default.jpg');
            expect(result[0].thumbHQ).toEqual('http://img.youtube.com/vi/' + id + '/hqdefault.jpg');
        });

        it('Embed code returns correct snippet.', function () {
            var result = pattern(correct[0]);
            expect(result[0].embed()).toEqual('<iframe width="560" height="315" src="//www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>');
            expect(result[0].embed(640)).toEqual('<iframe width="640" height="315" src="//www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>');
            expect(result[0].embed(640, 480)).toEqual('<iframe width="640" height="480" src="//www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe>');
        });

        it('Should not match.', function () {
            testWithList(pattern, corrupted, buildSimpleTestList, false);
        });
    });

});
