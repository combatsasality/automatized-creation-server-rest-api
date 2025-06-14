import { useEffect, useState } from "react";

import { Button, ConfigProvider, message, notification, Result } from "antd";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Link, Outlet, Route, Routes } from "react-router";
import "./App.css";

import { DefaultLayout } from "./components/DefaultLayout";
import { LoginView } from "./containers/LoginView";
import { MainView } from "./containers/MainView";
import { RegisterView } from "./containers/RegisterView";
import { AuthenticationContext, UserContext } from "./context";
import { GeneralSettingsView } from "./containers/GeneralSettingsView";
import { SecuritySettingsView } from "./containers/SecuritySettingsView";
import { TableView } from "./containers/TableView";
import { TableCreateView } from "./containers/TableCreateView";
import { TableInfoView } from "./containers/TableInfoView";

const App = () => {
  const [messageApi, messageContextHolder] = message.useMessage();
  const [notificationApi, notificationContextHolder] = notification.useNotification({
    placement: "bottomRight",
  });
  const [user, setUser] = useState<UserState>({
    username: "combatsasality",
    role: "USER",
  });
  const [auth, setAuth] = useState<AuthenticationState>({
    isAuthenticated: false,
    isAuthenticating: true,
  });
  const { i18n, t } = useTranslation();

  useEffect(() => {
    i18n.changeLanguage("uk");
  }, [i18n]);

  return (
    <ConfigProvider
      theme={{
        token: { colorPrimary: "#ff33fc" },
        cssVar: true,
        components: {
          Typography: {
            titleMarginTop: 0,
            titleMarginBottom: 0,
          },
        },
      }}
    >
      <UserContext.Provider value={{ user, setUser }}>
        <AuthenticationContext value={{ auth, setAuth }}>
          {messageContextHolder}
          {notificationContextHolder}
          <BrowserRouter>
            <Routes>
              <Route element={<Outlet context={{ messageApi, notificationApi }} />}>
                <Route path="/login/" element={<LoginView />} />
                <Route path="/register/" element={<RegisterView />} />
                <Route
                  element={
                    <DefaultLayout
                      messageApi={messageApi}
                      notificationApi={notificationApi}
                    />
                  }
                >
                  <Route path="/" element={<MainView />} />
                  <Route path="/table/" element={<TableView />} />\
                  <Route path="/table/:tableName/" element={<TableInfoView />} />
                  <Route path="/table/create/" element={<TableCreateView />} />
                  <Route path="/profile/" element={<GeneralSettingsView />} />
                  <Route path="/profile/security/" element={<SecuritySettingsView />} />
                  <Route
                    path="*"
                    element={
                      <Result
                        status="404"
                        title="404"
                        subTitle={t("notFound.subTitle")}
                        extra={
                          <Button type="primary">
                            <Link to="/">{t("notFound.button")}</Link>
                          </Button>
                        }
                      />
                    }
                  />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthenticationContext>
      </UserContext.Provider>
    </ConfigProvider>
  );
};

export default App;
