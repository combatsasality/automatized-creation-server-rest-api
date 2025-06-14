import React, { useContext, useEffect } from "react";

import style from "./ProfileLayout.module.css";
import { Flex, Menu, MenuProps, Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import { ApiOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { AuthenticationContext } from "../../context";
import { Link, useNavigate } from "react-router";


export const ProfileLayout: React.FC<ProfileLayoutProps> = ({
  children,
  selectedKey,
}) => {
  const { t } = useTranslation();
  const { auth } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const menuOptions = [
    {
      key: "general",
      label: <Link to="/profile/">{t("profileLayout.general")}</Link>,
      icon: <UserOutlined />,
    },
    {
      key: "security",
      label: <Link to="/profile/security/">{t("profileLayout.security")}</Link>,
      icon: <LockOutlined />,
    },
  ];

  useEffect(() => {
    if (!auth.isAuthenticated && !auth.isAuthenticating) {
      navigate("/");
    }
  }, [auth]);

  return (
    <div className={style.container}>
      <div className={style.menuContainer}>
        <Menu mode="inline" items={menuOptions} selectedKeys={[selectedKey]} />
      </div>
      <div className={style.childrenContainer}>
        {auth.isAuthenticated && !auth.isAuthenticating ? (
          children
        ) : (
          <>
            <Flex vertical gap={24}>
              <Flex gap={8}>
                <Skeleton.Input active />
                <Skeleton.Input active />
                <Skeleton.Input active />
              </Flex>
              <Flex gap={8}>
                <Skeleton.Input active />
                <Skeleton.Input active />
                <Skeleton.Input active />
              </Flex>
              <Flex gap={8}>
                <Skeleton.Input active />
                <Skeleton.Input active />
                <Skeleton.Input active />
              </Flex>
            </Flex>
          </>
        )}
      </div>
    </div>
  );
};
