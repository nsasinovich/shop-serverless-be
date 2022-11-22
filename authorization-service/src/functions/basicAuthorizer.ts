import { AuthorizationServiceInterface } from '@/services/authorizationService';
import { PolicyGenerator } from '@/utils/policyGenerator';
import { APIGatewayTokenAuthorizerEvent, APIGatewayTokenAuthorizerHandler } from 'aws-lambda';

export const basicAuthorizer =
  (authorizationService: AuthorizationServiceInterface): APIGatewayTokenAuthorizerHandler =>
  (event: APIGatewayTokenAuthorizerEvent) => {
    const { authorizationToken, methodArn } = event;

    if (!authorizationToken) {
      throw new Error('Unauthorized');
    }

    try {
      const isTokenValid = authorizationService.validateToken(authorizationToken);

      console.log('Is token valid: ', isTokenValid);

      const policy = isTokenValid
        ? PolicyGenerator.generateAllowPolicy(authorizationToken, methodArn)
        : PolicyGenerator.generateDenyPolicy(authorizationToken, methodArn);

      return Promise.resolve(policy);
    } catch (e) {
      throw new Error('Unauthorized', { cause: e });
    }
  };
