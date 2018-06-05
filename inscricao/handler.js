/* Include the AWS sdk.
 * No need to add to package.json. It's included in lambda env
*/
const AWS = require('aws-sdk');
// Connect to DynamoDB
const dynamoDb = new AWS.DynamoDB.DocumentClient();
//Create a Translator object, which comes from the DocumentClient
var dynamodbTranslator = dynamoDb.getTranslator();
// Create an SQS service object
var sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

//It needs a SDK 'shape'. The individual Items in the Stream record
//are themselves the same Item shape as we see in a getItem response
var ItemShape = dynamoDb.service.api.operations.getItem.output.members.Item;

// Save item in DynamoDB table
module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const body = JSON.parse(event.body)

  if (!body || !body.email) {
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        error: 'no body found or email found'
      })
    })
  }

  const params = {
    TableName: process.env.MY_TABLE,
    Item: {
      id: Math.random().toString(36).slice(2),
      timestamp: timestamp,
      email: body.email,
      docId: body.docId,
      name: body.name
    },
  };

  // write the record to the database
  dynamoDb.put(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error)
      return callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t create the dynamo item.',
      })
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    }
    return callback(null, response)
  })
}

// Update item in DynamoDB table
module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const body = JSON.parse(event.body)

  if (!body) {
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        error: 'no body found found'
      })
    })
  }
  
  const params = {
    TableName: process.env.MY_TABLE,
    Key: {
      'id' : event.pathParameters.id
    },
    UpdateExpression: 'set #t = :t, #e = :e, #d = :d, #n = :n',
    ExpressionAttributeNames: {
      '#t' : 'timestamp',
      '#e' : 'email',
      '#d' : 'docId',
      '#n' : 'name'
    },
    ExpressionAttributeValues: {
      ':t' : timestamp,
      ':e' : body.email,
      ':d' : body.docId,
      ':n' : body.name
    }
  };

  console.log(params);

  // write the record to the database
  dynamoDb.update(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error)
      return callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t update the dynamo item.',
      })
    }

    // create a response
    const response = {
      statusCode: 204,
      body: "",
    }
    return callback(null, response)
  })
}

/* Scan a dynamoDB table and return items */
module.exports.scan = (event, context, callback) => {
  // const params = {
  //   TableName: process.env.MY_TABLE
  // };

  console.log(event.pathParameters);
  console.log(event.queryStringParameters);

  var params = {
    TableName: process.env.MY_TABLE,
    FilterExpression: "#k_email = :v_email",
    ExpressionAttributeNames: {
      "#k_email": "email"
    },
    ExpressionAttributeValues: {
      ":v_email": event.queryStringParameters.email
    }
  };

  console.log(params);

  // fetch all todos from the database
  dynamoDb.scan(params, (error, result) => {
    // handle potential errors
    if (error) {
      console.error(error)
      return callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t fetch the records.',
      })
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    }
    return callback(null, response)
  })
}

module.exports.delete = (event, context, callback) => {
  const body = JSON.parse(event.body)

  if (!body || !body.id) {
    return callback(null, {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({
        error: 'no body found or id found'
      })
    })
  }

  const params = {
    TableName: process.env.MY_TABLE,
    Key: {
      id: body.id,
    },
  }

  // delete the record from the database
  dynamoDb.delete(params, (error) => {
    // handle potential errors
    if (error) {
      console.error(error)
      return callback(null, {
        statusCode: error.statusCode || 501,
        headers: { 'Content-Type': 'text/plain' },
        body: 'Couldn\'t remove the record item.',
      })
    }

    // create a response
    const response = {
      statusCode: 200,
      body: JSON.stringify({
        message: `inscricao ${body.id} deleted`
      }),
    }
    return callback(null, response)
  })
}

/* Function to handle items on the dynamoDB stream */
module.exports.dynamoStreamHandler = (event, context, callback) => {
  event.Records.forEach((record) => {
    console.log(record.eventID);
    console.log(record.eventName);
    console.log('DynamoDB Record: %j', record.dynamodb);

    //record = AWS.DynamoDB.Converter.unmarshall(record.dynamodb);
    //console.log(record);

    if (record.eventName === 'INSERT') {
      console.log('INSERT EVENT. DO WELCOME STUFF')
    };
    if (record.eventName === 'REMOVE') {
      console.log('REMOVAL EVENT. DO REMOVAL STUFF')
    };

    record.dynamodb.OldImage = dynamodbTranslator.translateOutput(record.dynamodb.OldImage, ItemShape);
    record.dynamodb.NewImage  = dynamodbTranslator.translateOutput(record.dynamodb.NewImage, ItemShape);

    console.log(record.dynamodb.OldImage);
    console.log(record.dynamodb.NewImage);

    body = {
      event: record.eventName,
      eventId: record.eventID,
      ApproximateCreationDateTime: record.dynamodb.ApproximateCreationDateTime,
      oldImage: record.dynamodb.OldImage,
      newImage: record.dynamodb.NewImage
    };

    var params = {
      DelaySeconds: 10,
      //MessageBody: JSON.stringify(record.dynamodb),
      MessageBody: JSON.stringify(body),
      QueueUrl: 'https://sqs.us-east-1.amazonaws.com/523005990244/events'
    };

    sqs.sendMessage(params, function (err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        console.log("Success", data.MessageId);
      }
    });
  })
  return callback(null, `Successfully processed ${event.Records.length} records.`);
}