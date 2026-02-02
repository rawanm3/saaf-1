import { currency, currentYear } from '@common/constants'

export type StatType = {
  icon: string
  iconColor: string
  amount: string
  title: string
  change: string
  changeColor: string
  badgeIcon: string
}

export type StatisticType = {
  icon: string
  iconColor: string
  title: string
  amount: string
  change: string
  changeColor: string
}

export type ScheduleType = {
  time: string
  title: string
  variant: string
  duration: string
}

export type ProjectType = {
  project: string
  client: string
  team: string[]
  deadline: string
  progressValue: number
  progressType: string
}

export type TransactionType = {
  id: string
  date: string
  amount: string
  status: string
  description: string
}

export type FriendRequestType = {
  profile: string
  name: string
  mutual: number
}

export type UserType = {
  name: string
  avatar: string
}

export type TaskType = {
  task_name: string
  checked: boolean
}

export const stateData: StatType[] = [
  {
    icon: 'solar:asteroid-bold-duotone',
    iconColor: 'info',
    amount: '59.6',
    title: 'Total Income',
    change: '8.72',
    changeColor: 'success',
    badgeIcon: 'bx bx-doughnut-chart',
  },
  {
    icon: 'solar:black-hole-line-duotone',
    iconColor: 'success',
    amount: '24.03',
    title: 'Total Expenses',
    change: '3.28',
    changeColor: 'danger',
    badgeIcon: 'bx bx-bar-chart-alt-2',
  },
  {
    icon: 'solar:leaf-bold-duotone',
    iconColor: 'primary',
    amount: '48.7',
    title: 'Investments',
    change: '5.69',
    changeColor: 'danger',
    badgeIcon: 'bx bx-building-house',
  },
  {
    icon: 'solar:crown-star-bold-duotone',
    iconColor: 'danger',
    amount: '11.3',
    title: 'Savings',
    change: '10.58',
    changeColor: 'success',
    badgeIcon: 'bx bx-bowl-hot',
  },
  {
    icon: 'solar:cpu-bolt-line-duotone',
    iconColor: 'warning',
    amount: '5.5',
    title: 'Profit',
    change: '8.72',
    changeColor: 'success',
    badgeIcon: 'bx bx-cricket-ball',
  },
]

export const statisticData: StatisticType[] = [
  {
    icon: 'solar:leaf-bold-duotone',
    iconColor: 'primary',
    title: 'Campaign Sent',
    amount: '13, 647',
    change: '2.3',
    changeColor: 'success',
  },
  {
    icon: 'solar:cpu-bolt-line-duotone',
    iconColor: 'secondary',
    title: 'New Leads',
    amount: '9, 526',
    change: '8.1',
    changeColor: 'success',
  },
  {
    icon: 'solar:layers-bold-duotone',
    iconColor: 'success',
    title: 'Deals',
    amount: '976',
    change: '0.3',
    changeColor: 'danger',
  },
  {
    icon: 'solar:shield-bold-duotone',
    iconColor: 'info',
    title: 'Booked Revenue',
    amount: currency + '123.6k',
    change: '10.6',
    changeColor: 'danger',
  },
]

export const scheduleData: ScheduleType[] = [
  {
    time: '09:00',
    title: 'Setup Github Repository',
    variant: 'primary',
    duration: '09:00 - 10:00',
  },
  {
    time: '10:00',
    title: 'Design Review - Lahomes Admin',
    variant: 'success',
    duration: '10:00 - 10:30',
  },
  {
    time: '11:00',
    title: 'Meeting with BD Team',
    variant: 'info',
    duration: '11:00 - 12:30',
  },
  {
    time: '01:00',
    title: 'Meeting with Design Studio',
    variant: 'warning',
    duration: '01:00 - 02:00',
  },
]

export const RecentProject: ProjectType[] = [
  {
    project: 'Zelogy',
    client: 'Daniel Olsen',
    team: [
      'assets/images/users/avatar-2.jpg',
      'assets/images/users/avatar-3.jpg',
      'assets/images/users/avatar-4.jpg',
    ],
    deadline: '12 April ' + currentYear,
    progressValue: 33,
    progressType: 'primary',
  },
  {
    project: 'Shiaz',
    client: 'Jack Roldan',
    team: [
      'assets/images/users/avatar-1.jpg',
      'assets/images/users/avatar-5.jpg',
    ],
    deadline: '10 April ' + currentYear,
    progressValue: 74,
    progressType: 'success',
  },
  {
    project: 'Holderick',
    client: 'Betty Cox',
    team: [
      'assets/images/users/avatar-5.jpg',
      'assets/images/users/avatar-2.jpg',
      'assets/images/users/avatar-3.jpg',
    ],
    deadline: '31 March ' + currentYear,
    progressValue: 50,
    progressType: 'warning',
  },
  {
    project: 'Feyvux',
    client: 'Carlos Johnson',
    team: [
      'assets/images/users/avatar-3.jpg',
      'assets/images/users/avatar-7.jpg',
      'assets/images/users/avatar-6.jpg',
    ],
    deadline: '25 March ' + currentYear,
    progressValue: 92,
    progressType: 'primary',
  },
  {
    project: 'Xavlox',
    client: 'Lorraine Cox',
    team: ['assets/images/users/avatar-7.jpg'],
    deadline: '22 March ' + currentYear,
    progressValue: 48,
    progressType: 'danger',
  },
  {
    project: 'Mozacav',
    client: 'Delores Young',
    team: [
      'assets/images/users/avatar-3.jpg',
      'assets/images/users/avatar-4.jpg',
      'assets/images/users/avatar-2.jpg',
    ],
    deadline: '15 March ' + currentYear,
    progressValue: 21,
    progressType: 'primary',
  },
]

