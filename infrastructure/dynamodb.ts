import { RemovalPolicy } from "aws-cdk-lib";
import { Attribute, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

interface TableOptions {
  tableName: string;
  partitionKey: Attribute;
  sortKey?: Attribute;
}

export class DynamoDB {
  constructor(private parent: Construct, private stackName: string) {}

  public createTable(options: TableOptions) {
    const { tableName, partitionKey, sortKey } = options;

    const table = new Table(this.parent, `${this.stackName}-Table-${tableName}`, {
      tableName,
      partitionKey,
      sortKey,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    return table;
  }
}