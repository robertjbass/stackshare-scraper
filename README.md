# stackshare-scraper

## The current setup pulls from the local filesystem and adds it to Airtable
```stackShare.js``` contains the scraping script

#### The code was setup to pull descriptions from StackShare but they banned my IP for scraping

```
403: Forbidden
```

## This code is not for use, use for reference only
If you decide to re-use this code for anything, you'll need to modify the Airtable ENV VARs

## Warning
This code is poorly designed and works well enough to grab some quick technology descriptions, but it has no real reusable purpose and will likely blacklist your IP address if you loop the API calls to StackShare