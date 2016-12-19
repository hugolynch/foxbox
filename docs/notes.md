# Notes


## Development notes


### Upload photos

We want to make the entry of new data as easy as possible.
However, we need to protect from vandalism, in particular, with file uploads.
One possibility is to upload files and display them right away to the user that uploaded them,
but not to other users until it's validated by an admin user. 
For this we could leverage localStorage, which will keep a flag stored in the user's browser (of course, if they
delete the storage or use a different browser, they will not see the image).

Currently users get prompted to upload an image from their device via a form. Another way to upload images would be
to select a foxbox and take a photo with the phone, which would be automatically uploaded (mobile browsers seem to do
this already, to an extent).


### Adding new library

The workflow is currently as follows:

 1. User searches for address (at the moment the system does not check to see if it already is in database)

 2. System shows location in map.

 3. If user click on map, popup window comes up (might make it come up by default).

 4. Popup prompts user to add library to database.

 5. System makes ajax call and add address to database.

 6. System adds location to map, and popup prompts user to add image.

 7. If user uploads image, new ajax call is made to save the image.

 8. Image is displayed in popup.


### Data structure

 - Should we use the same data structure for foxboxes and Toronto Public Libraries?
 - Shoud we use GeoJson?

Currently we have:




    {
        "address": "56 Walpole Ave.",
        "coordinates": [
            43.67464,
            -79.32735
        ],
        "verified": true,
        "image": "56walpoleave.jpg"
    },


Potential additions:



For images:


    image: {
        author: ['street-view'| 'web-upload' | 'admin-upload']

        comments [
                {
                comment:
                date:
            }
        ]
        src: (image name)
        uploaded_at:
        uploaded_ip:
        verified: true | false
        score: 12[] 
    }

(do we want to keep array of images?)



For libraries:


    {
        created_at
        created_ip

        updated_at
        updated_ip
    }

        lfl_ref: #xxxx

        status: "verified" |  "google_maps" | "lfl"
        

## Newspaper articles

http://thevarsity.ca/2016/03/07/reviewing-the-contents-of-torontos-little-free-libraries/


 - 261 Brunswick Avenue X
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


How we parse: Avon Avenue

Av[. $]

Ave. = [ 'Avenue', 'Av' ] 


Avenue Ave.
Boulevard Blvd.
Circle Cir.
Court Crt.
Crescent Cres.
Drive Dr.
Esplanade Espl.
Expressway Expy.
Highway Hwy.
Manor Manor
Meadow Meadow
Park Pk.
Parkway Pky.
Place Pl.
Road Rd.
Street St.
Square Sq.
