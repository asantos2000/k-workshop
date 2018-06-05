const Consumer = require('sqs-consumer');
const AWS = require('aws-sdk');

AWS.config.update({
  region: 'us-east-1'
});

const app = Consumer.create({
  queueUrl: 'https://sqs.us-east-1.amazonaws.com/523005990244/events',
  handleMessage: (message, done) => {
    // do some work with `message`
    console.log(message);
    done();
  }
});
 
app.on('error', (err) => {
  console.log(err.message);
});
 
app.start();