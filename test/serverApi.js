require           = require('../getWebpackRequire');
var sinon         = require.originalRequire('sinon'); // Has some issues with enhanced require.
var expect        = require("chai").expect;
var supertest     = require('supertest');
var request       = require('request');
var express       = require('express');
var createApp     = require('server/boot');
var appSettings   = require('server/settings')();
var liveData_day0 = require('test/data/liveData_day0.json');
var liveData_day1 = require('test/data/liveData_day1.json');





describe.only('Server API', function(){



    var __sandbox;
    var app;



    beforeEach(function () {
        __sandbox = sinon.sandbox.create();
        app = createApp();
    });



    afterEach(function () {
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



    describe('/api/sports', function(){



        it('should return all sports', function(done){
            stubRequestWithCorrectData();
            supertest(app)
                .get('/api/sports')
                .expect('Content-Type', /application\/json/)
                .expect(200)
                .end(function(err, res){
                    if(err) throw err;
                    var sports = res.body;
                    expect(sports).to.be.instanceof(Array);
                    expect(sports).to.have.length(16);
                    done();
                });
        })



    })



})
