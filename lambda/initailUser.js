"use strict";
const AWS = require('aws-sdk');
const TableName = 'aws-serverless';
const region = 'us-east-1';
exports.handler = function (event, context, callback) {
    console.log(event.request);
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') {
        // add vendor info to dynamoDB table
        const dynamoConfig = {
            sessionToken: process.env.AWS_SESSION_TOKEN,
            region,
        };
        console.log('dynamoConfig', dynamoConfig);
        const docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
        let params = {
            TableName,
            Item: {
                userId: event.request.userAttributes['userId'],
                email: event.request.userAttributes['email'],
                createTimeStamp: new Date().getTime(),
                message: [],
            },
        };
        docClient.put(params, function (err, data) {
            if (err) {
                console.log('update table error', err);
                return callback(err, null);
            } else {
                callback(null, event);
            }
        });
    } else {
        return callback("Invalid trigger source.", null);
    }
};