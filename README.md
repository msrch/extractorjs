# Extractor.js

> Extract common information from a string.



## About

**Extractor.js** is a small library that helps to extract common information like dates, times, emails or links from
text. It also provides an easy way how to add new patterns to extract new things.

### Patterns

Following patterns are incorporated in this library:

* **Date formats**
* **Email formats**
* **Hash tags**
* **Web links**
* **Mentions**
* **Phone formats**
* **Time formats**
* **YouTube links**

### Example

Here is an example paragraph of text:

```
@friend I have sent you an email to your address name@web.com
on 3rd of June 2013 at 12:36pm about your web www.some-website.com.
Watch this youtu.be/5Jp9_sgJcN0 and then call me (123) 456 7890.
#video #website
```

Following information/values will be extracted:

```json
{
  "dates": ["3rd of June 2013"],
  "emails": ["name@web.com"],
  "hashtags": ["video", "website"],
  "links": ["www.some-website.com", "youtu.be/5Jp9_sgJcN0"],
  "mentions": ["friend"],
  "phones": ["(123) 456 7890"],
  "times": ["12:36pm"],
  "youtube":[
    {
      "id": "5Jp9_sgJcN0",
      "link": "youtu.be/5Jp9_sgJcN0",
      "thumb": "http://img.youtube.com/vi/5Jp9_sgJcN0/default.jpg",
      "thumbHQ": "http://img.youtube.com/vi/5Jp9_sgJcN0/hqdefault.jpg"
    }
  ]
}
```



## How to use

There are two main way how to **Extractor.js**:

### 1. Pass a text string → receive an object with results

```javascript
var results = Extractor('Lorem #ipsum text...');
// results.hashtags = ['ipsum']
```

The result is an object containing the structure mentioned above.

#### YouTube results

Besides `id`, `link`, `thumb` and `thumbHQ` values there is also a method called `embed`. This allows you to generate
an embed code. You can customise the _width_ and _height_ of the `<iframe>`. Default dimensions are _560x315_.

```javascript
var yt = Extractor('Example youtu.be/5Jp9_sgJcN0 link.'),
    ytEmbed = yt.youtube[0].embed;

ytEmbed();
// <iframe width="560" height="315" src="//www.youtube.com/embed/5Jp9_sgJcN0" frameborder="0" allowfullscreen></iframe>

ytEmbed(640, 480);
// <iframe width="640" height="480" src="//www.youtube.com/embed/5Jp9_sgJcN0" frameborder="0" allowfullscreen></iframe>
```

### 2. Calling without arguments → receive pattern methods

```javascript
var ex = Extractor();

ex.dates('Try 3rd of June 2013');
// ["3rd of June 2013"]

ex.emails('Try some@email.com');
// ["some@email.com"]
```

Methods match the names of the patterns/variables mentioned above.

#### Duplicates

By specifying a second argument `Boolean` you can remove duplicate values. Duplicates are left by default (_true_).

```javascript
ex.mentions('Try @one @two and @one');
ex.mentions('Try @one @two and @one', true);
// ["one", "two", "one"]

ex.mentions('Try @one @two and @one', false);
// ["one", "two"]
```



## Advanced usage

### Options for Extractor()

You can pass additional settings when parsing a string.

```javascript
var results = Extractor('Lorem ipsum...', {/* additional settings */});
```

#### filter
type: `Array`
default: `[]`

Returned object contains only results from patterns specified in the filter.

```javascript
var dateAndTime = Extractor('Try 1st Jun at 2:00 pm', {
        filter: ['dates', 'times']
    });
// {"dates": ["1st Jun"], "times": ["2:00 pm"]}
```

#### without
type: `Array`
default: `[]`

Returned object contains all results except the patterns specified in the array.

```javascript
var withoutExample = Extractor('Try 1st Jun at 2:00 pm', {
        without: ['emails', 'links', 'mentions', 'times', 'youtube']
    });
// {"dates": ["1st Jun"], "hashtags": [], "phones": []}
```

#### duplicates
type: `Boolean`
default: `true`

Remove duplicate values from the results.

```javascript
var uniqueResults = Extractor('Try @one @two and @one', {
        duplicates: true
    }).mentions;
// ["one", "two"]
```

### Adding new pattern - `Extractor.addPattern()`

You can add new pattern as follows.

```javascript
// Adding "test" pattern which will match word "test"
// and as a result adds "1" to the end of the string.
Extractor.addPattern({
    name: 'test',
    regexp: /\btest\b/gim,
    postProcessor: function (value) {
        return value + '1';
    }
});
```

Pattern will be automatically across the whole library so next time you will use `Extractor(...)` you will get results for
your pattern. And also you can use just the method alone if you call `Extractor()` without arguments.

```javascript
Extractor().test('test and test');
// ["test1", "test1"]

Extractor('test and #other', {
    filter: ['test', 'hashtags', 'times']
});
// {"hashtags": ["other"], "times": [], "test": ["test1"]}
```

Here is a list of configuration options:

#### name
type: `String`
default: `null`

Name of new pattern. Can't use existing pattern name and will accept only lowercase and uppercase letters.

```
name: 'test',
```

#### regexp
type: `RegExp`
default: `null`

Regular expression that defines behaviour of your pattern - what you want to match.

```
regexp: /\btest\b/gim,
```

#### trim `[optional]`
type: `Boolean`
default: `true`

Should the white space around the result value be stripped out.

```
trim: false,
```

#### postProcessor `[optional]`
type: `Function`
default: `null`

You can specify post-processing method which will append the result value as desired.

```
// Example - just add '1' after a result.
postProcessor: function (value) {
        return value + '1';
    }
```