export const FriendRequest: FriendRequestType[] = [
  {
    profile: 'assets/images/users/avatar-10.jpg',
    name: 'Victoria P. Miller',
    mutual: 0,
  },
  {
    profile: 'assets/images/users/avatar-9.jpg',
    name: 'Dallas C. Payne',
    mutual: 856,
  },
  {
    profile: 'assets/images/users/avatar-8.jpg',
    name: 'Florence A. Lopez',
    mutual: 52,
  },
  {
    profile: 'assets/images/users/avatar-7.jpg',
    name: 'Gail A. Nix',
    mutual: 12,
  },
  {
    profile: 'assets/images/users/avatar-6.jpg',
    name: 'Lynne J. Petty',
    mutual: 0,
  },
  {
    profile: 'assets/images/users/avatar-5.jpg',
    name: 'Victoria P. Miller',
    mutual: 0,
  },
  {
    profile: 'assets/images/users/avatar-4.jpg',
    name: 'Dallas C. Payne',
    mutual: 856,
  },
  {
    profile: 'assets/images/users/avatar-3.jpg',
    name: 'Florence A. Lopez',
    mutual: 52,
  },
  {
    profile: 'assets/images/users/avatar-2.jpg',
    name: 'Gail A. Nix',
    mutual: 12,
  },
  {
    profile: 'assets/images/users/avatar-1.jpg',
    name: 'Lynne J. Petty',
    mutual: 0,
  },
]

export const TransactionsList: TransactionType[] = [
  {
    id: '#98521',
    date: '24 April, ' + currentYear,
    amount: '120.55',
    status: 'Cr',
    description: 'Commisions',
  },
  {
    id: '#20158',
    date: '24 April, ' + currentYear,
    amount: '9.68',
    status: 'Cr',
    description: 'Affiliates',
  },
  {
    id: '#36589',
    date: '20 April, ' + currentYear,
    amount: '105.22',
    status: 'Dr',
    description: 'Grocery',
  },
  {
    id: '#95362',
    date: '18 April, ' + currentYear,
    amount: '80.59',
    status: 'Cr',
    description: 'Refunds',
  },
  {
    id: '#75214',
    date: '18 April, ' + currentYear,
    amount: '750.95',
    status: 'Dr',
    description: 'Bill Payments',
  },

  {
    id: '#75215',
    date: '17 April, ' + currentYear,
    amount: '455.62',
    status: 'Dr',
    description: 'Electricity',
  },
  {
    id: '#75216',
    date: '17 April, ' + currentYear,
    amount: '102.77',
    status: 'Cr',
    description: 'Interest',
  },
  {
    id: '#75217',
    date: '16 April, ' + currentYear,
    amount: '79.49',
    status: 'Cr',
    description: 'Refunds',
  },
  {
    id: '#75218',
    date: '05 April, ' + currentYear,
    amount: '980.00',
    status: 'Dr',
    description: 'Shopping',
  },
]

export const TaskData: TaskType[] = [
  {
    task_name: 'Review system logs for any reported errors',
    checked: false,
  },
  {
    task_name: 'Conduct user testing to identify potential bugs',
    checked: true,
  },
  {
    task_name: 'Gather feedback from stakeholders',
    checked: false,
  },
  {
    task_name: 'Prioritize bugs based on severity and impact',
    checked: false,
  },
  {
    task_name: 'Investigate and analyze the root cause of each bug',
    checked: false,
  },
  {
    task_name: 'Develop and implement fixes for the identified bugs',
    checked: false,
  },
  {
    task_name: 'Complete any recurring tasks',
    checked: false,
  },
  {
    task_name: 'Check emails and respond',
    checked: false,
  },
  {
    task_name: 'Review schedule for the day',
    checked: true,
  },
  {
    task_name: 'Daily stand-up meeting',
    checked: false,
  },
]
