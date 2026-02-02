export interface Investment {
investor: any
  id: string
  propertyId: string
  amount: number
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export interface CreateInvestmentDTO {
  propertyId: string
  amount: number
}

export interface PropertyInfo {
  id: string
  name: string
  location: string
  type: string
}

export interface Investment {
  id: string
  propertyId: string
  property?: PropertyInfo
  amountInvested: number
  sharesPurchased: number
  investmentDate: string
  status: 'active' | 'pending' | 'exited' | 'closed' | string
  returns: number
  userId?: string
  createdAt?: string
  updatedAt?: string
}
