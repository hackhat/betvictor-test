require           = require('../getWebpackRequire');
var sinon         = require.originalRequire('sinon'); // Has some issues with enhanced require.
var expect        = require("chai").expect;
var request       = require('request');
var _             = require('lodash');
var appSettings   = require('server/settings')();
var liveData_day0 = require('test/data/liveData_day0.json');
var liveData_day1 = require('test/data/liveData_day1.json');





describe('Data source', function(){



    var __sandbox;
    var dataSource;



    beforeEach(function () {
        __sandbox = sinon.sandbox.create();
        var DataSource = require('server/DataSource');
        dataSource = new DataSource({
            url: appSettings.dataSourceUrl
        });
    });



    afterEach(function () {
        __sandbox.restore();
    });



    var stubRequestWithCorrectData = function(){
        var stub = __sandbox.stub(request, 'get');
        stub.withArgs(appSettings.dataSourceUrl)
            .onCall(0)
                .yieldsAsync(void 0, {statusCode: 200}, JSON.stringify(liveData_day0))
            .onCall(1)
                .yieldsAsync(void 0, {statusCode: 200}, JSON.stringify(liveData_day1))
    }



    describe('.getData()', function(){



        it('should be initially empty', function(done){
            stubRequestWithCorrectData();
            dataSource.getData().then(function(data){
                expect(data).to.be.instanceof(Array);
                expect(data).to.be.empty;
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should return a shallow copy of the data', function(done){
            stubRequestWithCorrectData();
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
            stubRequestWithCorrectData();
            dataSource.getData({forceRefresh: true}).then(function(data){
                expect(data).to.be.instanceof(Array);
                expect(data).to.have.length.above(0);
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should throw an unexpected error happens', function(done){
            var errorName = 'Stub error';
            __sandbox.stub(request, 'get')
                .withArgs(appSettings.dataSourceUrl)
                .yieldsAsync(new Error('Stub error'));
            dataSource.getData({forceRefresh: true}).then(function(data){
                done(new Error('Should throw an error.'));
            }, function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal(errorName);
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should throw "Status code not 200" error if response status code is not 200', function(done){
            __sandbox.stub(request, 'get')
                .withArgs(appSettings.dataSourceUrl)
                .yieldsAsync(void 0, {statusCode: 404}, void 0);
            dataSource.getData({forceRefresh: true}).then(function(data){
                done(new Error('Should throw an error.'));
            }, function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal('Status code not 200');
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should throw "Invalid JSON" error if response status code is not 200', function(done){
            var invalidJSONBody = 'sa';
            __sandbox.stub(request, 'get')
                .withArgs(appSettings.dataSourceUrl)
                .yieldsAsync(void 0, {statusCode: 200}, invalidJSONBody);
            dataSource.getData({forceRefresh: true}).then(function(data){
                done(new Error('Should throw an error.'));
            }, function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal('Invalid JSON');
                done();
            }).catch(function(err){
                done(err);
            });
        })



    })



    describe.only('.refresh()', function(){



        it('should load fresh data', function(done){
            stubRequestWithCorrectData();
            dataSource.refresh()
            .then(function(){
                return dataSource.getData();
            })
            .then(function(data){
                expect(data).to.be.instanceof(Array);
                expect(data).to.have.length.above(0);
                expect(data[0].events[0].id).to.be.equal(266701710);
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should overwrite previous data loaded', function(done){
            stubRequestWithCorrectData();
            dataSource.refresh()
            .then(function(){
                return dataSource.getData();
            })
            .then(function(data){
                expect(data[0].events[0].id).to.be.equal(266701710);
                return dataSource.refresh();
            })
            .then(function(){
                return dataSource.getData();
            })
            .then(function(data){
                expect(data[0].events[0].id).to.be.equal(27603710);
                done();
            }).catch(function(err){
                done(err);
            });
        })



    })



})
