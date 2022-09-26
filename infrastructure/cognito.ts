import { Construct } from "constructs";
import { IdentityPool } from "@aws-cdk/aws-cognito-identitypool-alpha";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Stream } from "aws-cdk-lib/aws-kinesis";

interface IdentityPoolOptions {
  identityPoolName: string;
  allowUnauthenticatedIdentities: boolean;
  kinesisStream?: Stream;
}

export class Cognito {
  constructor(private parent: Construct, private stackName: string) {}

  public createIdentityPool(options: IdentityPoolOptions) {
    const { identityPoolName, allowUnauthenticatedIdentities } = options;

    const identityPool = new IdentityPool(this.parent, `${this.stackName}-IdentityPool`, {
      identityPoolName,
      allowUnauthenticatedIdentities,
    });

    const unAuthRole = identityPool.unauthenticatedRole;

    unAuthRole.attachInlinePolicy(
      new Policy(this.parent, `${this.stackName}-UnAuthPolicy`, {
        statements: [
          new PolicyStatement({
            actions: ["kinesis:Get*", "kinesis:List*", "kinesis:Describe*", "kinesis:SubscribeToShard"],
            resources: ["*"],
          }),
        ],
      })
    );

    return identityPool;
  }
}
