require         = require('../getWebpackRequire');
var sinon       = require.originalRequire('sinon'); // Has some issues with enhanced require.
var expect      = require("chai").expect;
var request     = require('request');
var _           = require('lodash');
var appSettings = require('server/settings')();
var liveData    = require('test/data/live.json');





describe('Data source', function(){



    var __sandbox;



    beforeEach(function () {
        __sandbox = sinon.sandbox.create();
    });



    afterEach(function () {
        __sandbox.restore();
    });



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
        __sandbox.stub(request, 'get')
            .withArgs(appSettings.dataSourceUrl)
            .yieldsAsync(void 0, {statusCode: 200}, JSON.stringify(liveData));
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
        var errorName = 'Stub error';
        __sandbox.stub(request, 'get')
            .withArgs(appSettings.dataSourceUrl)
            .yieldsAsync(new Error('Stub error'));
        var DataSource = require('server/DataSource');
        var dataSource = new DataSource({
            url: appSettings.dataSourceUrl
        });
        dataSource.getData({forceRefresh: true}).then(function(data){
            done(new Error('Should throw an error.'));
        }).catch(function(err){
            expect(err).to.be.ok;
            expect(err.message).to.be.equal(errorName);
            done();
        });
    })



    it('should throw "Status code not 200" error if response status code is not 200', function(done){
        __sandbox.stub(request, 'get')
            .withArgs(appSettings.dataSourceUrl)
            .yieldsAsync(void 0, {statusCode: 404}, void 0);
        var DataSource = require('server/DataSource');
        var dataSource = new DataSource({
            url: appSettings.dataSourceUrl
        });
        dataSource.getData({forceRefresh: true}).then(function(data){
            done(new Error('Should throw an error.'));
        }).catch(function(err){
            expect(err).to.be.ok;
            expect(err.message).to.be.equal('Status code not 200');
            done();
        });
    })



    it('should throw "Invalid JSON" error if response status code is not 200', function(done){
        var invalidJSONBody = 'sa';
        __sandbox.stub(request, 'get')
            .withArgs(appSettings.dataSourceUrl)
            .yieldsAsync(void 0, {statusCode: 200}, invalidJSONBody);
        var DataSource = require('server/DataSource');
        var dataSource = new DataSource({
            url: appSettings.dataSourceUrl
        });
        dataSource.getData({forceRefresh: true}).then(function(data){
            done(new Error('Should throw an error.'));
        }).catch(function(err){
            expect(err).to.be.ok;
            expect(err.message).to.be.equal('Invalid JSON');
            done();
        });
    })



})
