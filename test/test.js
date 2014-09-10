/* global describe */
/* global it */
/* jshint node:true */
/* jshint unused:false */

"use strict";

var should = require("should"),
    nock = require("nock"),
    phone = 2125558383,
    wrong_phone = 212555838,
    profile_id = "97d949a413f4ea8b85e9586e1f2d9a",
    api_key = "XXXXXXXXXXXXX",
    apio_secret = "YYYYYYYYYYYYYYY",
    client = new (require("../index.js").Client)(api_key, apio_secret),
    phone_response_object = {
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
    }, profile_response_object = {
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
    }, profile_request_object = {
        "first_name": "Clark",
        "last_name": "Kent",
        "shipping_address1": {
            "line1": "225 Kryptonite Ave.",
            "line2": "",
            "city": "Smallville",
            "state": "KS",
            "zip_code": "66002"
        }
    }, wrong_phone_error = {
        "error": {
            "message": "The number you have entered is invalid. Please ensure your number contains 10 digits.",
            "code": "555",
            "type": "Bad Request"
        }
    };


describe("getPhone", function () {
    it("should return the correct response", function (done) {
        var phone_response_object_str = JSON.stringify(phone_response_object);
        nock("https://api.nextcaller.com")
            .log(console.log)
            .get("/v2/records/?format=json&phone=" + phone)
            .reply(200, phone_response_object_str);
        client.getPhone(phone, function (data) {
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profile_id);
            done();
        });
    });
});


describe("getPhone", function () {
    it("should not return the correct response with wrong phone", function (done) {
        var phone_error_object_str = JSON.stringify(wrong_phone_error);
        nock("https://api.nextcaller.com")
            .log(console.log)
            .get("/v2/records/?format=json&phone=" + wrong_phone)
            .reply(400, phone_error_object_str);
        client.getPhone(wrong_phone, null, function (data) {
            data.error.code.should.equal("555");
            done();
        });
    });
});


describe("getProfile", function () {
    it("should return the correct response", function (done) {
        var profile_response_object_str = JSON.stringify(profile_response_object);
        nock("https://api.nextcaller.com")
            .log(console.log)
            .get("/v2/users/" + profile_id + "/?format=json")
            .reply(200, profile_response_object_str);
        client.getProfile(profile_id, function (data) {
            data.phone[0].number.should.equal(phone.toString());
            data.id.should.equal(profile_id);
            done();
        });
    });
});


describe("updateProfile", function () {
    it("should return the correct response", function (done) {
        nock("https://api.nextcaller.com")
            .log(console.log)
            .post("/v2/users/" + profile_id + "/?format=json")
            .reply(204, "");
        client.updateProfile(profile_id, profile_request_object, function (data) {
            data.should.equal("");
            done();
        });
    });
});
