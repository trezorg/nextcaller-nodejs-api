var username = "XXXXX",
    password = "XXXXX",
    sandbox = false,
    version = 'v2'
    module = require("../index.js"),
    client = module.NextCallerPlatformClient(username, password, sandbox, version);
client.getPlatformStatistics(null, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});