export interface User {
  id: string;
  email: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Realm {
  id: string;
  name: string;
}

export interface RealmCostKPI {
  [key: string]: any;
}

export interface RealmActivityKPI {
  [key: string]: any;
}
