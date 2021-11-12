import { Inject, Injectable, Optional } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';

interface PartialResponse {
  status(code: number): this;
}

@Injectable({
  providedIn: 'root',
})
export class HttpContextService {
  constructor(
    @Optional() @Inject(RESPONSE) private response: PartialResponse,
  ) {}

  setStatusCode(code: number) {
    if (this.response) {
      this.response.status(code);
    }
  }
}
