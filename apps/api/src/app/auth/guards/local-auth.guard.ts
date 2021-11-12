import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * This class extends the `AuthGuard` functionallity for the `local` strategy
 * and can be used for every route in the API. If an route uses this class as
 * an guard the `User` needs to provide a valid email and password in order to
 * access it without any occuring errors.
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
