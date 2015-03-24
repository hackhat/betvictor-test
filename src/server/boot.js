var express    = require('express');
var DataSource = require('./DataSource');
var settings   = require('./settings')();
var Q          = require('q');
var fs         = require('fs');
var _          = require('lodash');
var Root       = require('client/ui/Root')({});





/**
 * @class server.boot
 * Returns an object with data about the server.
 * Note: this will not make the server to listen on any port.
 * @param  {Object}   options
 * @return {Q} Returns a promise with data about the server and has the following format:
 *                  data.app          : is the express server instance (not yet listening to any port)
 *                  data.forceRefresh : a function that can be called to refresh DataSource's data.
 *                                      Returns a promise.
 */
var noop = function(){};
module.exports = function(options, cb){
    options = _.extend({
        onRefresh : noop
    }, options)
    var deferred = Q.defer();
    var app      = express();



    // No need to use any express specific templates because we just have 1 root template
    // and the rest is generated with react. Is its job to take care of html, not express.
    var indexHtml = fs.readFileSync('./dist/index.html', 'utf8');
    var render = function(body){
        var left  = '<div id="root">';
        var right = '</div>';
        return indexHtml.replace([left, right].join(''), [left, body, right].join(''));
    }



    var dataSource = new DataSource({
        url : settings.dataSourceUrl
    });



    app.get('/', function(req, res){
        var data = 'server';
        var React = require('react');
        var contents = React.renderToString(React.createElement(Root, {data: data}));
        res.status(200).send(render(contents));
    });



    app.get('/api/sports', function(req, res){
        dataSource.getSports().then(function(sports){
            res.status(200).json(sports);
        })
    });



    app.get('/api/sports/:sportId', function(req, res){
        var sportId = parseInt(req.params.sportId);
        // @todo: should also return sport
        dataSource.getEvents({sportId: sportId}).then(function(events){
            res.status(200).json(events);
        })
    });



    app.get('/api/sports/:sportId/events/:eventId', function(req, res){
        var sportId = parseInt(req.params.sportId);
        var eventId = parseInt(req.params.eventId);
        // @todo: should also return event
        dataSource.getOutcomes({sportId: sportId, eventId: eventId}).then(function(outcomes){
            res.status(200).json(outcomes);
        })
    });



    // Required for static assets such as js and css.
    app.use(express.static('dist'));



    var forceRefresh = function(){
        var promise = dataSource.refresh();
        options.onRefresh(promise);
        return promise;
    }



    setInterval(function(){
        forceRefresh().then(function(){});
    }, 5 * 60 * 1000)



    // The first time the app startup needs to refresh the dataSource.
    // In this way when you reach the server is in a proper state and you never
    // reach a server in a null state.
    forceRefresh().then(function(){
        deferred.resolve({
            app : app
        })
    }).catch(function(err){
        deferred.reject(err);
    })
    return deferred.promise;
}
