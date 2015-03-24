var express    = require('express');
var DataSource = require('./DataSource');
var settings   = require('./settings')();





module.exports = function(options, cb){
    var app = express();



    var dataSource = new DataSource({
        url: settings.dataSourceUrl
    });



    app.get('/api/sports', function(req, res){
        dataSource.getSports().then(function(sports){
            res.status(200).json(sports);
        })
    });



    app.get('/api/sports/:sportId', function(req, res){
        var sportId = parseInt(req.params.sportId);
        dataSource.getEvents({sportId: sportId}).then(function(events){
            res.status(200).json(events);
        })
    });




    dataSource.refresh().then(function(){
        cb(void 0, {
            app: app
        })
    }).catch(function(err){
        cb(err);
    })
}
