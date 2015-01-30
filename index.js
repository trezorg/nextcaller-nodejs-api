/*global require*/
/*global module*/
/*global console*/

'use strict';

var https = require('https'),
    hostname = 'api.nextcaller.com',
    sandboxHostname = 'api.sandbox.nextcaller.com',
    defaultApiVersion = 'v2',
    port = 443,
    jsonContentType = 'application/json; charset=utf-8';


function serialize(obj) {
    var pairs = Object.keys(obj).reduce(
        function(acc, key){
            acc.push(
                encodeURIComponent(key) + '=' +
                encodeURIComponent(obj[key])
            );
          return acc;
        }, []
    ).join('&');
    return '?' + pairs;

}

function make_request(options, successCallback, errorCallback, data) {

    var errorHandler = function (err, statusCode) {
        var jsonMessage = err.message || err;
        try {
            jsonMessage = JSON.parse(jsonMessage);
        } catch (error) {}
        if (typeof(errorCallback) === 'function') {
            errorCallback(jsonMessage, statusCode);
        } else {
            console.log(jsonMessage);
        }
    };

    var successHandler = function (data, statusCode) {
        var jsonMessage = data;
        try {
            jsonMessage = JSON.parse(data);
        } catch (error) {}
        if (typeof(successCallback) === 'function') {
            successCallback(jsonMessage, statusCode);
        } else {
            console.log(jsonMessage);
        }
    };

    var req = https.request(options, function(res) {
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            if (res.statusCode >= 400) {
                errorHandler(body, res.statusCode);
            } else {
                successHandler(body, res.statusCode);
            }
        });
    });

    req.on('error', function(err) {
        errorHandler(err);
    });

    if (data) {
        req.write(data);
    }
    req.end();
}

function NextCallerClient(username, password, sandbox, version) {
    if (!(this instanceof NextCallerClient)) {
        return new NextCallerClient(username, password, sandbox, version);
    }
    this.username = username;
    this.password = password;
    this.version = version || defaultApiVersion;
    this.base_url =  !!sandbox ?  sandboxHostname : hostname;
}

NextCallerClient.prototype.getByPhone = function(phone, successCallback, errorCallback) {
    var params = {
        'format': 'json',
        'phone': phone
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/records/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerClient.prototype.getByAddressName = function(address_data, successCallback, errorCallback) {
    address_data['format'] = 'json';
    var options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/records/' + serialize(address_data),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerClient.prototype.getByProfileId = function(profileId, successCallback, errorCallback) {
    var params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/users/' + profileId + '/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerClient.prototype.updateByProfileId = function(profileId, data, successCallback, errorCallback) {
    var jsonData = JSON.stringify(data),
    params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/users/' + profileId + '/' + serialize(params),
        method: 'POST',
        auth: this.username + ':' + this.username,
        headers: {
            'Content-Type': jsonContentType,
            'Content-Length': jsonData.length
        }
    };
    make_request(options, successCallback, errorCallback, jsonData);
};

NextCallerClient.prototype.getFraudLevel = function(phone, successCallback, errorCallback) {
    var params = {
        'format': 'json',
        'phone': phone
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/fraud/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerClient.prototype.getFraudLevel = function(phone, successCallback, errorCallback) {
    var params = {
        'format': 'json',
        'phone': phone
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/fraud/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

/* Platform client */

function NextCallerPlatformClient(username, password, sandbox, version) {
    if (!(this instanceof NextCallerPlatformClient)) {
        return new NextCallerPlatformClient(username, password, sandbox, version);
    }
    this.username = username;
    this.password = password;
    this.sandbox = !!sandbox;
    this.version = version || defaultApiVersion;
    this.base_url =  this.sandbox ?  sandboxHostname : hostname;
}

NextCallerPlatformClient.prototype.getByPhone = function(phone, platformUsername, successCallback, errorCallback) {
    var params = {
        'format': 'json',
        'phone': phone,
        'platform_username': platformUsername
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/records/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.getByAddressName = function(address_data, platformUsername, successCallback, errorCallback) {
    address_data['format'] = 'json';
    address_data['platform_username'] = platformUsername;
    var options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/records/' + serialize(address_data),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.getByProfileId = function(profileId, platformUsername, successCallback, errorCallback) {
    var params = {
        'format': 'json',
        'platform_username': platformUsername
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/users/' + profileId + '/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.updateByProfileId = function(profileId, data, platformUsername, successCallback, errorCallback) {
    var jsonData = JSON.stringify(data),
    params = {
        'format': 'json',
        'platform_username': platformUsername
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/users/' + profileId + '/' + serialize(params),
        method: 'POST',
        auth: this.username + ':' + this.username,
        headers: {
            'Content-Type': jsonContentType,
            'Content-Length': jsonData.length
        }
    };
    make_request(options, successCallback, errorCallback, jsonData);
};

NextCallerPlatformClient.prototype.getPlatformStatistics = function(page, successCallback, errorCallback) {
    if (!page) {
        page = 1;
    }
    var params = {
        'format': 'json',
        'page': page
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/platform_users/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.username
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.getPlatformUser = function(platform_username, successCallback, errorCallback) {
    var params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/platform_users/' + platform_username + '/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.username
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.updatePlatformUser = function(platformUsername, data, successCallback, errorCallback) {
    var jsonData = JSON.stringify(data),
    params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/platform_users/' + platformUsername + '/' + serialize(params),
        method: 'POST',
        auth: this.username + ':' + this.username,
        headers: {
            'Content-Type': jsonContentType,
            'Content-Length': jsonData.length
        }
    };
    make_request(options, successCallback, errorCallback, jsonData);
};

NextCallerPlatformClient.prototype.getFraudLevel = function(phone, platformUsername, successCallback, errorCallback) {
    var params = {
        'format': 'json',
        'phone': phone,
        'platform_username': platformUsername
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/fraud/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

module.exports = {
    'NextCallerClient': NextCallerClient,
    'NextCallerPlatformClient': NextCallerPlatformClient,
    'hostname': hostname,
    'sandboxHostname': sandboxHostname,
    'defaultApiVersion': defaultApiVersion,
    'serialize': serialize
};
