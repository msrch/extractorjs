# Extractor.js

> Extract common information from a string.



## About

**Extractor.js** is a small library that helps to extract common information like dates, times, emails or links from
text. It also provide easy way how to extend/add new patterns to extract new things.

### Example

Here is an example paragraph of text:

```
@friend I have sent you an email to your address name@web.com
'on 3rd of June 2013 at 14:36pm about your web www.some-website.com.
'Watch this youtu.be/5Jp9_sgJcN0 and then call me (123) 456 7890.
'#video #website
```

Following information will be extracted:

```json
{
  "dates": ["3rd of June 2013"],
  "emails": ["name@web.com"],
  "hashtags": ["video", "website"],
  "links": ["www.some-website.com", "youtu.be/5Jp9_sgJcN0"],
  "mentions": ["friend"],
  "phones": ["(123) 456 7890"],
  "times": ["14:36pm"],
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
