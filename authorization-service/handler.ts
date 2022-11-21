import * as handlers from '@/functions';
import { AuthorizationService } from '@/services/authorizationService';
import { parseAllowedCredentials } from '@/utils';

const { ALLOWED_CREDENTIALS } = process.env;

const allowedCredentials = parseAllowedCredentials(ALLOWED_CREDENTIALS);
const authorizationService = new AuthorizationService(allowedCredentials);

export const basicAuthorizer = handlers.basicAuthorizer(authorizationService);
