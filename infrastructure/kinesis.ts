import { Policy, PolicyStatement, Role, ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { Stream } from "aws-cdk-lib/aws-kinesis";
import { CfnApplication } from "aws-cdk-lib/aws-kinesisanalytics";
import { Construct } from "constructs";

interface StreamOptions {
  streamName: string;
  shardCount: number;
}

interface StreamingApplicationOptions {
  applicationName: string;
  kinesisStream: Stream;
}

export class Kinesis {
  constructor(private parent: Construct, private stackName: string) {}

  public createStream(options: StreamOptions) {
    const { streamName, shardCount } = options;

    const stream = new Stream(this.parent, `${this.stackName}-Stream-${streamName}`, {
      streamName,
      shardCount,
    });

    return stream;
  }


  public createStreamingApplication(options: StreamingApplicationOptions) {
    const { applicationName, kinesisStream } = options;

    const role = new Role(this.parent, `${this.stackName}-KinesisAnalyticsRole-${applicationName}`, {
      assumedBy: new ServicePrincipal("kinesisanalytics.amazonaws.com"),
    });

    role.attachInlinePolicy(
      new Policy(this.parent, `${this.stackName}-DataStreamsAccess`, {
        statements: [
          new PolicyStatement({
            actions: ["kinesis:Get*", "kinesis:List*", "kinesis:Describe*", "kinesis:SubscribeToShard"],
            resources: ["*"],
          }),
        ],
      })
    );

    const application = new CfnApplication(this.parent, `${applicationName}`, {
      inputs: [{
        kinesisStreamsInput: {
          resourceArn: kinesisStream.streamArn,
          roleArn: role.roleArn,
        },
        inputSchema: {
          recordColumns: [{
            name: "Distance",
            sqlType: "DOUBLE",
            mapping: "$.Distance",
          }, {
            name: "HealthPoints",
            sqlType: "INTEGER",
            mapping: "$.HealthPoints",
          }, {
            name: "Latitude",
            sqlType: "DOUBLE",
            mapping: "$.Latitude",
          }, {
            name: "Longitude",
            sqlType: "DOUBLE",
            mapping: "$.Longitude",
          }, {
            name: "MagicPoints",
            sqlType: "INTEGER",
            mapping: "$.MagicPoints",
          }, {
            name: "Name",
            sqlType: "VARCHAR(16)",
            mapping: "$.Name",
          }, {
            name: "StatusTime",
            sqlType: "TIMESTAMP",
            mapping: "$.StatusTime",
          }],
          recordFormat: {
            recordFormatType: "JSON",
            mappingParameters: {
              jsonMappingParameters: {
                recordRowPath: "$",
              }
            }
          },
          recordEncoding: "UTF-8",
        },
        namePrefix: applicationName,
      }]
    });

    return application;
  }
}
