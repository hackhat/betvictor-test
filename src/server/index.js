/**
 * This file is the first file you will run when running the server.
 */
require = require('../../getWebpackRequire');
require('server/boot')({}).then(function(data){
    data.app.listen(80);
});
