import { HostedZone, IHostedZone, IRecordSet, RecordSet, RecordTarget, RecordType } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

interface RecordOptions {
  recordName: string;
  recordType: RecordType;
  zone: IHostedZone;
  target: RecordTarget;
}

export class Route53 {
  constructor(private parent: Construct, private stackName: string) {}

  public getHostedZone(domainName: string): IHostedZone {
    return HostedZone.fromLookup(this.parent, `${this.stackName}-HostedZone-${domainName}`, {
      domainName: domainName,
    });
  }

  public createRecord(options: RecordOptions): IRecordSet {
    const { recordName, recordType, zone, target } = options;

    const recordSet = new RecordSet(this.parent, `${this.stackName}-RecordSet-${recordName}`, {
      recordName: recordName,
      recordType: recordType,
      zone: zone,
      target: target,
    });

    return recordSet;
  }
}
