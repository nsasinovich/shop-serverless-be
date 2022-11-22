export default interface AuthorizationServiceInterface {
  validateToken(token: string): boolean;
}
