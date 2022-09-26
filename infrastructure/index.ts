import { App, Stack, StackProps } from "aws-cdk-lib";
import { ConfigService } from "@maxhayward/cdk_common/config/config.service";
import { Kinesis } from "./kinesis";
import { Cognito } from "./cognito";
import { DynamoDB } from "./dynamodb";
import { Lambda } from "./lambda";
import { Route53 } from "./route53";
import { S3 } from "./s3";
import { CloudFront } from "./cloudfront";
import { CertificateManager } from "./certificatemanager";
import { DASHBOARD_CERTIFICATE_ARN, DASHBOARD_HOSTED_ZONE, DASHBOARD_URL } from "./constants/dashboard.constants";
import { RecordTarget, RecordType } from "aws-cdk-lib/aws-route53";
import { CloudFrontTarget } from "aws-cdk-lib/aws-route53-targets";


export class InfrastructureBase extends Stack {
  constructor(app: App, stackName: string, stackProps: StackProps) {
    super(app, stackName, stackProps);
  }

  protected streamName = "wildrydes";

  // Instantiate my constructs
  protected kinesis = new Kinesis(this, this.stackName);
  protected cognito = new Cognito(this, this.stackName);
  protected dynamoDb = new DynamoDB(this, this.stackName);
  protected lambda = new Lambda(this, this.stackName);
  protected route53 = new Route53(this, this.stackName);
  protected s3 = new S3(this, this.stackName);
  protected cloudFront = new CloudFront(this, this.stackName);
  protected acm = new CertificateManager(this, this.stackName);

  // Get the HostedZone
  protected hostedZone = this.route53.getHostedZone(DASHBOARD_HOSTED_ZONE);

  // Get the Cross Region Certificates from ARN
  protected dashboardCertificate = this.acm.getCertificateFromArn({
    arn: DASHBOARD_CERTIFICATE_ARN,
    description: DASHBOARD_URL,
  });

  // Create Kinesis Stream
  protected mainStream = this.kinesis.createStream({
    streamName: this.streamName,
    shardCount: 1,
  });

  // Create Cognito Identity Pool
  protected cognitoIdentityPool = this.cognito.createIdentityPool({
    identityPoolName: this.streamName,
    allowUnauthenticatedIdentities: true,
    kinesisStream: this.mainStream,
  });

  // // Create the Summary Stream
  // protected summaryStream = this.kinesis.createStream({
  //   streamName: `${this.streamName}-summary`,
  //   shardCount: 1,
  // });

  // // Create the Analytics Application
  // protected analyticsApplication = this.kinesis.createStreamingApplication({
  //   applicationName: this.streamName,
  //   kinesisStream: this.mainStream,
  // });

  // // Create the SensorData DynamoDB Tables
  // protected dynamoDbTable = this.dynamoDb.createTable({
  //   tableName: "UnicornSensorData",
  //   partitionKey: {
  //     name: "Name",
  //     type: AttributeType.STRING,
  //   },
  //   sortKey: {
  //     name: "StatusTime",
  //     type: AttributeType.STRING,
  //   }
  // });

  // Create the Dashboard S3 Bucket
  protected dashboardBucket = this.s3.createBucket({
    bucketName: DASHBOARD_URL,
  });

  // Create the Dashboard CloudFront Distribution
  protected dashboardDistribution = this.cloudFront.createDistributionS3({
    domainNames: [
      DASHBOARD_URL,
    ],
    bucket: this.dashboardBucket,
    certificate: this.dashboardCertificate,
    description: "Dashboard",
  });

  // Create the Website DNS
  protected websiteRecord = this.route53.createRecord({
    recordName: `${DASHBOARD_URL}`,
    recordType: RecordType.A,
    zone: this.hostedZone,
    target: RecordTarget.fromAlias(new CloudFrontTarget(this.dashboardDistribution)),
  });

  // // Create the StreamProcessor Function
  // protected streamProcessorFunction = this.lambda.createFunction({
  //   functionName: "StreamProcessor",
  //   handler: "index.handler",
  // });
}

// Setup the application
const config = new ConfigService().stackConfig;
const app = new App();
const stackName = config.stackPrefix;

const stackProps: StackProps = {
  env: {
    region: "eu-west-1",
    account: config.accountId,
  },
};

new InfrastructureBase(app, stackName, stackProps);

app.synth();
