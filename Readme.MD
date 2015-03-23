# BetVictor test

This is a test project for Bet Victor.



## Install

 - Clone project;
 - Open a console into the root of the project;
 - Run the command `npm install`;



## Run tests

To run tests you have to open a console and cd into the root of the project. Then chose the type of test to run:

 - With code coverage: `istanbul cover --hook-run-in-context node_modules/mocha/bin/_mocha -- -R spec`
 - Without code coverage: `mocha`;

If you ran the test with code coverage open this file to check the html report: `./coverage/lcov-report/index.html`



## API

The API can be found by opening the file `./docs/jsduck/index.html`.



## Objectives

Create a Node.js application that calls the following URL and navigates through it's content.

URL: http://www.betvictor.com/live/en/live/list.json

The Content hierarchy is: Sports > Events > Outcomes

Minimum requisites are:

 - Method to list all sports (/sports)
 - Method to list all events for a given sport (/sports/<id>)
 - Method to list all outcomes for a given event (/sports/<id>/events/<id>)
 - Full test coverage (Mocha is a good test framework)

Notes:

 - Obey the list order as per upstream API 'pos' property
 - Please use a local Git repository and commit as you go along

Extra points for: Language support, Caching;
