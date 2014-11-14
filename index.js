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


function make_request(options, success_callback, error_callback, data) {

    var error_handler = function (err, status_code) {
        var json_message = err.message || err;
        try {
            json_message = JSON.parse(json_message);
        } catch (error) {}
        if (typeof(error_callback) === 'function') {
            error_callback(json_message, status_code);
        } else {
            console.log(json_message);
        }
    };

    var success_handler = function (data, status_code) {
        var json_message = data;
        try {
            json_message = JSON.parse(data);
        } catch (error) {}
        if (typeof(success_callback) === 'function') {
            success_callback(json_message, status_code);
        } else {
            console.log(json_message);
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
                error_handler(body, res.statusCode);
            } else {
                success_handler(body, res.statusCode);
            }
        });
    });

    req.on('error', function(err) {
        error_handler(err);
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
    this.sandbox = !!sandbox;
    this.version = version || defaultApiVersion;
    this.base_url =  this.sandbox ?  sandboxHostname : hostname;
}

NextCallerClient.prototype.getByPhone = function(phone, success_callback, error_callback) {
    var options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/records/?format=json&phone=' + phone,
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, success_callback, error_callback);
};

NextCallerClient.prototype.getByProfileId = function(profile_id, success_callback, error_callback) {
    var options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/users/' + profile_id + '/?format=json',
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, success_callback, error_callback);
};

NextCallerClient.prototype.updateByProfileId = function(profile_id, data, success_callback, error_callback) {
    var json_data = JSON.stringify(data),
        options = {
            hostname: this.base_url,
            port: port,
            path: '/' + this.version + '/users/' + profile_id + '/?format=json',
            method: 'POST',
            auth: this.username + ':' + this.username,
            headers: {
                'Content-Type': jsonContentType,
                'Content-Length': json_data.length
            }
    };
    make_request(options, success_callback, error_callback, json_data);
};

module.exports = {
    'NextCallerClient': NextCallerClient,
    'hostname': hostname,
    'sandboxHostname': sandboxHostname,
    'defaultApiVersion': defaultApiVersion
};
