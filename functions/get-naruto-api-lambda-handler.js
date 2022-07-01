//Create clients and set shared const values outside of the handler.
//Get the DynamoDB table name from environment variables.
const tableName = process.env.TABLE_NAME;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require("@aws-sdk/client-dynamodb");
const documentClient = new dynamodb.DocumentClient();


exports.handler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`Only GET requests are accepted: ${event.httpMthod}`);
    }

    console.info('recieved:', event);

    var params = {
        TableName: tableName,
    };

    const data = await documentClient.scan(params).promise();
    const items = data.Items;
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(items)
    };

    // All log statements are written to CloudWatch Logs
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    console.info(`Deployment Test 1.2`)
    return response;
}


// exports.handler = async function(event){
//     console.log("request",JSON.stringify(event,undefined,2));
//     return{
//       statusCode:200,
//       headers:{ "Content-Type": "text/plain"},
//       body: `Hello from Product! You've hit ${event.path}\n`
//     };
//   };
