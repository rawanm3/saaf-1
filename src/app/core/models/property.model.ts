export interface Property {
  _id: string
  name: string
  location: string
  country?: string
  type: string
  propertyType?: string
  totalValue: number
  minInvestment: number
  expectedNetYield: number
  expectedAnnualReturn: number
  holdingPeriodMonths: number
  description: string
  totalShares: number
  isRented: boolean
  currentRent: number
  status: 'available' | 'pending' | 'sold'
  images?: string[]
  variant?: string
  icon?: string
  numberOfRooms?: number
  numberOfBathrooms?: number
  square?: number
  features?: string[]
  investors?: { name: string; amount: number }[]
  transactions?: { type: string; status: string; amount: number }[]
  cycles?: { period: string; netProfit: number }[]
}

export interface PropertyCycle {
  [key: string]: any
  showDetails: boolean 
  _id: string
  property?: Property
  propertyId?: string
  periodStart: string
  periodEnd: string
  grossCollected: number
  expenses: number 
  managementFees: number
  reserveForCapEx: number
  taxes: number 
  netRevenue: number
  totalDistributed: number
  totalRevenue?: number
  totalExpenses?: number
  pendingDistributions?: boolean
  distributions: PropertyCycleDistribution[]
  notes?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt?: string
  updatedAt?: string

  depositAmount?: number
  valueAddedTax?: number
  administrativeFees?: number
  brokerageFees?: number
  maintenanceFees?: number
  transferFees?: number
  taxFees?: number
  realEstateTransactionTax?: number
  otherExpenses?: number
  propertyValue?: number

  monthlyReturn?: number
  annualReturn?: number
  compoundReturn?: number
  totalReturn?: number
  distributionDate?: string
  collectionDate?: string
}

export interface PropertyStats {
  totalProperties: number
  availableProperties: number
  soldProperties: number
  fundedProperties: number
  maturedProperties: number
  pendingProperties: number
}

export interface PropertyCycleDistribution {
  investor: string
  investment: string
  sharesAtRecord: number
  sharePercentageAtRecord: number
  amountDistributed: number
  transactionId?: string
}

export interface PropertyFilters {
  q?: string
  minPrice?: number
  maxPrice?: number
  type?: string
  features?: string[]
}

export interface PropertyResponse {
  property: Property
}

export interface CycleStats {
  totalCycles: number
  approvedCycles: number
  pendingCycles: number
  rejectedCycles: number
  totalDistributed: number
}

export interface UpdateDistributionDto {
  investor: string
  amountDistributed: number
  distributionStatus: 'pending' | 'approved'
}
