import { currency } from '@common/constants'

export type InvestmentStatType = {
  title: string
  amount: string
  icon: string
  change: number
  variant: string
}

export const investmentStatData: InvestmentStatType[] = [
  {
    title: 'Total Invested',
    amount: currency + '45,280.50',
    icon: 'solar:wallet-money-broken',
    change: 15.2,
    variant: 'success',
  },
  {
    title: 'Active Investments',
    amount: '12 Properties',
    icon: 'solar:home-broken',
    change: 8.3,
    variant: 'success',
  },
  {
    title: 'Total Returns',
    amount: currency + '3,450.75',
    icon: 'solar:dollar-broken',
    change: 22.1,
    variant: 'success',
  },
  {
    title: 'Pending Investments',
    amount: '3 Properties',
    icon: 'solar:key-minimalistic-square-broken',
    change: -5.2,
    variant: 'danger',
  },
]
