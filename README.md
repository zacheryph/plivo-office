# Plivo Office

This is a really simple app to handle a home/small-office setup in Plivo.
This works with plivo.com for handling phone numbers/extensions.

This was mostly a way for me to get more use to Node itself, and Node 0.11 in
particular using Koa and Generators. Nothing against nodejs but this will
probably not be worked on much more as I plan to rewrite it in Go with a lot
more features.  Though I figured I would put this here in case anyone else
finds it very interesting.

If anyone does make changes I am willing to accept pull requests


## TODO

* remove numbers.json and use some sort of database
* a front end

## Requirements

* NodeJS 0.11
  * as this depends on generators and Koa

Thats about it.

## Required Environment Variables

* `PLIVO_AUTH_ID` - your plivo auth id
* `PLIVO_AUTH_TOKEN` - your plivo auth token
* `HEROKU_URL` - root url for heroku app to keep app running
