import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@svv/cms/environments/environment';
import { AuthResponse, AuthTokens, Credentials, User } from '@svv/core/models';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  /**
   * Constructs a `POST` request that tries to login the `User` with the given
   * credentials.
   *
   * @param credentials The credentials that are used to login the `User`.
   *
   * @returns The `User` and the authentication tokens.
   */
  login(credentials: Credentials) {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}/auth/login`, {
      email: credentials.email,
      password: credentials.password,
    });
  }

  /**
   * Constructs a `POST` request that tries to logout the currently logged in
   * `User` by using the given `User` id.
   *
   * @param user The `User` that should be logged out.
   */
  logout(user: User) {
    return this.httpClient.post(`${this.apiUrl}/auth/logout`, {
      _id: user._id,
    });
  }

  /**
   * Constructs a `POST` request that tries to verify the given refresh token.
   *
   * @returns The `User` which is assoicated with the given refresh token.
   */
  verify(refreshToken: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${refreshToken}`,
      }),
    };

    return this.httpClient.post<User>(
      `${this.apiUrl}/auth/verify`,
      { refreshToken },
      httpOptions,
    );
  }

  /**
   * Constructs a `POST` request that tries to refresh the currently used access
   * token with the given refresh token.
   *
   * @returns The generated access token.
   */
  refreshAccessToken(refreshToken: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${refreshToken}`,
      }),
    };

    return this.httpClient.post<{ accessToken: string }>(
      `${this.apiUrl}/auth/refresh`,
      { refreshToken },
      httpOptions,
    );
  }

  /**
   * Adds the authentication tokens to the localstorage.
   *
   * @param tokens The authentication tokens.
   */
  setTokens(tokens: AuthTokens) {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  /**
   * Removes the authentication tokens from the localstorage.
   */
  removeTokens() {
    this.removeAccessToken();
    this.removeRefreshToken();
  }

  /**
   * Removes the access token from the local storage.
   */
  removeAccessToken() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Removes the refresh token from the local storage.
   */
  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Tries to read the access token from the localstorage.
   * @returns The access token.
   */
  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  /**
   * Tries to read the refresh token from the localstorage.
   * @returns The refresh token.
   */
  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }
}
