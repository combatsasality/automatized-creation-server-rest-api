import { MessageInstance } from "antd/es/message/interface";
import { Dispatch, SetStateAction, ReactNode } from "react";
import { NotificationInstance } from "antd/es/notification/interface";
import { UUID } from "crypto";

declare global {
  declare module "*.module.css" {
    const classes: Record<string, string>;
    export default classes;
  }
  type GMessageInstance = MessageInstance;
  type GNotificationInstance = NotificationInstance;
  type GDispatch<T> = Dispatch<T>;
  type GSetStateAction<T> = SetStateAction<T>;
  type GReactNode = ReactNode;
}
