/**
 * oauth-agent-service
 * oauth-agent-service
 *
 * The version of the OpenAPI document: 1.0
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { LogoutResponse } from '../model/models';

import { Configuration } from '../configuration';

export interface LogoutServiceInterface {
  defaultHeaders: HttpHeaders;
  configuration: Configuration;

  /**
   * Logout.
   *
   */
  logout(extraHttpRequestParams?: any): Observable<LogoutResponse>;
}
