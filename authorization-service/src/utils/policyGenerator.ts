import { APIGatewayAuthorizerResult } from 'aws-lambda';

export enum Effect {
  ALLOW = 'Allow',
  DENY = 'Deny',
}

export class PolicyGenerator {
  private static generatePolicy = (
    principalId: string,
    resource: string,
    effect: Effect
  ): APIGatewayAuthorizerResult => ({
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{ Action: 'execute-api:Invoke', Effect: effect, Resource: resource }],
    },
  });

  static generateAllowPolicy(principalId: string, resource: string) {
    return this.generatePolicy(principalId, resource, Effect.ALLOW);
  }

  static generateDenyPolicy(principalId: string, resource: string) {
    return this.generatePolicy(principalId, resource, Effect.DENY);
  }
}
