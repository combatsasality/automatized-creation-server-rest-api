interface DefaultLayoutProps {
  messageApi: GMessageInstance;
  notificationApi: GNotificationInstance;
  setCurrentTheme: Dispatch<SetStateAction<'dark' | 'light'>>;
  currentTheme: 'dark' | 'light';
}

interface OutletProps {
  messageApi: GMessageInstance;
  notificationApi: GNotificationInstance;
}
