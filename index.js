/*global require*/
/*global module*/
/*global console*/

'use strict';

var https = require('https'),
    hostname = 'api.nextcaller.com',
    port = 443,
    json_content_type = 'application/json; charset=utf-8';


function make_request(options, success_callback, error_callback, data) {

    var error_handler = function (err) {
        var json_message = err.message || err;
        try {
            json_message = JSON.parse(err.message || err);
        } catch (error) {}
        if (typeof(error_callback) === 'function') {
            error_callback(json_message);
        } else {
            console.log(json_message);
        }
    };

    var success_handler = function (data) {
        var json_message = data;
        try {
            json_message = JSON.parse(data);
        } catch (error) {}
        if (typeof(success_callback) === 'function') {
            success_callback(json_message);
        } else {
            console.log(json_message);
        }
    };

    var req = https.request(options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            if (res.statusCode >= 400) {
                error_handler(chunk);
            } else {
                success_handler(chunk);
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

function Client(api_key, api_secret) {
    if (!(this instanceof Client)) {
        return new Client(api_key, api_secret);
    }
    this.api_key = api_key;
    this.api_secret = api_secret;
}

Client.prototype.getPhone = function(phone, success_callback, error_callback) {
    var options = {
        hostname: hostname,
        port: port,
        path: '/v2/records/?format=json&phone=' + phone,
        method: 'GET',
        auth: this.api_key + ':' + this.api_secret
    };
    make_request(options, success_callback, error_callback);
};

Client.prototype.getProfile = function(profile_id, success_callback, error_callback) {
    var options = {
        hostname: hostname,
        port: port,
        path: '/v2/users/' + profile_id + '/?format=json',
        method: 'GET',
        auth: this.api_key + ':' + this.api_secret
    };
    make_request(options, success_callback, error_callback);
};

Client.prototype.updateProfile = function(profile_id, data, success_callback, error_callback) {
    var json_data = JSON.stringify(data),
        options = {
            hostname: hostname,
            port: port,
            path: '/v2/users/' + profile_id + '/?format=json',
            method: 'POST',
            auth: this.api_key + ':' + this.api_secret,
            headers: {
                'Content-Type': json_content_type,
                'Content-Length': json_data.length
            }
    };
    make_request(options, success_callback, error_callback, json_data);
};

module.exports = {
    'Client': Client
};
