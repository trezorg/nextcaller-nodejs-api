/* global describe */
/* global it */
/* global require */
/* jshint node:true */
/* jshint unused:false */

"use strict";

var should = require("should"),
    nock = require("nock"),
    phone = 2125558383,
    wrongPhone = 212555838,
    profileId = "97d949a413f4ea8b85e9586e1f2d9a",
    wrongProfileId = profileId + "XXXXXXXXXXX",
    username = "XXXXXXXXXXXXX",
    password = "YYYYYYYYYYYYYYY",
    index = require("../index.js"),
    apiVersion = index.defaultApiVersion,
    apiHostname = index.sandboxHostname,
    client = new (index.NextCallerClient)(username, password, true, apiVersion),
    phoneResponseObject = {
        "records": [
            {
                "id": "97d949a413f4ea8b85e9586e1f2d9a",
                "first_name": "Jerry",
                "last_name": "Seinfeld",
                "name": "Jerry Seinfeld",
                "language": "English",
                "fraud_threat": "low",
                "spoof": "false",
                "phone": [
                    {
                        "number": "2125558383"
                    }
                ],
                "carrier": "Verizon Wireless",
                "line_type": "LAN",
                "address": [
                    {
                        "city": "New York",
                        "extended_zip": "",
                        "country": "USA",
                        "line2": "Apt 5a",
                        "line1": "129 West 81st Street",
                        "state": "NY",
                        "zip_code": "10024"
                    }
                ],
                "email": "demo@nextcaller.com",
                "age": "45-54",
                "gender": "Male",
                "household_income": "50k-75k",
                "marital_status": "Single",
                "presence_of_children": "No",
                "home_owner_status": "Rent",
                "market_value": "350k-500k",
                "length_of_residence": "12 Years",
                "high_net_worth": "No",
                "occupation": "Entertainer",
                "education": "Completed College",
                "department": "not specified"
            }
        ]
    }, profileResponseObject = {
        "id": "97d949a413f4ea8b85e9586e1f2d9a",
        "first_name": "Jerry",
        "last_name": "Seinfeld",
        "name": "Jerry Seinfeld",
        "language": "English",
        "fraud_threat": "low",
        "spoof": "false",
        "phone": [
            {
                "number": "2125558383"
            }
        ],
        "carrier": "Verizon Wireless",
        "line_type": "LAN",
        "address": [
            {
                "city": "New York",
                "extended_zip": "",
                "country": "USA",
                "line2": "Apt 5a",
                "line1": "129 West 81st Street",
                "state": "NY",
                "zip_code": "10024"
            }
        ],
        "email": "demo@nextcaller.com",
        "age": "45-54",
        "gender": "Male",
        "household_income": "50k-75k",
        "marital_status": "Single",
        "presence_of_children": "No",
        "home_owner_status": "Rent",
        "market_value": "350k-500k",
        "length_of_residence": "12 Years",
        "high_net_worth": "No",
        "occupation": "Entertainer",
        "education": "Completed College",
        "department": "not specified"
    }, profileRequestObject = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "test@test.com",
        "shipping_address1": {
            "line1": "225 Kryptonite Ave.",
            "line2": "",
            "city": "Smallville",
            "state": "KS",
            "zip_code": "66002"
        }
    }, wrongPhoneError = {
        "error": {
            "message": "The number you have entered is invalid. Please ensure your number contains 10 digits.",
            "code": "555",
            "type": "Bad Request"
        }
    };


describe("getPhone with correct phone number", function () {
    it("should return the correct response", function (done) {
        var phoneResponseObjectStr = JSON.stringify(phoneResponseObject);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/records/?format=json&phone=" + phone)
            .reply(200, phoneResponseObjectStr);
        client.getByPhone(phone, function (data, status_code) {
            status_code.should.equal(200);
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profileId);
            done();
        });
    });
});


describe("getPhone with incorrect phone number", function () {
    it("should return 400 error", function (done) {
        var phone_error_object_str = JSON.stringify(wrongPhoneError);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/records/?format=json&phone=" + wrongPhone)
            .reply(400, phone_error_object_str);
        client.getByPhone(wrongPhone, null, function (data, status_code) {
            status_code.should.equal(400);
            data.error.code.should.equal("555");
            done();
        });
    });
});


describe("getProfile with correct profile id", function () {
    it("should return the correct response", function (done) {
        var profile_response_object_str = JSON.stringify(profileResponseObject);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/users/" + profileId + "/?format=json")
            .reply(200, profile_response_object_str);
        client.getByProfileId(profileId, function (data, status_code) {
            status_code.should.equal(200);
            data.phone[0].number.should.equal(phone.toString());
            data.id.should.equal(profileId);
            done();
        });
    });
});


describe("getProfile with incorrect profile id", function () {
    it("should return 404 response", function (done) {
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/users/" + wrongProfileId + "/?format=json")
            .reply(404, "");
        client.getByProfileId(wrongProfileId, null, function (error, status_code) {
            status_code.should.equal(404);
            error.should.equal("");
            done();
        });
    });
});


describe("updateProfile with correct profile id", function () {
    it("should return the correct response", function (done) {
        nock("https://" + apiHostname)
            .post("/" + apiVersion + "/users/" + profileId + "/?format=json")
            .reply(204, "");
        client.updateByProfileId(profileId, profileRequestObject, function (data, status_code) {
            status_code.should.equal(204);
            data.should.equal("");
            done();
        });
    });
});


describe("updateProfile with incorrect profile id", function () {
    it("should return 404 response", function (done) {
        nock("https://" + apiHostname)
            .post("/" + apiVersion + "/users/" + wrongProfileId+ "/?format=json")
            .reply(404, "");
        client.updateByProfileId(wrongProfileId, profileRequestObject, null, function (error, status_code) {
            status_code.should.equal(404);
            error.should.equal("");
            done();
        });
    });
});
