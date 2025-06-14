interface DefaultLayoutProps {
  messageApi: GMessageInstance;
  notificationApi: GNotificationInstance;
}

interface OutletProps {
  messageApi: GMessageInstance;
  notificationApi: GNotificationInstance;
}

interface ProfileLayoutProps {
  children: GReactNode;
  selectedKey: string;
}

interface FieldType {
  key: string;
  name: string;
  type: "TEXT" | "BOOLEAN" | "INT" | "NUMERIC";
  isCanBeNull: boolean;
  isUnique: boolean;
}
