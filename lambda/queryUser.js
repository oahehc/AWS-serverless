"use strict";
const AWS = require('aws-sdk');
const TableName = 'aws-serverless';
const region = 'us-east-1';
exports.handler = function (event, context, callback) {
    const dynamodb = new AWS.DynamoDB({
        apiVersion: '2012-08-10',
        region,
    });
    dynamodb.scan({
        TableName,
    }, function (err, data) {
        if (err) {
            console.log('query user list fail', err);
            callback(err, null);
        } else {
            console.log('query user result', data);
            callback(null, data.Items);
        }
    });
};

// query by userId and email
// "use strict";
// const AWS = require('aws-sdk');
// const TableName = 'aws-serverless';
// const region = 'us-east-1';
// exports.handler = function (event, context, callback) {
//     if (!event.userId || !event.email) callback('no userId or email', null);
//     const dynamodb = new AWS.DynamoDB({
//         apiVersion: '2012-08-10',
//         region,
//     });
//     const params = {
//         Key: {
//             "userId": {
//                 S: event.userId,
//             },
//             "email": {
//                 S: event.email,
//             },
//         },
//         TableName,
//     };
//     console.log(params);
//     dynamodb.getItem(params, (err, data) => {
//         if (err) {
//             console.log('query user list fail', err);
//             callback(err, null);
//         } else {
//             console.log('query user result', data);
//             callback(null, data.Item);
//         }
//     });
// };