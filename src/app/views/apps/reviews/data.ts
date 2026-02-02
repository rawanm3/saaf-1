import { currentYear } from '@common/constants'

export type ReviewType = {
  image: string
  property_name: string
  date: string
  agent: string
  address: string
  rating: number
  review_title: string
  review: string
  status: string
}

export const reviewList: ReviewType[] = [
  {
    image: 'assets/images/properties/p-1.jpg',
    property_name: 'Dvilla Residences Batu',
    date: '15/03/' + currentYear,
    agent: 'Adriana G. Faust',
    address: '390 Main Rd Mandeni',
    rating: 4.5,
    review_title: 'Best For Family Leaving',
    review:
      'The property was exactly as described and the buying process was smooth and hassle-free.',
    status: 'Published',
  },
  {
    image: 'assets/images/properties/p-2.jpg',
    property_name: 'PIK Villa House',
    date: '20/03/' + currentYear,
    agent: 'John N. Mazza',
    address: '27 Ireland St Sabie',
    rating: 3.5,
    review_title: 'Best In Low Price',
    review:
      'Great experience overall, but there were a few delays in communication.',
    status: 'Pending',
  },
  {
    image: 'assets/images/properties/p-3.jpg',
    property_name: 'Tungis Luxury',
    date: '25/03/' + currentYear,
    agent: 'Harold E. Joyce',
    address: '564 Plein St Houtbaai',
    rating: 4.3,
    review_title: 'Agent Is Good',
    review: 'Fantastic service and very knowledgeable agent. Highly recommend!',
    status: 'Published',
  },
  {
    image: 'assets/images/properties/p-4.jpg',
    property_name: 'Luxury Apartment',
    date: '30/03/' + currentYear,
    agent: 'Robert L. Dale',
    address: 'Schoeman St Pretoria',
    rating: 3.1,
    review_title: 'Renovation Requirement',
    review:
      'Good experience, but the property needed more repairs than expected.',
    status: 'Pending',
  },
  {
    image: 'assets/images/properties/p-5.jpg',
    property_name: 'Weekend Villa MBH',
    date: '05/04/' + currentYear,
    agent: 'Shirley F. Desrosiers',
    address: '95 Stanley Rd Durban',
    rating: 4.4,
    review_title: 'Best Property',
    review:
      'Excellent service! The agent was very helpful and responsive throughout the process.',
    status: 'Published',
  },
  {
    image: 'assets/images/properties/p-6.jpg',
    property_name: 'Luxury Penthouse',
    date: '10/04/' + currentYear,
    agent: 'Jeffrey G. Mahon',
    address: '1936 Broad Rd Orlando',
    rating: 2.5,
    review_title: 'Bed Experience',
    review:
      'Average experience. The property was good, but the process took longer than anticipated.',
    status: 'Pending',
  },
  {
    image: 'assets/images/properties/p-7.jpg',
    property_name: 'Ojiag Duplex Apartment',
    date: '15/04/' + currentYear,
    agent: 'John A. Newton',
    address: '676 Plein St Cape Town',
    rating: 4.5,
    review_title: 'Wonderful Property',
    review:
      "Outstanding service and a wonderful property. Couldn't be happier!",
    status: 'Published',
  },
]
