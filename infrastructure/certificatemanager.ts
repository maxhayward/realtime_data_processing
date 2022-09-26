import { Certificate, ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { Construct } from "constructs";

interface GetCertificateOptions {
  arn: string;
  description: string;
}

export class CertificateManager {
  constructor(private parent: Construct, private stackName: string) {}

  public getCertificateFromArn(options: GetCertificateOptions): ICertificate {
    const { arn, description } = options;

    return Certificate.fromCertificateArn(this.parent, `${this.stackName}-Cert-${description}`, arn);
  }
}
