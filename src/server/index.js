/**
 * This file is the first file you will run when running the server.
 */
require = require('../../getWebpackRequire');
require('server/boot')({}, function(err, data){
    data.app.listen(80);
});
