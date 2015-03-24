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
    var footballSportId      = 100;
    var firstFootballEventId = 266701710;



    beforeEach(function(){
        __sandbox = sinon.sandbox.create();
    });



    afterEach(function(){
        __sandbox.restore();
        app = void 0;
    });



    var stubRequestWithCorrectData = function(){
        __sandbox.stub(request, 'get')
            .withArgs(appSettings.dataSourceUrl)
                .onCall(0)
                    .yieldsAsync(void 0, {statusCode: 200}, JSON.stringify(liveData_day0))
                .onCall(1)
                    .yieldsAsync(void 0, {statusCode: 200}, JSON.stringify(liveData_day1));
    }




    var createApp = function(){
        var deferred = Q.defer();
        createAppFn({}).then(function(data){
            app = data.app;
            deferred.resolve();
        }).catch(function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    }



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



})
