import { FC, useContext, useEffect } from "react";

import { Avatar, Badge, Button, Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useNavigate } from "react-router";

import style from "./DefaultLayout.module.css";
import { Logo } from "../Logo";
import { AuthenticationContext, UserContext } from "../../context";
import { UserOutlined } from "@ant-design/icons";

export const DefaultLayout: FC<DefaultLayoutProps> = ({
  messageApi,
  notificationApi,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { auth, setAuth } = useContext(AuthenticationContext);

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      fetch(`${process.env.PUBLIC_SITE_URL}/api/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }).then(async (response) => {
        if (response.ok) {
          const json = await response.json();
          setUser(json);
          setAuth({
            isAuthenticated: true,
            isAuthenticating: false,
          });
        } else {
          localStorage.removeItem("token");
          setAuth({
            isAuthenticated: false,
            isAuthenticating: false,
          });
        }
      });
    } else {
      setAuth({
        isAuthenticated: false,
        isAuthenticating: false,
      });
    }
  }, []);

  return (
    <>
      <header className={style.header}>
        {/* <FloatButton
          shape="circle"
          type={currentTheme === "dark" ? "primary" : "default"}
          icon={currentTheme === "dark" ? <MoonFilled /> : <SunOutlined />}
          onClick={() => {
            setCurrentTheme((prev: "dark" | "light") => {
              if (prev === "dark") {
                return "light";
              } else {
                return "dark";
              }
            });
          }}
        /> */}
        <Logo />
        {auth.isAuthenticated && (
          <div>
            <Button type="text">
              <Link to="/table/">Таблиці</Link>
            </Button>
          </div>
        )}
        {auth.isAuthenticating && <Skeleton.Avatar active size="large" />}
        {auth.isAuthenticated && !auth.isAuthenticating && (
          <Link to="/profile/">
            <Avatar icon={<UserOutlined />} size="large" />
          </Link>
        )}
        {!auth.isAuthenticated && !auth.isAuthenticating && (
          <Button
            onClick={() => {
              navigate("/login/");
            }}
          >
            {t("defaultLayout.login")}
          </Button>
        )}
      </header>

      <main className={style.main}>
        <Outlet context={{ messageApi, notificationApi }} />
      </main>
    </>
  );
};
