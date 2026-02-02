import { currency } from '@common/constants'
import {
  addOrSubtractDaysFromDate,
  addOrSubtractMinutesFromDate,
} from '@core/helper/utils'

export type UserType = {
  id: string
  name: string
  avatar: string
  email: string
  mutualCount: number
  contact: string
  activityStatus: 'typing' | 'online' | 'offline'
  languages: string[]
  status?: 'Active' | 'Inactive'
  address?: string
  message?: string
  time: Date
  hasRequested?: boolean
  chatIcon?: string
  location: string
  emailMessage?: string
}

export type ContactType = {
  image?: string
  name: string
  lastMsg: string
  time: string
  isRead: boolean
}

export type GroupType = {
  id: string
  name: string
  description: string
  time: Date
  groupName: string
  change?: number
  variant: string
}

export type UserContactType = {
  name: string
  image?: string
  status: string
}

type MediaContendType = {
  title: string
  type: string
  size: string
}

type MessageType = {
  text?: string
  img?: string[]
  isMedia?: boolean
  mediaContend?: MediaContendType
}

export type FileType = Partial<File> & {
  preview?: string
}

export type ChatMessageType = {
  id: string
  from: UserType
  to: UserType
  message: {
    type: 'file' | 'text'
    value: FileType[] | string
  }
  sentOn?: Date
}

export const messages: ChatMessageType[] = []

export const userData: UserType[] = [
  {
    id: '1',
    name: 'Michael A. Miner',
    avatar: 'assets/images/users/avatar-1.jpg',
    languages: ['English', 'German', 'Spanish'],
    email: 'daavidnumminen@teleworm.us',
    contact: '+231 06-75820711',
    status: 'Active',
    mutualCount: 43,
    message: 'How are you today?',
    location: 'California, USA',
    time: addOrSubtractMinutesFromDate(10),
    chatIcon: 'solar:hand-shake-bold-duotone',
    activityStatus: 'online',
    address: 'Schoolstraat 161 5151 HH Drunen',
    emailMessage: 'Thank you all for your hard ...',
  },
  {
    id: '2',
    name: 'Theresa T. Brose',
    avatar: 'assets/images/users/avatar-2.jpg',
    languages: ['English', 'German', 'Spanish'],
    email: 'sinikkapenttinen@dayrep.com',
    contact: '+231 47-23456789',
    status: 'Active',
    mutualCount: 856,
    message: "Hey! a reminder for tommorow's meeting...",
    location: 'New Jersey, USA',
    time: addOrSubtractMinutesFromDate(20),
    activityStatus: 'online',
    address: 'Jean Racinelaan 48 5629 PK Eindhoven',
    emailMessage: 'In recognition of your achieve...',
  },
  {
    id: '3',
    name: 'James L. Erickson',
    avatar: 'assets/images/users/avatar-3.jpg',
    languages: ['English', 'German', 'Spanish'],
    email: 'jerepalmu@rhyta.com',
    contact: '+231 73-34567890',
    status: 'Inactive',
    mutualCount: 52,
    time: addOrSubtractMinutesFromDate(50),
    location: 'California, USA',
    message: "Hello! I just got your assignment, everything's alright, exce",
    activityStatus: 'typing',
    address: 'Alkmenehof 124 2728 KA Zoetermeer',
    emailMessage: 'Additionally, I would like to remind eve...',
  },
  {
    id: '4',
    name: 'Lily W. Wilson',
    avatar: 'assets/images/users/avatar-4.jpg',
    languages: ['English', 'German', 'Spanish'],
    email: 'ullanuorela@rhyta.com',
    contact: '+231 45-45678901',
    status: 'Active',
    time: addOrSubtractMinutesFromDate(100),
    mutualCount: 12,
    location: 'New York, USA',
    chatIcon: 'solar:confetti-minimalistic-bold-duotone',
    message: "Are we going to have this week's planning meeting today?",
    activityStatus: 'typing',
    address: 'Oudegracht 135 3511 NJ Utrecht',
    emailMessage: 'After reviewing the current progres...',
  },
  {
    id: '5',
    name: 'Sarah M. Brooks',
    avatar: 'assets/images/users/avatar-5.jpg',
    languages: ['English', 'German', 'Spanish'],
    email: 'tiiakarppinen@teleworm.us',
    contact: '+231 16-56789012',
    status: 'Inactive',
    mutualCount: 548,
    location: 'California, USA',
    time: addOrSubtractMinutesFromDate(150),
    message: 'Please check this template...',
    activityStatus: 'offline',
    address: 'Willem de Zwijgerlaan 183 2315 AT Leiden',
    emailMessage: 'we have decided to adjust the deadlin...',
  },
  {
    id: '6',
    name: 'Joe K. Hall',
    avatar: 'assets/images/users/avatar-6.jpg',
    languages: ['English', 'German', 'Spanish'],
    email: 'harlandrorsini@dayrep.com',
    contact: '+231 82-67890123',
    status: 'Active',
    mutualCount: 0,
    location: 'California, USA',
    time: addOrSubtractMinutesFromDate(200),
    message: 'Are free for 10 minutes? would like to discuss something...',
    activityStatus: 'offline',
    address: 'Bongerd 116 6367 CL Voerendaal',
    emailMessage: "We'd like to thank you for being su...",
  },
  {
    id: '7',
    name: 'Robert V. Leavitt',
    avatar: 'assets/images/users/avatar-7.jpg',
    languages: ['English', 'German', 'Spanish'],
    email: 'robertvleavitt@dayrep.com',
    contact: '+787 361-318-4753',
    status: 'Active',
    mutualCount: 856,
    hasRequested: true,
    location: 'California, USA',
    chatIcon: 'solar:hand-shake-bold-duotone',
    time: addOrSubtractMinutesFromDate(250),
    message: 'How are you?',
    activityStatus: 'typing',
    address: 'Stockert Hollow Road Redmond, WA 98052',
    emailMessage: 'February, you will be paid to your nomina...',
  },
  {
    id: '8',
    name: 'Lydia Anderson',
    avatar: 'assets/images/users/avatar-8.jpg',
    languages: ['English', 'German', 'Spanish'],
    email: 'lydiajanderson@dayrep.com',
    contact: '+787 602-851-1066',
    message: 'Whats going on?',
    status: 'Inactive',
    mutualCount: 52,
    location: 'California, USA',
    time: addOrSubtractMinutesFromDate(300),
    activityStatus: 'online',
    address: 'Schoolstraat 161 5151 HH Drunen',
    emailMessage: currency + '250 cash reward. This will be paid out...',
  },
  {
    id: '9',
    name: 'Sarah Martinez',
    avatar: 'assets/images/users/avatar-9.jpg',
    languages: ['English', 'German', 'Spanish'],
    email: 'sarahjmartinez@rhyta.com',
    contact: '+231 45-45678901',
    status: 'Active',
    time: addOrSubtractMinutesFromDate(350),
    mutualCount: 12,
    location: 'California, USA',
    message: 'Would you like to join us?',
    activityStatus: 'offline',
    address: 'Schoolstraat 161 5151 HH Drunen',
    emailMessage: 'Thank you all for your hard ...',
  },
]

