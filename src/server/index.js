/**
 * @class server.index
 * This file is the first file you will run when running the server.
 * This loads the app from server.boot and make it listen on port 80.
 */
require = require('../../getWebpackRequire');
require('server/boot')({}).then(function(data){
    data.app.listen(80);
});
