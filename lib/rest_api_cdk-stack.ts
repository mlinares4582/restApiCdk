import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration, LambdaRestApi } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { join } from 'path';


export class RestApiCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const narutoTable = new Table(this,'naruto-api-table',{
      partitionKey: { name: "id", type: AttributeType.STRING },
    });

    // const narutoApiLambdaFunction = new Function(this,'naruto-api-lambda-handler',{
    //   runtime: Runtime.NODEJS_12_X,
    //   code: Code.fromAsset("functions"),
    //   handler: "naruto-api-lambda-handler.handler",
    //   environment: {
    //     TABLE_NAME: narutoTable.tableName,
    //   },
    // });

    const getNarutoLambdaFunction = new NodejsFunction(this, 'GetNarutoLambda', {
      entry: join(__dirname, '../functions/get-naruto-api-lambda-handler.js'),
      functionName: 'get-naruto-lambda-function',
      bundling:{
        externalModules:[
          'aws-sdk',
        ]
      },
    environment: {
      PRIMARY_KEY: "id",
      TABLE_NAME: narutoTable.tableName,
    }
  });
    //permission for lambda to access the table
    narutoTable.grantReadWriteData(getNarutoLambdaFunction);


  //   const putNarutoLambda = new Function(this,'put-naruto-api-lambda-handler',{
  //     runtime: Runtime.NODEJS_12_X,
  //     code: Code.fromAsset("functions"),
  //     handler: "put-naruto-api-lambda-handler.handler",
  //     environment: {
  //       TABLE_NAME: narutoTable.tableName,
  //   },
  // });


  
    const putNarutoLambdaFunction = new NodejsFunction(this, 'PutNarutoLambda', {
      entry: join(__dirname, '../functions/put-naruto-api-lambda-handler.js'),
      functionName: 'put-naruto-lambda-function',
      bundling:{
        externalModules:[
          'aws-sdk',
        ]
      },
    environment: {
      PRIMARY_KEY: "id",
      TABLE_NAME: narutoTable.tableName,
    }
  });

  //permission for lambda to access the table
  narutoTable.grantReadWriteData(putNarutoLambdaFunction);

    
    // //Create the API Gateway method and path
    // const api = new RestApi(this, 'naruto-api');
    // api.root
    //   .resourceForPath("naruto")
    //   .addMethod('GET', new LambdaIntegration(getNarutoLambdaFunction));

    // api.root
    //   .resourceForPath("naruto")//endpoint
    //   .addMethod('POST', new LambdaIntegration(putNarutoLambdaFunction));


    const api = new LambdaRestApi(this, 'naruto-api', {
      restApiName: 'Naruto Api',
      handler: getNarutoLambdaFunction,
      proxy: false,
    });

    const naruto = api.root.addResource('naruto');
    naruto.addMethod('GET');



      new CfnOutput(this, "API URL", {
        value: api.url ?? "Something went wrong"
      });
  }
}
