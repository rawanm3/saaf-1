export interface User {
  _id?: string
  name: string
  email: string
  phone?: string
  role?: string
}

export interface Balance {
  currency: string
  amount: number
}

export interface Wallet {
  id?: string
  _id?: string
  type: string
  balances: Balance[]
  userId: User
}

export interface Transaction {
  _id: string
  userId: User
  walletId: Wallet
  processedBy: User
  type: string
  amount: number
  currency: string
  balanceBefore: number
  balanceAfter: number
  status: string
  notes?: string
  createdAt: string
}

export interface SimpleProperty {
  id: string
  name: string
}


export interface InvestorData {
  investmentId: string
  investor: User
  sharesPurchased: number
  ownershipPercentage: string
  dividendsReceived: number
  investedAt: string
}
export interface MasterWalletResponse {
  masterWallet: Wallet
  transactions: Transaction[]
  total: number
}

export interface AddToMasterWalletResponse {
  message: string
  property: any
  masterWallet: Wallet
  transaction: Transaction
  revenue: number
  totalExpenses: number
  netAmountAdded: number
  currency: string
  balanceBefore: number
  balanceAfter: number
}

export interface PropertyInvestorsResponse {
  property: SimpleProperty
  totalShares: number
  investorsCount: number
  investors: InvestorData[]
}

export interface InvestorDetailsResponse {
  property: SimpleProperty
  totalShares: number
  investor: InvestorData
}

export interface TransferResponse {
  message: string
  property: SimpleProperty
  investorId: string
  amountTransferred: number
  currency: string
  masterWallet: {
    balanceBefore: number
    balanceAfter: number
  }
  investorWallet: {
    balanceBefore: number
    balanceAfter: number
  }
  totalDividendsReceived: number
}
export interface PropertyPayoutInvestor {
    investorId: string //
  investorName: string
  investorEmail: string
  sharesPurchased: number
  ownershipPercent: string
  amountInvested: string
  payoutThisCycle: string
  dividendsReceived: string
  remainingReturn: string
  lastPayoutDate: string
  nextPayoutDate: string
}

export interface PropertyPayoutResponse {
  propertyName: string
  totalShares: number
  expectedNetYield: string
  startDate: string
  endDate: string
  holdingPeriodMonths: number
  totalActiveInvestors: number
  investors: PropertyPayoutInvestor[]
}
export interface GeneratePayoutPdfResponse {
  success: boolean
  message: string
  file: string
}