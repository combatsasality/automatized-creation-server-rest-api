import { FC, useContext, useEffect, useState } from "react";
import { Avatar, Button, Skeleton, Space, Drawer, Menu } from "antd";
import { useTranslation } from "react-i18next";
import { Link, Outlet, useNavigate } from "react-router";

import style from "./DefaultLayout.module.css";
import { Logo } from "../Logo";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { AuthenticationContext, UserContext } from "../../context";
import { UserOutlined, MenuOutlined } from "@ant-design/icons";

export const DefaultLayout: FC<DefaultLayoutProps> = ({
  messageApi,
  notificationApi,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const { auth, setAuth } = useContext(AuthenticationContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const mobileMenuItems = [
    ...(auth.isAuthenticated
      ? [
          {
            key: "tables",
            label: t("defaultLayout.tables"),
            onClick: () => {
              navigate("/table/");
              setMobileMenuOpen(false);
            },
          },
        ]
      : []),
    {
      key: "language",
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>{t("common.language")}</span>
          <LanguageSwitcher />
        </div>
      ),
    },
  ];

  return (
    <>
      <header className={style.header}>
        <Logo />

        <div className={style.desktopMenu}>
          <Space size="middle" className={style.headerActions}>
            <LanguageSwitcher />
            {auth.isAuthenticated && (
              <Button type="text" className={style.tableButton}>
                <Link to="/table/">{t("defaultLayout.tables")}</Link>
              </Button>
            )}
            {auth.isAuthenticating && <Skeleton.Avatar active size="default" />}
            {auth.isAuthenticated && !auth.isAuthenticating && (
              <Link to="/profile/">
                <Avatar icon={<UserOutlined />} size="default" />
              </Link>
            )}
            {!auth.isAuthenticated && !auth.isAuthenticating && (
              <Button size="small" onClick={() => navigate("/login/")}>
                {t("defaultLayout.login")}
              </Button>
            )}
          </Space>
        </div>

        <div className={style.mobileMenu}>
          <Button
            type="text"
            icon={<MenuOutlined />}
            onClick={() => setMobileMenuOpen(true)}
            className={style.mobileMenuButton}
            size="large"
          />
        </div>
      </header>

      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Logo />
          </div>
        }
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className={style.mobileDrawer}
        width={280}
      >
        <Menu items={mobileMenuItems} mode="vertical" style={{ border: "none" }} />
        {auth.isAuthenticated && !auth.isAuthenticating && (
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid #f0f0f0",
              marginTop: "auto",
            }}
          >
            <Button
              type="text"
              icon={<UserOutlined />}
              onClick={() => {
                navigate("/profile/");
                setMobileMenuOpen(false);
              }}
              style={{ width: "100%" }}
            >
              {t("profileLayout.general")}
            </Button>
          </div>
        )}
        {!auth.isAuthenticated && !auth.isAuthenticating && (
          <div
            style={{
              padding: "16px",
              borderTop: "1px solid #f0f0f0",
              marginTop: "auto",
            }}
          >
            <Button
              type="primary"
              onClick={() => {
                navigate("/login/");
                setMobileMenuOpen(false);
              }}
              style={{ width: "100%" }}
            >
              {t("defaultLayout.login")}
            </Button>
          </div>
        )}
      </Drawer>

      <main className={style.main}>
        <Outlet context={{ messageApi, notificationApi }} />
      </main>
    </>
  );
};
