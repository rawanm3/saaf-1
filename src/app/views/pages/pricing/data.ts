export type PricingType = {
  id: string
  name: string
  price: number
  features: string[]
  isPopular?: boolean
  subscribed?: boolean
}

export const pricingData: PricingType[] = [
  {
    id: '1',
    name: 'Free Pack',
    price: 0,
    features: [
      '5 GB Storage',
      '100 GB Bandwidth',
      '1 Domain',
      'No Support',
      '24x7 Support',
      '1 User',
    ],
  },
  {
    id: '2',
    name: 'Professional Pack',
    price: 19,
    features: [
      '50 GB Storage',
      '900 GB Bandwidth',
      '2 Domains',
      'Email Support',
      '24x7 Support',
      '5 Users',
    ],
    isPopular: true,
    subscribed: true,
  },
  {
    id: '3',
    name: 'Business Pack',
    price: 29,
    features: [
      '500 GB Storage',
      '2.5 TB Bandwidth',
      '5 Domains',
      'Email Support',
      '24x7 Support',
      '10 Users',
    ],
  },
  {
    id: '4',
    name: 'EnterPrise Pack',
    price: 49,
    features: [
      '2 TB Storage',
      'Unlimited Bandwidth',
      '50 Domains',
      'Email Support',
      '24x7 Support',
      'Unlimited Users',
    ],
  },
]
