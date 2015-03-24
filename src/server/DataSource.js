var _       = require('lodash');
var Q       = require('q');
var request = require('request');




/**
 * Data source contains the data about sports and its events.
 *
 * Rationale:
 *     All the methods that return actual data uses promises. The reason behind this
 *     decision is to make this library easy to be replaced with a more powerful solution.
 *     For example in the future might be required to create a DataSource that makes a
 *     database query, therefore the data can't be returned right away, nor loaded all
 *     with the `refresh` method. In this case each method will make a database query.
 *
 * @param {Object} options
 * @param {String} options.url The url to the json api.
 */
var DataSource = function(options){
    options = _.extend({
        url: void 0
    }, options);

    /**
     * Stores cached data.
     * @type {Array}
     * @private
     */
    this.__data = [];

    /**
     * Stores the current version of the data.
     * @type {String}
     */
    this.__dataVersion = void 0;

    /**
     * Url which will be used to get data.
     * @type {String}
     * @private
     */
    this.__url = options.url;
}





_.extend(DataSource.prototype, {



    /**
     * Returns the current data version.
     * @return {String} [description]
     */
    getDataVersion: function(){
        return this.__dataVersion;
    },



    /**
     * Returns all the data.
     * @param  {Object} options
     * @param  {Boolean} [options.forceRefresh=false] If set to true it will make a refresh before returning
     *                                                the data.
     * @return {Q} Returns a Q promise that resolves to an array with several sports' data.
     */
    getData: function(options){
        options = _.extend({
            forceRefresh: false
        }, options)
        var deferred = Q.defer();
        if(options.forceRefresh){
            this.refresh().then(function(){
                deferred.resolve(this.__data.slice(0));
            }.bind(this)).catch(function(err){
                deferred.reject(err);
            })
        }else{
            deferred.resolve(this.__data.slice(0));
        }
        return deferred.promise;
    },



    /**
     * Returns a list of sports ordered by the pos property.
     * @param  {Object} options
     * @param  {Boolean} [options.forceRefresh=false] If set to true it will make a refresh before returning
     *                                                the data.
     * @return {Q} Returns a Q promise that resolves to an array with several sports' data.
     */
    getSports: function(options){
        options = _.extend({
            forceRefresh: false
        }, options)
        var deferred = Q.defer();
        this.getData({
            forceRefresh: options.forceRefresh
        }).then(function(data){
            deferred.resolve(_.sortBy(data, 'pos'));
        }).catch(function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    },



    /**
     * Returns a list of events of the specified sport id, ordered by the pos property.
     * If no sport is found will return false.
     * @param  {Object} options
     * @param  {Number} options.sportId Will return the events of the sport id specified here.
     * @param  {Boolean} [options.forceRefresh=false] If set to true it will make a refresh before returning
     *                                                the data.
     * @return {Q} Returns a Q promise that resolves to an array with several events' data.
     */
    getEvents: function(options){
        options = _.extend({
            sportId      : void 0,
            forceRefresh : false
        }, options)
        var deferred = Q.defer();
        if(options.sportId === void 0){
            deferred.reject(new Error('Sport id should be specified'));
            return deferred.promise;
        }
        this.getSports({
            forceRefresh: options.forceRefresh
        }).then(function(sports){
            var sport = _.findWhere(sports, {id: options.sportId});
            var events = sport ? sport.events : false;
            deferred.resolve(events);
        }).catch(function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    },



    /**
     * Refreshes the data of this DataSource.
     * @return {Q} Returns a Q promise.
     */
    refresh: function(){
        var deferred = Q.defer();
        Q.nfcall(request.get, this.__url).spread(function(res, body){
            if(res.statusCode !== 200){
                return deferred.reject(new Error('Status code not 200'));
            }
            try{
                var data = JSON.parse(body);
            }catch(err){
                return deferred.reject(new Error('Invalid JSON'));
            }
            this.__data        = data.sports;
            this.__dataVersion = data.version;
            deferred.resolve();
        }.bind(this)).catch(function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    }



})





module.exports = DataSource;
