export interface InvestmentSummaryDto {
  totalInvestments: number;
  activeInvestments: number;
  pendingInvestments: number;
  exitedInvestments: number;
  totalInvestedAmount: number;
}

export interface InvestmentAnalyticsDto {
  income: number;
  expense: number;
  balance: number;
  chartData: {
    label: string;
    income: number;
    expense: number;
  }[];
}

export interface PendingInvestmentsDto {
  totalPending: number;
  data: {
    _id: string;
    investorName: string;
    investorEmail: string;
    propertyName: string;
    amountInvested: number;
    sharesPurchased: number;
    propertyLocation: string;
    sharePrice: number;
    remainingShares: number;
    investmentDate: string;
    status: string;
  }[];
}

export interface TransactionsDashboardDto {
  totalTransactions: number;
  failedTransactions: number;
  pendingTransactions: number;
  totalByType: {
    _id: string; 
    totalAmount: number;
    count: number;
  }[];
  recentTransactions: {
    _id: string;
    walletId: string;
    type: string;
    amount: number;
    status: string;
    createdAt: string;
    user: { name: string; email: string } | null;
  }[];
}

export interface TransactionsUserDto {
  user: { name: string; email: string } | null;
  totalTransactions: number;
  byStatus: {
    pending: number;
    completed: number;
    failed: number;
  };
  byType: Record<string, number>;
  transactions: {
    _id: string;
    type: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    user: { name: string; email: string } | null;
  }[];
}

export interface CustomersCountDto {
  count: number;
}


export interface PropertyProgressDto {
  properties: {
    title: string;
    amount: number;
    progress: string; 
    variant: "success" | "warning" | "danger";
    icon: string;
  }[];
}

export interface PropertiesCountDto {
  count: number;
}


export interface WalletSummaryDto {
  balance: number;
  income: number;
  expense: number;
  wallets: {
    walletId: string;
    user: string;
    income: number;
    expense: number;
    balance: number;
    currencies: {
      currency: string;
      amount: number;
    }[];
  }[];
}

export interface WalletsDashboardDto {
  totalWallets: number;
  totalBalances: Record<string, number>;
  wallets: {
    walletId: string;
    user: { name: string; email: string } | null;
    balances: { currency: string; amount: number }[];
    totalBalance: number;
    recentTransactions: {
      _id: string;
      type: string;
      amount: number;
      currency: string;
      status: string;
      createdAt: string;
      user: { name: string; email: string } | null;
    }[];
    createdAt: string;
    updatedAt: string;
  }[];
}

export interface InvestmentSummary {
  total: number
  active: number
  pending: number
  completed: number
  totalInvestments: number
  activeInvestments: number
  pendingInvestments: number
  totalInvestedAmount: number
}

export interface PendingInvestment {
  _id: string
  investorName: string
  investorEmail: string
  propertyName: string
  amountInvested: number
  sharesPurchased: number
  investmentDate: string
  status: 'Pending' | 'Approved' | 'Rejected'
}

export interface PropertyCycleSummary {
  cycleId: string
  name: string
  progress: number
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  type: 'credit' | 'debit'
  date: string
}

export interface Wallet {
  id: string
  userId: string
  balance: number
  currency: string
}

export interface WalletSummary {
  totalWallets: number
  totalBalance: number
}

export interface PropertyProgress {
  propertyId: string
  name: string
  progress: number
}

export interface InvestmentChartItem {
  label: string
  income: number
  expense: number
}

export interface InvestmentAnalytics {
  period: string
  total: number
  growthRate: number
  chartData: InvestmentChartItem[]
  income: number
  expense: number
  balance: number
}

export interface CountResponse {
  count: number
}
