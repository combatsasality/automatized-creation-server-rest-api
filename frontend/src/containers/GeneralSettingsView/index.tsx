import { Form, Input } from "antd";
import { ProfileLayout } from "../../components/ProfileLayout";
import style from "./GeneralSettingsView.module.css";
import { useContext } from "react";
import { UserContext } from "../../context";
import { useTranslation } from "react-i18next";

export const GeneralSettingsView = () => {
  const { user } = useContext(UserContext);
  const { t } = useTranslation();

  return (
    <ProfileLayout selectedKey="general">
      <Form layout="vertical" disabled className={style.form}>
        <Form.Item label={t("profileLayout.username")}>
          <Input defaultValue={user.username} />
        </Form.Item>
        <Form.Item label={t("profileLayout.role")}>
          <Input defaultValue={t(`profileLayout.${user.role}`)} />
        </Form.Item>
      </Form>
    </ProfileLayout>
  );
};
