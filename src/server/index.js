/**
 * This file is the first file you will run when running the server.
 */
require = require('../../getWebpackRequire');
var app = require('server/boot')({});
app.listen(80);
