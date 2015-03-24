var express    = require('express');
var DataSource = require('./DataSource');
var settings   = require('./settings')();
var Q          = require('q');
var _          = require('lodash');





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



    var dataSource = new DataSource({
        url : settings.dataSourceUrl
    });



    app.get('/api/sports', function(req, res){
        dataSource.getSports().then(function(sports){
            res.status(200).json(sports);
        })
    });



    app.get('/api/sports/:sportId', function(req, res){
        var sportId = parseInt(req.params.sportId);
        dataSource.getEvents({sportId: sportId}).then(function(events){
            res.status(200).json(events);
        })
    });



    var forceRefresh = function(){
        var promise = dataSource.refresh()
        options.onRefresh(promise)
        return promise;
    }



    setInterval(function(){
        console.log('Refresh DataSource');
        console.log(new Date());
        forceRefresh().then(function(){
            console.log('DataSource refreshed')
        });
    }, 5 * 60 * 1000)



    // The first time the app startup needs to refresh the dataSource.
    // In this way when you reach the server is in a proper state and you never
    // reach a server in a null state.
    forceRefresh().then(function(){
        deferred.resolve({
            app : app,
        })
    }).catch(function(err){
        deferred.reject(err);
    })
    return deferred.promise;
}
