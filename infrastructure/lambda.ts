import { Construct } from "constructs";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { ManagedPolicy, Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { ITable } from "aws-cdk-lib/aws-dynamodb";

interface FunctionOptions {
  functionName: string;
  handler: string;
  runtime: Runtime;
  code: Code;
  environment?: { [key: string]: string };
  dynamoDbTable: ITable;
}

export class Lambda {
  constructor(private parent: Construct, private stackName: string) {}

  public createFunction(options: FunctionOptions) {
    const { functionName, code, handler, runtime, environment, dynamoDbTable } = options;

    const role = new Role(this.parent, `${this.stackName}-LambdaRole-${functionName}`, {
      assumedBy: new ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
        ManagedPolicy.fromAwsManagedPolicyName("service-role/LambdaKinesisExecutionRole"),
      ],
    });

    role.attachInlinePolicy(
      new Policy(this.parent, "WildRydesDynamoDBWritePolicy", {
        statements: [
          new PolicyStatement({
            actions: ["dynamodb:BatchWriteItem"],
            resources: [dynamoDbTable.tableArn],
          }),
        ],
      })
    );

    const lambdaFunction = new Function(this.parent, `${this.stackName}-Function-${functionName}`, {
      functionName,
      code,
      handler,
      runtime,
      environment,
    });

    return lambdaFunction;
  }
}