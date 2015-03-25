require           = require('../getWebpackRequire');
var sinon         = require.originalRequire('sinon'); // Has some issues with enhanced require.
var _             = require('lodash');
var Q             = require('q');
var expect        = require("chai").expect;
var supertest     = require('supertest');
var request       = require('request');
var express       = require('express');
var async         = require('async');
var cheerio       = require('cheerio');
var createAppFn   = require('server/boot');
var appSettings   = require('server/settings')();
var liveData_day0 = require('test/data/liveData_day0.json');
var liveData_day1 = require('test/data/liveData_day1.json');




describe('Server', function(){



    var __sandbox;
    var app;



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



    var stubRequestWithUnexpectedError = function(){
        __sandbox.stub(request, 'get')
            .withArgs(appSettings.dataSourceUrl)
            .yieldsAsync(new Error('Unexpected error'));
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



    describe('GET /:lang/sports', function(){



        it('should return an html page with all the sports', function(done){
            stubRequestWithCorrectData();
            createApp().then(function(){
                supertest(app)
                    .get('/en/sports')
                    .expect('Content-Type', /html/)
                    .expect(200)
                    .expect(function(res){
                        $ = cheerio.load(res.text);
                        var expectedSports = _.sortBy(liveData_day0.sports, 'pos');
                        $('.root > .sports > .sport').each(function(i, sportEl){
                            expect($(sportEl).text()).to.be.equal(expectedSports[i].title);
                            expect($(sportEl).attr('href')).to.be.equal('/en/sports/' + expectedSports[i].id);
                        })
                        expect($('.root > .sports > .sport')).to.have.length(expectedSports.length);
                    })
                    .end(function(err, res){
                        done(err);
                    });
            })
        })



        describe('should return the page in the correct language', function(){



            it('english', function(done){
                stubRequestWithCorrectData();
                createApp().then(function(){
                    supertest(app)
                        .get('/en/sports')
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .expect(function(res){
                            $ = cheerio.load(res.text);
                            expect($('.title').text()).to.be.equal('Sports');
                        })
                        .end(function(err, res){
                            done(err);
                        });
                })
            })



            it('portuguese', function(done){
                stubRequestWithCorrectData();
                createApp().then(function(){
                    supertest(app)
                        .get('/pt/sports')
                        .expect('Content-Type', /html/)
                        .expect(200)
                        .expect(function(res){
                            $ = cheerio.load(res.text);
                            expect($('.title').text()).to.be.equal('Desportos');
                        })
                        .end(function(err, res){
                            done(err);
                        });
                })
            })



        })



    })



})
