import AuthorizationServiceInterface from './authorizationServiceInterface';

class AuthorizationService implements AuthorizationServiceInterface {
  constructor(private readonly allowedCredentials: Record<string, string>) {}

  validateToken(token: string): boolean {
    const [username, password] = this.decodeCredentials(token);

    return this.allowedCredentials[username] === password;
  }

  private decodeCredentials(token: string) {
    const [, tokenData] = token.split(' ');

    const credentialsData = Buffer.from(tokenData, 'base64').toString('utf8');

    return credentialsData.split(':');
  }
}

export default AuthorizationService;
