"use strict";
const AWS = require('aws-sdk');
const TableName = 'aws-serverless';
const region = 'us-east-1';
exports.handler = function (event, context, callback) {
    if (!event.userId) callback('no userId', null);
    const dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        region,
    });
    dynamodb.scan({
        TableName,
        ExpressionAttributeValues: {
            ':userId': {
                S: event.userId,
            },
        },
        FilterExpression: "userId = :userId",
    }, (err, data) => {
        if (err) {
            console.log('query user list fail', err);
            callback(err, null);
        } else {
            console.log('query user result', data);
            callback(null, data.Items);
        }
    });
};