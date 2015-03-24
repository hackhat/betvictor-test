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



        it('should not make unnecessary API calls', function(done){
            stubRequestWithCorrectData();
            dataSource.getData({forceRefresh: true}).then(function(data){
                expect(data).to.be.ok;
                expect(request.get.callCount).to.be.equal(1);
                return dataSource.getData();
            }).then(function(data){
                expect(data).to.be.ok;
                expect(request.get.callCount).to.be.equal(1);
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should return an error if an unexpected error happens', function(done){
            stubRequestWithUnexpectedError();
            dataSource.getData({forceRefresh: true}).then(function(data){
                done(new Error('Should return an error.'));
            }, function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal('Unexpected error');
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should return "Status code not 200" error if response status code is not 200', function(done){
            __sandbox.stub(request, 'get')
                .withArgs(appSettings.dataSourceUrl)
                .yieldsAsync(void 0, {statusCode: 404}, void 0);
            dataSource.getData({forceRefresh: true}).then(function(data){
                done(new Error('Should return an error.'));
            }, function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal('Status code not 200');
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should return "Invalid JSON" error if response status code is not 200', function(done){
            var invalidJSONBody = 'sa';
            __sandbox.stub(request, 'get')
                .withArgs(appSettings.dataSourceUrl)
                .yieldsAsync(void 0, {statusCode: 200}, invalidJSONBody);
            dataSource.getData({forceRefresh: true}).then(function(data){
                done(new Error('Should return an error.'));
            }, function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal('Invalid JSON');
                done();
            }).catch(function(err){
                done(err);
            });
        })



    })



    describe('.refresh()', function(){



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



    describe('.getDataVersion()', function(){



        it('should be initially empty', function(done){
            stubRequestWithCorrectData();
            expect(dataSource.getDataVersion()).to.be.undefined;
            done();
        })



        it('should only change when new data is fetched', function(done){
            stubRequestWithCorrectData();
            dataSource.refresh()
            .then(function(){
                return dataSource.getData();
            })
            .then(function(data){
                expect(dataSource.getDataVersion()).to.be.equal('74865492370001_acbe0dd98_en_2_1');
                return dataSource.refresh();
            })
            .then(function(){
                return dataSource.getData();
            })
            .then(function(data){
                expect(dataSource.getDataVersion()).to.be.equal('74891317750000_690450538_en_2_1');
                done();
            }).catch(function(err){
                done(err);
            });
        })



    })



    describe('.getSports()', function(){



        it('should return sports ordered by \'pos\' property', function(done){
            stubRequestWithCorrectData();
            dataSource.getSports({forceRefresh: true}).then(function(sports){
                expect(sports).to.be.instanceof(Array);
                expect(sports).to.have.length.above(0);
                var sortedSports = _.sortBy(sports, 'pos');
                sports.forEach(function(sport, i){
                    var expectedSport = sortedSports[i];
                    expect(sport.id).to.be.equal(expectedSport.id);
                })
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should return an error if an unexpected error happens', function(done){
            stubRequestWithUnexpectedError();
            dataSource.getSports({forceRefresh: true}).then(function(sports){
                done(new Error('Should return an error.'));
            }, function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal('Unexpected error');
                done();
            }).catch(function(err){
                done(err);
            });
        })



    })



    describe('.getEvents()', function(){



        // @todo: Confirm assumption.
        // Here I assume that events should be also ordered by the 'pos' property, like sports.
        it('should return sports\' events ordered by \'pos\' property', function(done){
            stubRequestWithCorrectData();
            var footballSportId = 100
            dataSource.getEvents({sportId: footballSportId, forceRefresh: true}).then(function(events){
                expect(events).to.be.instanceof(Array);
                expect(events).to.have.length(11);
                var sortedEvents = _.sortBy(events, 'pos');
                events.forEach(function(event, i){
                    var expectedEvent = sortedEvents[i];
                    expect(event.id).to.be.equal(expectedEvent.id);
                })
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should return false if sport with id specified is not found', function(done){
            stubRequestWithCorrectData();
            dataSource.getEvents({sportId: 'wrongId', forceRefresh: true}).then(function(events){
                expect(events).to.be.false;
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should return a \'Sport id should be specified\' error if no sport id specified', function(done){
            stubRequestWithCorrectData();
            dataSource.getEvents({sportId: void 0, forceRefresh: true}).then(function(events){
                done(new Error('Should return an error.'));
            }, function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal('Sport id should be specified');
                done();
            }).catch(function(err){
                done(err);
            });
        })



        it('should return an error if an unexpected error happens', function(done){
            stubRequestWithUnexpectedError();
            var footballSportId = 100
            dataSource.getEvents({sportId: footballSportId, forceRefresh: true}).then(function(events){
                done(new Error('Should return an error.'));
            }, function(err){
                expect(err).to.be.ok;
                expect(err.message).to.be.equal('Unexpected error');
                done();
            }).catch(function(err){
                done(err);
            });
        })



    })



})
