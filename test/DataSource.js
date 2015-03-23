require    = require('../getWebpackRequire')
var expect = require("chai").expect;





describe('Data source', function(){



    it('should be empty by default', function(done){
        var DataSource = require('server/DataSource');
        var dataSource = new DataSource();
        dataSource.getData().then(function(data){
            expect(data).to.be.instanceof(Array);
            expect(data).to.be.empty;
            done();
        }).catch(function(err){
            done(err);
        });
    })



})
