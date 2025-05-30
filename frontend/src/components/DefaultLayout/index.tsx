import { FC, useEffect } from "react";

import { MoonFilled, SunOutlined } from "@ant-design/icons";
import { FloatButton, theme } from "antd";
import { Outlet } from "react-router";

import style from "./DefaultLayout.module.css";
import { Logo } from "../Logo";

export const DefaultLayout: FC<DefaultLayoutProps> = ({
  messageApi,
  notificationApi,
  setCurrentTheme,
  currentTheme,
}) => {
  const {
    token: { boxShadow },
  } = theme.useToken();

  useEffect(() => {
    console.log(boxShadow);
  }, [boxShadow]);

  return (
    <>
      <header className={style.header} style={{ boxShadow: boxShadow }}>
        <FloatButton
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
        />
        <Logo />
      </header>

      <main className={style.main}>
        <Outlet context={{ messageApi, notificationApi }} />
      </main>
    </>
  );
};
