var express    = require('express');
var DataSource = require('./DataSource');
var settings   = require('./settings')();





module.exports = function(options){
    var app = express();



    var dataSource = new DataSource({
        url: settings.dataSourceUrl
    });



    app.get('/api/sports', function(req, res){
        dataSource.getSports({forceRefresh: true}).then(function(sports){
            res.status(200).json(sports);
        })
    });



    return app;
}
