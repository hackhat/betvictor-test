var _       = require('lodash');
var Q       = require('q');
var request = require('request');





var DataSource = function(){
    /**
     * Saves cached data.
     * @type {Array}
     * @private
     */
    this.__data = [];
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
    }


})





module.exports = DataSource;
