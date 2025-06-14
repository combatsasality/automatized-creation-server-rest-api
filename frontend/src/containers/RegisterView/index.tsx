import { Button, Checkbox, Flex, Form, Input, Radio, Typography } from "antd";
import style from "./RegisterView.module.css";
import { useTranslation } from "react-i18next";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate, useOutletContext } from "react-router";
import { useEffect, useState } from "react";

const { Title, Link: LinkAntd } = Typography;

export const RegisterView = () => {
  const { t } = useTranslation();
  const { notificationApi } = useOutletContext<OutletProps>();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  return (
    <div className={style.container}>
      <div className={style.innerContainer}>
        <div className={style.header}>
          <Title level={2}>{t("registerView.registerHeader")}</Title>
        </div>
        <div className={style.form}>
          <Form
            form={form}
            onFinish={(values) => {
              fetch(`${process.env.PUBLIC_SITE_URL}/api/users/register` || "", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                  "Content-Type": "application/json",
                },
              }).then(async (response) => {
                if (response.status === 500) {
                  notificationApi.error({ message: "Internal server error" });
                  return;
                }

                const data: ApiResponse = await response.json();

                if (response.ok) {
                  navigate("/login/");
                  notificationApi.success({ message: t(data.message) });
                } else {
                  notificationApi.error({ message: t(data.message) });
                }
              });
            }}
            layout="vertical"
            size="large"
            requiredMark={false}
            validateMessages={{ required: t("form.required") }}
          >
            <Form.Item
              name="username"
              rules={[{ required: true }]}
              label={t("loginView.usernameLabel")}
            >
              <Input prefix={<UserOutlined />} />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true },
                {
                  validator: (rule, value) => {
                    if (value.length < 8) {
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
                  message: t("rejects.mustBe8Length"),
                },
                {
                  validator: (rule, value) => {
                    if (value.length > 24) {
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
                  message: t("rejects.mustBe24Long"),
                },
                {
                  validator: (rule, value) => {
                    if (!/\d/.test(value)) {
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
                  message: t("rejects.containOneDigit"),
                },
                {
                  validator: (rule, value) => {
                    if (!/[a-zA-Z]/.test(value)) {
                      return Promise.reject();
                    }
                    return Promise.resolve();
                  },
                  message: t("rejects.containOneLetter"),
                },
              ]}
              label={t("loginView.passwordLabel")}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Form.Item
              name="repeatPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: t("rejects.repeatPassword") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("rejects.repeatPasswordNotEqual")),
                    );
                  },
                }),
              ]}
              label={t("registerView.repeatPassword")}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Flex className={style.linkContainer}>
              <Link to="/register/">
                <LinkAntd>{t("registerView.login")}</LinkAntd>
              </Link>
            </Flex>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t("registerView.register")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
