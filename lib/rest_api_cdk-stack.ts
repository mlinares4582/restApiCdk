import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Function, Runtime, Code } from 'aws-cdk-lib/aws-lambda';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';


export class RestApiCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const narutoTable = new Table(this,'naruto-api-table',{
      partitionKey: { name: "id", type: AttributeType.STRING },
    });

    const narutoApiLambdaFunction = new Function(this,'naruto-api-lambda-handler',{
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset("functions"),
      handler: "naruto-api-lambda-handler.handler",
      environment: {
        TABLE_NAME: narutoTable.tableName,
      },
    });
    //permission for lambda to access the table
    narutoTable.grantReadWriteData(narutoApiLambdaFunction);


    const putNarutoLambda = new Function(this,'put-naruto-api-lambda-handler',{
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset("functions"),
      handler: "put-naruto-api-lambda-handler.handler",
      environment: {
        TABLE_NAME: narutoTable.tableName,
    },
  });
  //permission for lambda to access the table
  narutoTable.grantReadWriteData(putNarutoLambda);

    
    //Create the API Gateway method and path
    const api = new RestApi(this, 'naruto-api');
    api.root
      .resourceForPath("naruto")
      .addMethod('GET', new LambdaIntegration(narutoApiLambdaFunction));

    api.root
      .resourceForPath("naruto")//endpoint
      .addMethod('POST', new LambdaIntegration(putNarutoLambda));


      new CfnOutput(this, "API URL", {
        value: api.url ?? "Something went wrong"
      });
  }
}
