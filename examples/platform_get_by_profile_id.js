var username = "XXXXX",
    password = "XXXXX",
    profile_id = "XXXXXXXXX",
    sandbox = false,
    version = 'v2',
    platform_username = 'test',
    module = require("../index.js"),
    client = module.NextCallerPlatformClient(username, password, sandbox, version);
client.getByProfileId(profile_id, platform_username, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});