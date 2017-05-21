"use strict";
const AWS = require('aws-sdk');
const TableName = 'aws-serverless'; // dynamodb table name
const region = 'us-east-1'; // dynamodb region : http://docs.aws.amazon.com/zh_cn/sns/latest/dg/sms_supported-countries.html
exports.handler = function (event, context, callback) {
    console.log(event.request);
    if (event.triggerSource === 'PostConfirmation_ConfirmSignUp') { // limit this function only execute by cognito Post confirmation trigger
        const dynamoConfig = {
            sessionToken: process.env.AWS_SESSION_TOKEN,
            region,
        };
        const docClient = new AWS.DynamoDB.DocumentClient(dynamoConfig);
        let params = {
            TableName,
            Item: {
                userId: event.request.userAttributes['custom:userId'], // get userId and email from event which trigger by cognito
                email: event.request.userAttributes['email'],
                createTimeStamp: new Date().getTime(),
                message: [],
            },
        };
        docClient.put(params, function (err, data) {
            if (err) {
                console.log('update table error', err); // console.log in lambda function will log to cloud watch for tracking and debugging
                return callback(err, null);
            } else {
                callback(null, event);
            }
        });
    } else {
        return callback("Invalid trigger source.", null);
    }
};