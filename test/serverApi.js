require           = require('../getWebpackRequire');
var sinon         = require.originalRequire('sinon'); // Has some issues with enhanced require.
var _             = require('lodash');
var Q             = require('q');
var expect        = require("chai").expect;
var supertest     = require('supertest');
var request       = require('request');
var express       = require('express');
var async         = require('async');
var createAppFn   = require('server/boot');
var appSettings   = require('server/settings')();
var liveData_day0 = require('test/data/liveData_day0.json');
var liveData_day1 = require('test/data/liveData_day1.json');





describe('Server API', function(){



    var __sandbox;
    var app;
    var refreshInterval      = 5 * 60 * 1000;
    var footballSportId      = 100;
    var firstFootballEventId = 266701710;



    beforeEach(function(){
        __sandbox = sinon.sandbox.create();
        __sandbox.useFakeTimers(); // get with __sandbox.clock
    });



    afterEach(function(){
        __sandbox.restore();
        app = void 0;
    });



    // The following 1 function(s) should be refactored into their own files because are repeating the
    // same code from the DataSource test.
    var stubRequestWithCorrectData = function(){
        __sandbox.stub(request, 'get')
            .withArgs(appSettings.dataSourceUrl)
                .onCall(0)
                    .yieldsAsync(void 0, {statusCode: 200}, JSON.stringify(liveData_day0))
                .onCall(1)
                    .yieldsAsync(void 0, {statusCode: 200}, JSON.stringify(liveData_day1));
    }




    var createApp = function(options){
        var deferred = Q.defer();
        createAppFn(options).then(function(data){
            app = data.app;
            deferred.resolve();
        }).catch(function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    }



    describe('cache', function(){



        // Add should use cache
        // This is a very tricky test. In order to check whenever the
        // server serves cached data with max 5 minutes age we need to use the
        // fake timers.
        it('should use cache for 5 minutes', function(done){
            stubRequestWithCorrectData();
            createApp().then(function(){
                __sandbox.clock.tick(refreshInterval - 1);
                var deferred  = Q.defer();
                supertest(app)
                    .get('/api/sports')
                    .expect('Content-Type', /application\/json/)
                    .expect(function(res){
                        var sports = res.body;
                        // By comparing with liveData_day0 we know that it loaded only once.
                        expect(sports).to.deep.equals(_.sortBy(liveData_day0.sports, 'pos'));
                    })
                    .expect(200)
                    .end(function(err, res){
                        if(err) return deferred.reject(err);
                        deferred.resolve();
                    });
                return deferred.promise;
            }).then(function(){
                done();
            }).catch(done);
        })



        it('should refresh data after 5 minutes', function(done){
            stubRequestWithCorrectData();
            var refreshPromise;
            var onRefresh = function(promise){
                refreshPromise = promise;
            }
            createApp({onRefresh: onRefresh}).then(function(){
                // Deletes the previous promise. Normally this should be the first promise which
                // is not required here. We just care about the second one.
                refreshPromise = void 0;
                __sandbox.clock.tick(refreshInterval + 1);
                if(!refreshPromise) throw new Error('Refresh promise not yet present')
                // Only waits on the next promise.
                return refreshPromise;
            }).then(function(){
                var deferred  = Q.defer();
                supertest(app)
                    .get('/api/sports')
                    .expect('Content-Type', /application\/json/)
                    .expect(function(res){
                        var sports = res.body;
                        // By comparing with liveData_day1 we know that it loaded only twice.
                        expect(sports).to.deep.equals(_.sortBy(liveData_day1.sports, 'pos'));
                    })
                    .expect(200)
                    .end(function(err, res){
                        if(err) return deferred.reject(err);
                        deferred.resolve();
                    });
                return deferred.promise;
            }).then(function(){
                done();
            }).catch(done);
        })



        it('should return last data if an error happens after the first refresh', function(done){
            // This stub returns correct data the first time and then returns an internal error.
            __sandbox.stub(request, 'get')
                .withArgs(appSettings.dataSourceUrl)
                    .onCall(0)
                        .yieldsAsync(void 0, {statusCode: 200}, JSON.stringify(liveData_day0))
                    .onCall(1)
                        .yieldsAsync(new Error('Unexpected error'));

            var refreshPromise;
            var onRefresh = function(promise){
                refreshPromise = promise;
            }
            createApp({onRefresh: onRefresh}).then(function(){
                // Deletes the previous promise. Normally this should be the first promise which
                // is not required here. We just care about the second one.
                refreshPromise = void 0;
                __sandbox.clock.tick(refreshInterval + 1);
                if(!refreshPromise) throw new Error('Refresh promise not yet present')
                // Only waits on the next promise.
                return refreshPromise;
            }).then(function(){
                done(new Error('Should return an error'))
            }, function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal('Unexpected error');
                done();
            }).catch(done);
        })



    })



    it('should not start if first refresh has any error', function(done){
        // This stub returns correct data the first time and then returns an internal error.
        __sandbox.stub(request, 'get')
            .withArgs(appSettings.dataSourceUrl)
            .yieldsAsync(new Error('Unexpected error'));

        var refreshPromise;
        var onRefresh = function(promise){
            refreshPromise = promise;
        }
        createApp({onRefresh: onRefresh}).then(function(){
            done(new Error('Should return an error.'));
        }, function(err){
            expect(err).to.be.ok;
            expect(err.message).to.be.equal('Unexpected error');
            done();
        }).catch(done);
    })



    describe('/api/sports', function(){



        it('should return all sports', function(done){
            stubRequestWithCorrectData();
            createApp().then(function(){
                supertest(app)
                    .get('/api/sports')
                    .expect('Content-Type', /application\/json/)
                    .expect(function(res){
                        var sports = res.body;
                        expect(sports).to.deep.equals(_.sortBy(liveData_day0.sports, 'pos'));
                    })
                    .expect(200)
                    .end(function(err, res){
                        if(err) throw err;
                        done();
                    });
            }).catch(done);
        })



    })



    describe('/api/sports/:sportId', function(){



        it('should return sport\'s events', function(done){
            stubRequestWithCorrectData();
            createApp().then(function(){
                async.eachSeries(liveData_day0.sports, function(sport, cb){
                    supertest(app)
                        .get('/api/sports/' + sport.id)
                        .expect('Content-Type', /application\/json/)
                        .expect(200)
                        .expect(function(res){
                            var events = res.body;
                            expect(events).to.deep.equals(sport.events);
                        })
                        .end(function(err, res){
                            cb(err);
                        });
                }, function(err){
                    done(err);
                })
            }).catch(done)
        })



    })



    describe('/api/sports/:sportId/events/:eventId', function(){



        it('should return sport\'s events', function(done){
            stubRequestWithCorrectData();
            createApp().then(function(){
                async.eachSeries(liveData_day0.sports, function(sport, cb){
                    async.eachSeries(sport.events, function(expectedEvent, cb){
                        supertest(app)
                            .get('/api/sports/' + sport.id + '/events/' + expectedEvent.id)
                            .expect('Content-Type', /application\/json/)
                            .expect(200)
                            .expect(function(res){
                                var returnedEvent = res.body;
                                expect(returnedEvent).to.deep.equals(expectedEvent);
                            })
                            .end(function(err, res){
                                cb(err);
                            });
                    }, function(err){
                        cb(err);
                    })
                }, function(err){
                    done(err);
                })
            }).catch(done)
        })



    })



})
