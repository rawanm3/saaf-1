import type { FileType } from '@views/apps/messages/data'

export type BootstrapVariantType =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'dark'
  | 'light'

export type ActivityType = {
  title: string
  icon?: string
  variant?: BootstrapVariantType
  status?: 'completed' | 'latest'
  files?: FileType[]
  time: Date
  type?: 'task' | 'design' | 'achievement'
  content?: string
}

export type SocialEventType = {
  id: string
  title: string
  venue: string
  type: 'togetherness' | 'celebration' | 'professional'
  image: string
  startsAt: Date
}

export const getActivityIcon = (type: ActivityType['type']) => {
  if (type === 'task') return 'iconamoon:folder-check-duotone'
  else if (type === 'design') return 'iconamoon:check-circle-1-duotone'
  else return 'iconamoon:certificate-badge-duotone'
}

export const getEventIcon = (type: SocialEventType['type']) => {
  if (type === 'celebration') return 'bx:cake'
  else if (type === 'togetherness') return 'bx:heart'
  else return 'bx:bookmark'
}
