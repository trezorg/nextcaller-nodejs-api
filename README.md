nextcaller-nodejs-api
=====================

[![Build Status](https://travis-ci.org/Nextcaller/nextcaller-nodejs-api.svg?branch=master)](https://travis-ci.org/Nextcaller/nextcaller-nodejs-api)

A NodeJS wrapper around the Nextcaller API.

Installation
------------

Installation:

    $ npm install -g nextcaller-nodejs-api

Example
-------

    var api_key = "XXXXX",
        api_secret = "XXXXX",
        phone_number = "121212...",
        module = require("nextcaller-nodejs-api"),
        client = module.Client(api_key, api_secret);
    client.getPhone(phone_number, function (data, status_code) {
        console.log(data);
        console.log(status_code);
    }, function (error, status_code) {
        console.log(error);
        console.log(status_code);
    });


Client
-------------

    var api_key = "XXXXX",
        api_secret = "XXXXX",
        module = require("nextcaller-nodejs-api"),
        client = module.Client(api_key, api_secret);

    Parameters:

    api_key - api key
    api_secret - api secret


API Items
-------------

### Get profile by phone ###

    client.getPhone(number, success_callback, error_callback)
    
    Parameters:
    
    number - phone number
    success_callback - function called on a success result
    function success_callback(data, status_code) {
        console.log(data);
        console.log(status_code);
    }
    error_callback - function called on an error
    function error_callback(error, status_code) {
        console.log(error);
        console.log(status_code);
    }

### Get profile by id ###

    client.getProfile(profile_id, success_callback, error_callback)
    
    Parameters:
    
    profile_id - id of a profile
    success_callback - function called on a success result
    function success_callback(data, status_code) {
        console.log(data);
        console.log(status_code);
    }
    error_callback - function called on an error
    function error_callback(error, status_code) {
        console.log(error);
        console.log(status_code);
    }

### Update profile ###

    client.updateProfile(profile_id, data, success_callback, error_callback)
    
    Parameters:
    
    profile_id - id of a profile
    data - data to update
    success_callback - function called on a success result
    function success_callback(data, status_code) {
        console.log(data);
        console.log(status_code);
    }
    error_callback - function called on an error
    function error_callback(error, status_code) {
        console.log(error);
        console.log(status_code);
    }

    Example:
    profile_id = "XXXXXXXXX" 
    data = {
        "email": "test@test.com"
    }
    function success_callback(data, status_code) {
        console.log("Response data: ", data);
        console.log("Status code: ",status_code);
    }
    function error_callback(error, status_code) {
        console.log("Error: ", error);
        console.log("Status code: ",status_code);
    }
    client.updateProfile(profile_id, data, success_callback, error_callback);
