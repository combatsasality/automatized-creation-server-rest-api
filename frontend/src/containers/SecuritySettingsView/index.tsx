import { Button, Form, Input } from "antd";
import { ProfileLayout } from "../../components/ProfileLayout";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";

export const SecuritySettingsView = () => {
  const { t } = useTranslation();
  const { notificationApi } = useOutletContext<OutletProps>();
  const [form] = Form.useForm();
  return (
    <ProfileLayout selectedKey="security">
      <Form
        form={form}
        layout="vertical"
        validateMessages={{ required: t("form.required") }}
        requiredMark={false}
        onFinish={(values) => {
          fetch(`${process.env.PUBLIC_SITE_URL}/api/me`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          }).then(async (response) => {
            const data: ApiResponse = await response.json();
            if (response.ok) {
              notificationApi.success({ message: t(data.message) });
              form.resetFields();
            } else {
              notificationApi.error({ message: t(data.message) });
            }
          });
        }}
      >
        <Form.Item
          name="oldPassword"
          rules={[{ required: true }]}
          label={t("profileLayout.oldPassword")}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="newPassword"
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
          label={t("profileLayout.newPassword")}
        >
          <Input.Password />
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
                return Promise.reject(new Error(t("rejects.repeatPasswordNotEqual")));
              },
            }),
          ]}
          label={t("profileLayout.repeatPassword")}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("profileLayout.changePassword")}
          </Button>
        </Form.Item>
      </Form>
    </ProfileLayout>
  );
};
