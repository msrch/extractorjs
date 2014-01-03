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

});