export const socialGroupsData: GroupType[] = [
  {
    id: '301',
    groupName: 'General',
    name: 'HG',
    description: 'Good morning everyone !',
    time: addOrSubtractDaysFromDate(50),
    change: 1,
    variant: 'warning',
  },
  {
    id: '302',
    groupName: 'Project A',
    name: 'Rk',
    description: 'This themes is awesome! ...',
    time: addOrSubtractDaysFromDate(158),
    variant: 'success',
  },
  {
    id: '303',
    groupName: 'Project B',
    name: 'Susan',
    description: 'Hey...😊',
    time: addOrSubtractDaysFromDate(44),
    variant: 'warning',
  },
  {
    id: '304',
    groupName: 'Reporting',
    name: 'HK',
    description: 'Good Morning Everyone',
    time: addOrSubtractDaysFromDate(66),
    change: 5,
    variant: 'danger',
  },
  {
    id: '305',
    groupName: 'Work Reporting',
    name: 'Angela',
    description: 'Today work is...',
    time: addOrSubtractDaysFromDate(78),
    variant: 'success',
  },
  {
    id: '306',
    groupName: 'Meeting',
    name: 'HR',
    description: 'Next meeting today 10am',
    time: addOrSubtractDaysFromDate(89),
    change: 1,
    variant: 'primary',
  },
]

const defaultTo: UserType = {
  id: '112',
  mutualCount: 56,
  name: 'Gilbert Chicoine',
  avatar: 'assets/images/users/avatar-10.jpg',
  email: 'jamesbridge@teleworm.us',
  message: 'Hey! Okay, thank you for letting me know. See you!',
  time: addOrSubtractMinutesFromDate(650),
  contact: '456 9595 9594',
  location: 'California, USA',
  languages: ['English', 'German', 'Spanish'],
  activityStatus: 'online',
}

for (const user of userData) {
  messages.push(
    {
      id: '101',
      to: defaultTo,
      from: user,
      message: {
        type: 'text',
        value: "Hey Gaston, how's all going?",
      },
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '102',
      to: user,
      from: defaultTo,
      message: {
        type: 'text',
        value: 'Yeah, everything good!',
      },
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '103',
      to: defaultTo,
      from: user,
      message: {
        type: 'file',
        value: [
          { preview: 'assets/images/small/img-4.jpg' },
          { preview: 'assets/images/small/img-6.jpg' },
          { preview: 'assets/images/small/img-7.jpg' },
        ],
      },
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '104',
      to: user,
      from: defaultTo,
      message: {
        type: 'text',
        value: 'Okk Nice ! Please Send Zip File',
      },
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '105',
      to: defaultTo,
      from: user,
      message: {
        type: 'file',
        value: [
          {
            name: 'admin- dashboard2024.zip',
            size: 2.3,
          },
        ],
      },
      sentOn: addOrSubtractMinutesFromDate(110),
    },
    {
      id: '106',
      to: user,
      from: defaultTo,
      message: {
        type: 'text',
        value: 'Okk David , Will update the Designs',
      },
      sentOn: addOrSubtractMinutesFromDate(20),
    },
    {
      id: '107',
      to: defaultTo,
      from: user,
      message: {
        type: 'text',
        value:
          "Thanks, Gaston. I appreciate your support. Overall, I'm optimistic about our team's performance and looking forward to tackling new challenges in the next quarter.",
      },
      sentOn: addOrSubtractMinutesFromDate(10),
    }
  )
}
