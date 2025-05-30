import { useEffect, useState } from "react";

import { ConfigProvider, message, notification, theme } from "antd";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";

import { DefaultLayout } from "./components/DefaultLayout";
import { MainView } from "./containers/MainView";

const App = () => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification();
  const [currentTheme, setCurrentTheme] = useState<"dark" | "light">("light");
  const { i18n } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage("us");
  }, [i18n]);

  useEffect(() => {
    if (currentTheme === "dark") {
      document.documentElement.style.setProperty("--box-shadow", "dark");
      document.documentElement.style.setProperty("--background", "#000000");
      document.documentElement.style.setProperty("--color-text", "#ffffff");
    } else {
      document.documentElement.style.setProperty("--color-text", "#000000");
      document.documentElement.style.setProperty("--background", "#ffffff");
    }
  }, [currentTheme]);

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#ff33fc" },
        cssVar: true,
        algorithm:
          currentTheme === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
        components: {
          Typography: {
            titleMarginTop: 0,
            titleMarginBottom: 0,
          },
        },
      }}
    >
      {messageContextHolder}
      {notificationContextHolder}
      <BrowserRouter>
        <Routes>
          <Route
            element={
              <DefaultLayout
                messageApi={messageApi}
                notificationApi={notificationApi}
                setCurrentTheme={setCurrentTheme}
                currentTheme={currentTheme}
              />
            }
          >
            <Route path="/" element={<MainView />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
