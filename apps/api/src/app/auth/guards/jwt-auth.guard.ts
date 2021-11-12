import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This class extends the `AuthGuard` functionallity for the `jwt` strategy and
 * can be used for every route in the API. If an route uses this class as an
 * guard the `User` needs to provide a valid and not expired access token in
 * order to access it without any occuring errors.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
