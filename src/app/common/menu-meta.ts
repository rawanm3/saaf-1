export type MenuItemType = {
  key: string
  label: string
  isTitle?: boolean
  icon?: string
  url?: string
  badge?: {
    variant: string
    text: string
  }
  parentKey?: string
  isDisabled?: boolean
  collapsed?: boolean
  children?: MenuItemType[]
  role?: 'admin' | 'accountant' | 'employee' | 'all'  // Role-based visibility
}

export type SubMenus = {
  item: MenuItemType
  linkClassName?: string
  subMenuClassName?: string
  activeMenuItems?: Array<string>
  toggleMenu?: (item: MenuItemType, status: boolean) => void
  className?: string
}

export type TabMenuItem = {
  index: number
  name: string
  icon: string
}

export const MENU_ITEMS: MenuItemType[] = [
  {
    key: 'menu',
    isTitle: true,
    label: 'COMMON.MENU',
  },
  {
    key: 'dashboards',
    label: 'SIDEBAR.DASHBOARDS',
    icon: 'ri-dashboard-2-line',
    url: '/dashboards',
    role: 'all',
  },
  {
    key: 'property',
    label: 'SIDEBAR.PROPERTY',
    icon: 'ri-community-line',
    collapsed: true,
    role: 'all',
    children: [
      {
        key: 'property-list',
        label: 'SIDEBAR.ALL_PROPERTIES',
        url: '/property/list',
        parentKey: 'property',
        role: 'all',
      },
      {
        key: 'add-property',
        label: 'SIDEBAR.ADD_PROPERTY',
        url: '/property/add',
        parentKey: 'property',
        role: 'employee',
      },
    ],
  },
  {
    key: 'customers',
    label: 'SIDEBAR.CUSTOMERS',
    icon: 'ri-contacts-book-3-line',
    collapsed: true,
    role: 'employee',
    children: [
      {
        key: 'customers-list',
        label: 'SIDEBAR.CUSTOMERS_LIST',
        url: '/customers/list',
        parentKey: 'customers',
        role: 'employee',
      },
      {
        key: 'add-customer',
        label: 'SIDEBAR.ADD_CUSTOMER',
        url: '/customers/add',
        parentKey: 'customers',
        role: 'employee',
      },
    ],
  },
  {
    key: 'investment',
    label: 'SIDEBAR.INVESTMENTS',
    icon: 'ri-funds-line',
    url: '/investment',
    role: 'accountant',
  },
  {
    key: 'transactions',
    label: 'SIDEBAR.TRANSACTIONS',
    icon: 'ri-arrow-left-right-line',
    url: '/transactions',
    role: 'accountant',
  },
  {
    key: 'wallet',
    label: 'SIDEBAR.WALLET',
    icon: 'ri-bank-card-line',
    url: '/wallet/list',
    role: 'accountant',
  },
  {
    key: 'distributions',
    label: 'SIDEBAR.DISTRIBUTIONS',
    icon: 'ri-exchange-dollar-line',
    url: '/distributions/list',
    role: 'accountant',
  },
  {
    key: 'employees',
    label: 'SIDEBAR.EMPLOYEES',
    icon: 'ri-user-settings-line',
    collapsed: true,
    role: 'admin',
    children: [
      {
        key: 'employees-list',
        label: 'SIDEBAR.EMPLOYEES_LIST',
        url: '/employees/list',
        parentKey: 'employees',
        role: 'admin',
      },
      {
        key: 'add-employee',
        label: 'SIDEBAR.ADD_EMPLOYEE',
        url: '/employees/add',
        parentKey: 'employees',
        role: 'admin',
      },
    ],
  },
]
