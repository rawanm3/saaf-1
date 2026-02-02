export type UserType = {
  name: string;
  image: string;
};

export type TransactionType = {
  id: string;
  user: UserType;
  purchaseDate: string;
  amount: number;
  type: string;
  status: string;
  agentName: string;
  investedProperty: string;
  walletId: string;
  userId: string; 
};