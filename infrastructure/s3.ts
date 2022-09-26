import { RemovalPolicy } from "aws-cdk-lib";
import { Bucket, IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface BucketOptions {
  bucketName: string;
}

export class S3 {
  constructor(private parent: Construct, private stackName: string) {}

  public createBucket(options: BucketOptions): IBucket {
    const { bucketName } = options;

    const bucket = new Bucket(this.parent, `${this.stackName}-Bucket-${bucketName}`, {
      bucketName: bucketName,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    return bucket;
  }
}