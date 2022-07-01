//Create clients and set shared const values outside of the handler.
//Get the DynamoDB table name from environment variables.
const tableName = process.env.TABLE_NAME;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk.clients.dynamodb');
const documentClient = new dynamodb.DocumentClient();


exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`Only POST requests are accepted: ${event.httpMthod}`);
    }

    // All log statemenrts are written to CloudWatch Logs
    console.info('recieved:', event);

    //Get id and name from the request body
    const body = JSON.parse(event.body);
    const id = body.id;
    const name = body.name;

    // Create a new item, or replaces an old item with a new item

    var params = {
        TableName: tableName,
        Item: { id: id, name: name }
    };

  const result = await documentClient.put(params).promise();
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(items)
    };

    // All log statements are written to CloudWatch Logs
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    console.info(`Deployment Test 1.1`)
    return response;
}