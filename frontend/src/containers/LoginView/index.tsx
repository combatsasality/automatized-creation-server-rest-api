import { Button, Checkbox, Flex, Form, Input, Radio, Typography } from "antd";
import style from "./LoginView.module.css";
import { useTranslation } from "react-i18next";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useNavigate, useOutletContext } from "react-router";
import { useEffect, useState } from "react";

const { Title, Link: LinkAntd } = Typography;

export const LoginView = () => {
  const { t } = useTranslation();
  const { notificationApi } = useOutletContext<OutletProps>();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue("username", localStorage.getItem("username"));
  }, []);

  return (
    <div className={style.container}>
      <div className={style.innerContainer}>
        <div className={style.header}>
          <Title level={2}>{t("loginView.loginHeader")}</Title>
        </div>
        <div className={style.form}>
          <Form
            form={form}
            onFinish={(values) => {
              fetch(`${process.env.PUBLIC_SITE_URL}/api/users/login` || "", {
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
                  if (data.data) {
                    localStorage.setItem("token", data.data);
                    if (rememberMe) {
                      localStorage.setItem("username", values.username);
                    } else {
                      localStorage.removeItem("username");
                    }
                  }
                  navigate("/");
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
              rules={[{ required: true }]}
              label={t("loginView.passwordLabel")}
            >
              <Input.Password prefix={<LockOutlined />} />
            </Form.Item>
            <Flex className={style.linkContainer}>
              <Checkbox
                style={{ height: "20px" }}
                onChange={(e) => setRememberMe(e.target.checked)}
              >
                {t("loginView.rememberMe")}
              </Checkbox>
              <Link to="/register/">
                <LinkAntd>{t("loginView.register")}</LinkAntd>
              </Link>
            </Flex>
            <Form.Item>
              <Button type="primary" htmlType="submit" block>
                {t("loginView.login")}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
