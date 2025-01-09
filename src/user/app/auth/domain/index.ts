export interface GenerateTokenInput {
  email: string;
  password: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignInSuccessfulResponse {
  token: string;
}

export interface SignInFailedResponse {
  error: string;
}
