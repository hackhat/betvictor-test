# BetVictor test

This is a test project for Bet Victor.

Final result:

<p align="center">
  <img src ="./docs/img/animation2.gif" />
</p>



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



## Results

All the requisites has been completed and backed with automatic tests.


### Architecture

The application is divided in 3 main parts:

 - Data source;
 - API;
 - Server side rendering;

Uses promises to handle asynchronous flows.


### Data source and caching

The data source's responsibility is to load data from the endpoint `http://www.betvictor.com/live/en/live/list.json` and then return when requested.
In order to increase performance all data is cached for 5 minutes.
View it's [api](https://rawgit.com/hackhat/betvictor-test/v0.0.2/docs/jsduck/index.html#!/api/server.DataSource) or [source code](./src/server/DataSource.js).


### API

The server returns data as json on these endpoints:

 - `localhost/api/sports`: all sports as json;
 - `localhost/api/sports/<sportId>/events`: all events of the `<sportId>` specified;
 - `localhost/api/sports/<sportId>/events/<eventId>`: all outcomes of the `<sportId>` and `<eventId>` specified;

All the API endpoints are covered by tests.


### Server side rendering

The server outputs html rendered with react js on several endpoints:

 - `localhost/<lang>/sports`: all sports in `<lang>` specified;
 - `localhost/<lang>/sports/<sportId>`: all events in `<lang>` and `<sportId>` specified;
 - `localhost/<lang>/sports/<sportId>/events/<eventId>`: all outcomes in `<lang>`, `<sportId>` and `<eventId>` specified;

All the html endpoints are covered by tests.


### Multilanguage

Currently the server only has only 2 languages: [portuguese](./src/client/i18n/pt_PT.js) and [english](./src/client/i18n/en_US.js).

To note that only the application part is translated (like titles and some other items). No data has been translated.


### Build process

The build process is based on [gulp](http://gulpjs.com/) and
[webpack](http://webpack.github.io/). Currently the server doesn't rebuild the
CSS part, therefore this could be improved.


### Tools

 - Issue tracker: [Asana](https://asana.com).
 - Coded with [Sublime Text 2](http://www.sublimetext.com/2).



## Conclusions

A lot more things could be done like translate every data from the source, make it isomorphic and
automate some tasks. I've tried to use a new way to render the CSS (with my [smart-css](https://github.com/hackhat/smart-css) tool)
but it would took even more time to implement.

This application is entirely based on the server, no client side JavaScript code is run.
Adding stores and proper UI, the site can be even faster and more appealing.

The routing system could be better: a) routes on the client side should be generated
and not manually written; b) server side could use route contexts; c) routes could be isomorphic;

Errors that happen on the server should be logged with something like
[node-bunyan](https://github.com/trentm/node-bunyan) instead of being returned to the client.

## Install

 - Clone project;
 - Open a console and cd into the root of the project;
 - Run the command `npm install`;



## Start server

To start the server in development mode you just run: `gulp server`;

On every change in the `src` folder, the server will restart.
Note that you need to rebuild the css in order to take effect by running this script `gulp build`.
The development tools can be improved to auto refresh the css files.

Now go to (localhost/en/sports)[http://localhost/en/sports] to view the app working;



## Run tests

If you need to run with code coverage first install istanbul globally with the command: `npm install istanbul -g`.

To run tests you have to open a console and cd into the root of the project. Then chose the type of test to run:

 - With code coverage: `istanbul cover --root ./src --hook-run-in-context node_modules/mocha/bin/_mocha -- -R spec`
 - Without code coverage: `mocha`;

If you ran the test with code coverage open this file to check the html report: `./coverage/lcov-report/index.html`



## API

The API of the project is located **[here](https://rawgit.com/hackhat/betvictor-test/v0.0.2/docs/jsduck/index.html)**.
Has been automatically generated with [jsduck](https://github.com/senchalabs/jsduck).



## Test coverage

<a align="center" href="https://rawgit.com/hackhat/betvictor-test/v0.0.2/coverage/lcov-report/index.html">
  <img src ="./docs/img/test-coverage-report.jpg" />
</a>

The current application is 100% covered. Even being 100% covered doesn't mean all edge cases have been covered, I'm aware that
some rare edge cases have not been handled. Handling them would take a lot of time and I think is out of the context of this project.

View test coverage report [here](https://rawgit.com/hackhat/betvictor-test/v0.0.2/coverage/lcov-report/index.html).

Code coverage done with [istanbul](https://github.com/gotwarlost/istanbul).



## Test

<p align="center">
  <img src ="./docs/img/test-report.jpg" />
</p>

All the tests has been written with [mocha](https://github.com/mochajs/mocha), [supertest](https://github.com/visionmedia/supertest),
[cheerio](https://github.com/cheeriojs/cheerio) and [sinom](http://sinonjs.org/) and takes 2 seconds to run them.

Fixtures are stored into the [/test/data](/test/data).There are 2 files which contains 2 different days' data.
Are required to test whenever it loads fresh data every 5 minutes.

Used:

 - Fake timers: for testing the cache of the DataSource;
 - Async stubs;
 - Fixtures;
 - Cheerio: for testing the html output of the app;



## Code style

### Requires

My require style is like this:

    var a = require('a');
    var b = require('b');

instead of:

    var a = require('a'),
        b = require('b');

because is easier to manipulate them. You can copy-paste and sort lines without further changes.
In the first example I can easily switch the lines with "ctrl+shift+UP" and go with it.
In the second example you have to change the "var" keyword, comma and spacing.
