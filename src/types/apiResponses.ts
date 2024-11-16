// file for response data structs
// we will need to add all response types here.

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface LoginResponse {
  status: string;  // success/failed
  message: string; // message
}

export interface RegisterResponse {
  status: string;
  message: string;
  token: string;
}