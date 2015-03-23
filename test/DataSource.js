require         = require('../getWebpackRequire');
var expect      = require("chai").expect;
var request     = require('request');
var sinon       = require.originalRequire('sinon'); // Has some issues with enhanced require.
var appSettings = require('server/settings')();
var liveData    = require('test/data/live.json');





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
        this.timeout(10000);
        var DataSource = require('server/DataSource');
        var dataSource = new DataSource({
            url: appSettings.dataSourceUrl
        });
        dataSource.getData({forceRefresh: true}).then(function(data){
            expect(data).to.be.instanceof(Array);
            expect(data).to.have.length.above(0);
            done();
        }).catch(function(err){
            done(err);
        });
    })



    it('should throw an error if data not available', function(done){
        this.timeout(10000);
        var stub = sinon.stub(request, 'get').yieldsAsync(new Error('Stub error.'));
        var DataSource = require('server/DataSource');
        var dataSource = new DataSource({
            url: appSettings.dataSourceUrl
        });
        dataSource.getData({forceRefresh: true}).then(function(data){
            done(new Error('Should throw an error.'));
        }).catch(function(err){
            expect(err).to.be.ok;
            done();
        });
    })



})
