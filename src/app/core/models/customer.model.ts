export type CustomerStatType = {
  title: string;  
  amount: number;  
  change: number; 
  variant: 'primary' | 'warning' | 'info' | 'success' | 'danger';
  icon: string;    
};

export interface CustomerPayload {
  name: string
  nameEN: string
  nationalId: string
  country: string
  email: string
  phone: string
  password?: string
  nafathSub?: string
  iban: string
  nationalIdImageUrl: string
  ibanImageUrl: string
  profileImage?: string
  status: string
  role: string
  customerStatus?: string 
  profileImageUrl?: string;
  

}

export type CustomerType = {
  id: string
  name: string | { ar?: string; en?: string }
  image: string
  email: string
  phone: string
  date: string
   iban?: string
   country: string
   role?: string
  walletId?: string
  wallet?: Wallet
  status: string
  customerStatus: string
  type: string
  address: string
  propertyView: number
  propertyOwn: number
  invest: string
  _id?: string
  fullName?: string
  username?: string
  avatar?: string
  mobile?: string
  customerType?: string
  statusText?: string
  createdAt?: string
  updatedAt?: string
  investment?: string
  profileImage?: string;
  profileImageUrl?: string;
  displayName?: string;

}
export interface CustomersResponse {
  customers?: CustomerType[]
  users?: CustomerType[]
  data?: CustomerType[]
  result?: CustomerType[]
}

export interface SingleCustomerResponse {
  customer?: CustomerType
  user?: CustomerType
  data?: CustomerType
}
export interface CustomerStatsResponse {
  users?: number | string;
  pendingUsers?: number | string;
}

export interface UsersResponse {
  users?: Customer[]
}

export interface UserResponse {
  user: Customer
}
export interface CustomerName {
  en?: string
  ar?: string
}

export interface Customer {
  _id: string
  id?: string
  fullName?: string
  username?: string
  email?: string
  mobile?: string
  avatar?: string
  customerType?: string
  status?: string
  statusText?: string
  createdAt?: string
  updatedAt?: string
  investment?: string
  role?: string
  name?: string
  nameEN?: string
  country?: string
  ibanImageUrl?: string
  iban?: string
  walletId?: string
  wallet?: Wallet
  phone?: string
  date?: string
  customerStatus?: string
}

export interface WalletResponse {
  wallet?: Wallet
}
export interface Transaction {
  _id: string
  type: string
  amount: number
  status: string
  createdAt: string
  updatedAt?: string
}

export interface Wallet {
  _id: string
  id?: string
  userId: string
  balance: number
  currency: string
  createdAt?: string
  updatedAt?: string
}

export interface Investment {
  _id: string
  investorId: string
  amount: number
  propertyId: string
  status: string
  createdAt: string
}


export interface TransactionsResponse {
  transactions?: Transaction[]
  data?: Transaction[]
}

export interface CustomerFiles {
  nationalIdImageUrl?: File
  ibanImageUrl?: File
  profileImage?: File
}

export interface CustomerData {
  name: string
  nameEN?: string
  email: string
  phone?: string
  country?: string
  address?: string
  nationalId?: string
  ibanNumber?: string
  type?: string
  status?: string
  [key: string]: string | number | boolean | undefined
}

export interface InvestmentsResponse {
  data?: Investment[]
}

export interface PropertyStatsResponse {
  totalProperties: number
  availableProperties: number
  soldProperties: number
}
export interface Wallet {
  _id: string
  id?: string
  userId: string
  balance: number
  currency: string
  createdAt?: string
  updatedAt?: string
}