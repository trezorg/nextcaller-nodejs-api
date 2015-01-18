var username = "XXXXX",
    password = "XXXXX",
    sandbox = false,
    version = 'v2',
    module = require("../index.js"),
    platfom_username = 'test1',
    client = module.NextCallerPlatformClient(username, password, sandbox, version);
client.getPlatformUser(platfom_username, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});