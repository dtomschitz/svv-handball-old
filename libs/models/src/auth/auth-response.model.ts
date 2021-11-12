import { AuthTokens } from './auth-tokens.model';
import { User } from './user.model';

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
