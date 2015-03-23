var _       = require('lodash');
var Q       = require('q');
var request = require('request');




/**
 * Data source contains the data about sports and its events.
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
     * Url which will be used to get data.
     * @type {String}
     * @private
     */
    this.__url = options.url;
}





_.extend(DataSource.prototype, {



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
            }.bind(this), function(err){
                deferred.reject(err);
            })
        }else{
            deferred.resolve(this.__data.slice(0));
        }
        return deferred.promise;
    },



    /**
     * Refreshes the data of this DataSource.
     * @return {Q} Returns a Q promise.
     */
    refresh: function(){
        var deferred = Q.defer();
        Q.nfcall(request.get, this.__url).spread(function(res, body){
            var data = JSON.parse(body);
            this.__data = data.sports;
            deferred.resolve();
        }.bind(this)).catch(function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    }



})





module.exports = DataSource;
