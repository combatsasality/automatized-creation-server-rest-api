// src/global.d.ts

import { MessageInstance } from 'antd/es/message/interface';
import { NotificationInstance } from 'antd/es/notification/interface';

declare global {
  declare module '*.module.css' {
    const classes: Record<string, string>;
    export default classes;
  }

  type GMessageInstance = MessageInstance;
  type GNotificationInstance = NotificationInstance;
}
