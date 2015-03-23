var _ = require('lodash');
var Q = require('q');





var DataSource = function(){
    this.__data = [];
}





_.extend(DataSource.prototype, {



    getData: function(){
        var deferred = Q.defer();
        deferred.resolve(this.__data);
        return deferred.promise;
    }


})





module.exports = DataSource;
