import { NotificationType } from './notification-type.model';

export interface Notification {
  type: NotificationType;
  message: string;
}
