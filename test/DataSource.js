require         = require('../getWebpackRequire')
var expect      = require("chai").expect;
var appSettings = require('server/settings')();





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



    it('should return a shallow copy of the data', function(done){
        var DataSource = require('server/DataSource');
        var dataSource = new DataSource();
        dataSource.getData().then(function(data){
            expect(data).to.be.instanceof(Array);
            data[0] = 'changed';
            return dataSource.getData();
        }).then(function(data){
            expect(data[0]).to.not.equal('changed');
            done();
        }).catch(function(err){
            done(err);
        });
    })



    it('should return some sports if using force refresh', function(done){
        var DataSource = require('server/DataSource');
        var dataSource = new DataSource({
            url: appSettings.dataSourceUrl
        });
        dataSource.getData({forceRefresh: true}).then(function(data){
            expect(data).to.be.instanceof(Array);
            expect(data).to.have.length.above(0);;
            done();
        }).catch(function(err){
            done(err);
        });
    })



})
