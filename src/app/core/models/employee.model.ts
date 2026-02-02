export interface Employee {
  _id?: string;
  name: string;
  email: string;
  role: 'employe' | 'accountant';
  password?: string;
}

export interface ApiResponse {
  message: string;
  user?: any;
  error?: string;
}
 