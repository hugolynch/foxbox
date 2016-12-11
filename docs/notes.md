# Notes


## Development notes


### Upload photos

We want to make the entry of new data as easy as possible.
However, we need to protect from vandalism, in particular, with file uploads.
One possibility is to upload files and display them right away to the user that uploaded them,
but not to other users until it's validated by and admin user. 
For this we could leverage localStorage, which will keep a flag stored in the user's browser (of course, it they
delete teh storage or use a different browser, they will not see the image).

Currently users get promped to upload an image from their device via a form. Another way to upload images would be
to select a foxbox and take a photo with the phone, which would be automatically uploaded.

### Data structure

 - Should we use the same data structure for foxboxes and Toronto Public Libraries?
 - Shoud we use GeoJson?



## Newspaper articles

http://thevarsity.ca/2016/03/07/reviewing-the-contents-of-torontos-little-free-libraries/


 - 261 Brunswick Avenue x
 - 468 Grace Street X
 - 550 Clinton Street X
 - 663 Euclid Avenue. X
 - 848 Palmerston Avenue X
 - Howland Avenue and Bloor (not in db)




http://www.insidetoronto.com/news-story/6826808-liberty-village-church-unveils-two-little-free-libraries-for-the-community/


 - 25 Liberty St. X
 - Liberty Village Park on Lynn Williams Street. X


http://www.insidetoronto.com/news-story/4948097-brockton-village-gets-its-own-little-free-library-/

- Brock Avenue and Middleton Street in McCormick Park X
43.6463673,-79.4340142



## Street name abbreviations:

 * USPS abbreviations:
    http://pe.usps.gov/text/pub28/28apc_002.htm


 * Canada post:
    https://www.canadapost.ca/tools/pg/manual/PGaddress-e.asp?ecid=murl10006450#1441964


