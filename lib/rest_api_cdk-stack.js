"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestApiCdkStack = void 0;
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_dynamodb_1 = require("aws-cdk-lib/aws-dynamodb");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
class RestApiCdkStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        var _a;
        super(scope, id, props);
        const narutoTable = new aws_dynamodb_1.Table(this, 'naruto-api-table', {
            partitionKey: { name: "id", type: aws_dynamodb_1.AttributeType.STRING },
        });
        const narutoApiLambdaFunction = new aws_lambda_1.Function(this, 'naruto-api-lambda-handler', {
            runtime: aws_lambda_1.Runtime.NODEJS_12_X,
            code: aws_lambda_1.Code.fromAsset("functions"),
            handler: "naruto-api-lambda-handler.handler",
            environment: {
                TABLE_NAME: narutoTable.tableName,
            },
        });
        //permission for lambda to access the table
        narutoTable.grantReadWriteData(narutoApiLambdaFunction);
        const putNarutoLambda = new aws_lambda_1.Function(this, 'put-naruto-api-lambda-handler', {
            runtime: aws_lambda_1.Runtime.NODEJS_12_X,
            code: aws_lambda_1.Code.fromAsset("functions"),
            handler: "put-naruto-api-lambda-handler.handler",
            environment: {
                TABLE_NAME: narutoTable.tableName,
            },
        });
        //permission for lambda to access the table
        narutoTable.grantReadWriteData(putNarutoLambda);
        //Create the API Gateway method and path
        const api = new aws_apigateway_1.RestApi(this, 'naruto-api');
        api.root
            .resourceForPath("naruto")
            .addMethod('GET', new aws_apigateway_1.LambdaIntegration(narutoApiLambdaFunction));
        api.root
            .resourceForPath("naruto") //endpoint
            .addMethod('POST', new aws_apigateway_1.LambdaIntegration(putNarutoLambda));
        new aws_cdk_lib_1.CfnOutput(this, "API URL", {
            value: (_a = api.url) !== null && _a !== void 0 ? _a : "Something went wrong"
        });
    }
}
exports.RestApiCdkStack = RestApiCdkStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdF9hcGlfY2RrLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVzdF9hcGlfY2RrLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUEyRDtBQUMzRCwyREFBZ0U7QUFFaEUsdURBQWlFO0FBQ2pFLCtEQUF3RTtBQUd4RSxNQUFhLGVBQWdCLFNBQVEsbUJBQUs7SUFDeEMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFrQjs7UUFDMUQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxvQkFBSyxDQUFDLElBQUksRUFBQyxrQkFBa0IsRUFBQztZQUNwRCxZQUFZLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSw0QkFBYSxDQUFDLE1BQU0sRUFBRTtTQUN6RCxDQUFDLENBQUM7UUFFSCxNQUFNLHVCQUF1QixHQUFHLElBQUkscUJBQVEsQ0FBQyxJQUFJLEVBQUMsMkJBQTJCLEVBQUM7WUFDNUUsT0FBTyxFQUFFLG9CQUFPLENBQUMsV0FBVztZQUM1QixJQUFJLEVBQUUsaUJBQUksQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDO1lBQ2pDLE9BQU8sRUFBRSxtQ0FBbUM7WUFDNUMsV0FBVyxFQUFFO2dCQUNYLFVBQVUsRUFBRSxXQUFXLENBQUMsU0FBUzthQUNsQztTQUNGLENBQUMsQ0FBQztRQUNILDJDQUEyQztRQUMzQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsdUJBQXVCLENBQUMsQ0FBQztRQUd4RCxNQUFNLGVBQWUsR0FBRyxJQUFJLHFCQUFRLENBQUMsSUFBSSxFQUFDLCtCQUErQixFQUFDO1lBQ3hFLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsSUFBSSxFQUFFLGlCQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQztZQUNqQyxPQUFPLEVBQUUsdUNBQXVDO1lBQ2hELFdBQVcsRUFBRTtnQkFDWCxVQUFVLEVBQUUsV0FBVyxDQUFDLFNBQVM7YUFDcEM7U0FDRixDQUFDLENBQUM7UUFDSCwyQ0FBMkM7UUFDM0MsV0FBVyxDQUFDLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRzlDLHdDQUF3QztRQUN4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLHdCQUFPLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQzVDLEdBQUcsQ0FBQyxJQUFJO2FBQ0wsZUFBZSxDQUFDLFFBQVEsQ0FBQzthQUN6QixTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksa0NBQWlCLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDO1FBRXBFLEdBQUcsQ0FBQyxJQUFJO2FBQ0wsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBLFVBQVU7YUFDbkMsU0FBUyxDQUFDLE1BQU0sRUFBRSxJQUFJLGtDQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7UUFHM0QsSUFBSSx1QkFBUyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDN0IsS0FBSyxRQUFFLEdBQUcsQ0FBQyxHQUFHLG1DQUFJLHNCQUFzQjtTQUN6QyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0Y7QUEvQ0QsMENBK0NDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2ZuT3V0cHV0LCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IEF0dHJpYnV0ZVR5cGUsIFRhYmxlIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHsgRnVuY3Rpb24sIFJ1bnRpbWUsIENvZGUgfSBmcm9tICdhd3MtY2RrLWxpYi9hd3MtbGFtYmRhJztcbmltcG9ydCB7IFJlc3RBcGksIExhbWJkYUludGVncmF0aW9uIH0gZnJvbSAnYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXknO1xuXG5cbmV4cG9ydCBjbGFzcyBSZXN0QXBpQ2RrU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgbmFydXRvVGFibGUgPSBuZXcgVGFibGUodGhpcywnbmFydXRvLWFwaS10YWJsZScse1xuICAgICAgcGFydGl0aW9uS2V5OiB7IG5hbWU6IFwiaWRcIiwgdHlwZTogQXR0cmlidXRlVHlwZS5TVFJJTkcgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IG5hcnV0b0FwaUxhbWJkYUZ1bmN0aW9uID0gbmV3IEZ1bmN0aW9uKHRoaXMsJ25hcnV0by1hcGktbGFtYmRhLWhhbmRsZXInLHtcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChcImZ1bmN0aW9uc1wiKSxcbiAgICAgIGhhbmRsZXI6IFwibmFydXRvLWFwaS1sYW1iZGEtaGFuZGxlci5oYW5kbGVyXCIsXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBUQUJMRV9OQU1FOiBuYXJ1dG9UYWJsZS50YWJsZU5hbWUsXG4gICAgICB9LFxuICAgIH0pO1xuICAgIC8vcGVybWlzc2lvbiBmb3IgbGFtYmRhIHRvIGFjY2VzcyB0aGUgdGFibGVcbiAgICBuYXJ1dG9UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEobmFydXRvQXBpTGFtYmRhRnVuY3Rpb24pO1xuXG5cbiAgICBjb25zdCBwdXROYXJ1dG9MYW1iZGEgPSBuZXcgRnVuY3Rpb24odGhpcywncHV0LW5hcnV0by1hcGktbGFtYmRhLWhhbmRsZXInLHtcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzEyX1gsXG4gICAgICBjb2RlOiBDb2RlLmZyb21Bc3NldChcImZ1bmN0aW9uc1wiKSxcbiAgICAgIGhhbmRsZXI6IFwicHV0LW5hcnV0by1hcGktbGFtYmRhLWhhbmRsZXIuaGFuZGxlclwiLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgVEFCTEVfTkFNRTogbmFydXRvVGFibGUudGFibGVOYW1lLFxuICAgIH0sXG4gIH0pO1xuICAvL3Blcm1pc3Npb24gZm9yIGxhbWJkYSB0byBhY2Nlc3MgdGhlIHRhYmxlXG4gIG5hcnV0b1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShwdXROYXJ1dG9MYW1iZGEpO1xuXG4gICAgXG4gICAgLy9DcmVhdGUgdGhlIEFQSSBHYXRld2F5IG1ldGhvZCBhbmQgcGF0aFxuICAgIGNvbnN0IGFwaSA9IG5ldyBSZXN0QXBpKHRoaXMsICduYXJ1dG8tYXBpJyk7XG4gICAgYXBpLnJvb3RcbiAgICAgIC5yZXNvdXJjZUZvclBhdGgoXCJuYXJ1dG9cIilcbiAgICAgIC5hZGRNZXRob2QoJ0dFVCcsIG5ldyBMYW1iZGFJbnRlZ3JhdGlvbihuYXJ1dG9BcGlMYW1iZGFGdW5jdGlvbikpO1xuXG4gICAgYXBpLnJvb3RcbiAgICAgIC5yZXNvdXJjZUZvclBhdGgoXCJuYXJ1dG9cIikvL2VuZHBvaW50XG4gICAgICAuYWRkTWV0aG9kKCdQT1NUJywgbmV3IExhbWJkYUludGVncmF0aW9uKHB1dE5hcnV0b0xhbWJkYSkpO1xuXG5cbiAgICAgIG5ldyBDZm5PdXRwdXQodGhpcywgXCJBUEkgVVJMXCIsIHtcbiAgICAgICAgdmFsdWU6IGFwaS51cmwgPz8gXCJTb21ldGhpbmcgd2VudCB3cm9uZ1wiXG4gICAgICB9KTtcbiAgfVxufVxuIl19