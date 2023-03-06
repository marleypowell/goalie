export interface TokenResponse {
  id_token: string;
  token_type: string;
  access_token: string;
  refresh_token: string;
  scope: string;
  expires_in: number;
}
