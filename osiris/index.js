// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'us-east-1' });

// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

var queueURL = "https://sqs.us-east-1.amazonaws.com/523005990244/events";

var params = {
    AttributeNames: [
        "SentTimestamp"
    ],
    MaxNumberOfMessages: 1,
    MessageAttributeNames: [
        "All"
    ],
    QueueUrl: queueURL,
    VisibilityTimeout: 0,
    WaitTimeSeconds: 0
};

sqs.receiveMessage(params, function (err, data) {
    if (err) {
        console.log("Receive Error", err);
    } else if (data.Messages) {
        console(data.Messages);
        var deleteParams = {
            QueueUrl: queueURL,
            ReceiptHandle: data.Messages[0].ReceiptHandle
        };
        sqs.deleteMessage(deleteParams, function (err, data) {
            if (err) {
                console.log("Delete Error", err);
            } else {
                console.log("Message Deleted", data);
            }
        });
    }
});