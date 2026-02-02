import { currency, currentYear } from '@common/constants'

export type CustomerType = {
  photo: string
  name: string
}

export type OrderType = {
  customer: CustomerType
  purchaseDate: string
  contact: string
  propertyType: string
  amount: string
  purchaseProperties: string
  amountStatus: string
}

export const orderData: OrderType[] = [
  {
    customer: {
      photo: 'assets/images/users/avatar-2.jpg',
      name: 'Daavid Nummi',
    },
    purchaseDate: '02/01/' + currentYear,
    contact: '+231 06-75820711',
    propertyType: 'Residential',
    amount: currency + '2,890,123',
    purchaseProperties: '123 Maple St, 456 Oak Ave',
    amountStatus: 'Paid',
  },
  {
    customer: {
      photo: 'assets/images/users/avatar-3.jpg',
      name: 'Sinikka Penttinen',
    },
    purchaseDate: '10/02/' + currentYear,
    contact: '+231 47-23456789',
    propertyType: 'Commercial',
    amount: currency + '2,678,901',
    purchaseProperties: '789 Pine Blvd',
    amountStatus: 'Paid',
  },
  {
    customer: {
      photo: 'assets/images/users/avatar-4.jpg',
      name: 'Jere Palmu',
    },
    purchaseDate: '18/03/' + currentYear,
    contact: '+231 73-34567890',
    propertyType: 'Residential',
    amount: currency + '4,123,456',
    purchaseProperties: '101 Birch Ct, 202 Cedar Ln',
    amountStatus: 'Unpaid',
  },
  {
    customer: {
      photo: 'assets/images/users/avatar-5.jpg',
      name: 'Ulla Nuorela',
    },
    purchaseDate: '25/04/' + currentYear,
    contact: '+231 45-45678901',
    propertyType: 'Residential',
    amount: currency + '3,456,789',
    purchaseProperties: '303 Elm St',
    amountStatus: 'Paid',
  },
  {
    customer: {
      photo: 'assets/images/users/avatar-6.jpg',
      name: 'Tiia Karppinen',
    },
    purchaseDate: '12/04/' + currentYear,
    contact: '+231 16-56789012',
    propertyType: 'Industrial',
    amount: currency + '2,789,012',
    purchaseProperties: '404 Walnut Rd',
    amountStatus: 'Unpaid',
  },
  {
    customer: {
      photo: 'assets/images/users/avatar-7.jpg',
      name: 'Harland R. Orsini',
    },
    purchaseDate: '01/05/' + currentYear,
    contact: '+231 82-67890123',
    propertyType: 'Residential',
    amount: currency + '2,456,789',
    purchaseProperties: '505 Spruce St',
    amountStatus: 'Unpaid',
  },
  {
    customer: {
      photo: 'assets/images/users/avatar-8.jpg',
      name: 'David Padgett',
    },
    purchaseDate: '15/06/' + currentYear,
    contact: '+231 92-78901234',
    propertyType: 'Commercial',
    amount: currency + '1,567,890',
    purchaseProperties: '606 Fir Ave',
    amountStatus: 'Paid',
  },
  {
    customer: {
      photo: 'assets/images/users/avatar-9.jpg',
      name: 'Valerie Obrien',
    },
    purchaseDate: '22/07/' + currentYear,
    contact: '+231 82-89012345',
    propertyType: 'Residential',
    amount: currency + '1,234,567',
    purchaseProperties: '808 Willow Dr, 909 Aspen Ln',
    amountStatus: 'Pending',
  },
  {
    customer: {
      photo: 'assets/images/users/avatar-10.jpg',
      name: 'Adriana G. Faust',
    },
    purchaseDate: '29/10/' + currentYear,
    contact: '+231 54-4775764',
    propertyType: 'Apartment',
    amount: currency + '1,502,331',
    purchaseProperties: '1190 Barlow Street Mokopane',
    amountStatus: 'Pending',
  },
]
