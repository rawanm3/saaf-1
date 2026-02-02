export interface NotificationProperty {
  _id?: string;
  name?: string;
  location?: string;
}

export interface Notification {
  _id?: string;
  message: string;
  seen: boolean;
  property?: NotificationProperty; 
  createdAt: string | Date;
}

export interface NotificationApiResponse {
  message: string;
  data?: Notification[] | Notification; 
  error?: string;
}