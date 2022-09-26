import { ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { Distribution, IDistribution, ViewerProtocolPolicy } from "aws-cdk-lib/aws-cloudfront";
import { S3Origin } from "aws-cdk-lib/aws-cloudfront-origins";
import { IBucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

interface DistributionS3Options {
  domainNames: string[];
  bucket: IBucket;
  certificate: ICertificate;
  description: string;
}

export class CloudFront {
  constructor(private parent: Construct, private stackName: string) {}

  public createDistributionS3(options: DistributionS3Options): IDistribution {
    const { domainNames, bucket, certificate, description } = options;

    const distribution = new Distribution(this.parent, `${this.stackName}-S3Distribution-${description}`, {
      domainNames: domainNames,
      defaultBehavior: {
        origin: new S3Origin(bucket),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      certificate: certificate,
      defaultRootObject: "index.html",
      errorResponses: [{
        httpStatus: 404,
        responseHttpStatus: 200,
        responsePagePath: "/index.html"
      },{
        httpStatus: 403,
        responseHttpStatus: 200,
        responsePagePath: "/index.html"
      },]
    });
    
    return distribution;
  }
}
