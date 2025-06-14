import { useTranslation } from "react-i18next";
import style from "./TableInfoView.module.css";
import { Form, Typography, Input, Button, Transfer, Flex, Spin } from "antd";
import { Key, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";

const { Title } = Typography;

interface FieldType {
  key: string;
  name: string;
  type: string;
  isCanBeNull: boolean;
  isUnique: boolean;
}

interface TableInfo {
  name: string;
  availableMethods: string[];
  fields: FieldType[];
}

export const TableInfoView = () => {
  const { t } = useTranslation();
  const { tableName } = useParams();
  const [transferTargetKeys, setTransferTargetKeys] = useState<Key[]>([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mainForm] = Form.useForm();
  const { notificationApi } = useOutletContext<OutletProps>();

  const fetchTableInfo = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.PUBLIC_SITE_URL}/sql/name?tableName=${tableName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.ok) {
        const tableInfo: TableInfo = (await response.json())["data"];

        mainForm.setFieldsValue({
          tableName: tableInfo.name.split("__")[0] || "Test",
        });

        setTransferTargetKeys(tableInfo.availableMethods || []);
      } else {
        const error = await response.json();
        notificationApi.error({
          message: error.message || t("rejects.internalServerError"),
        });
      }
    } catch (error) {
      console.error("Error fetching table info:", error);
      notificationApi.error({ message: t("rejects.internalServerError") });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values: any) => {
    const tableData = {
      tableName: values.tableName,
      methods: transferTargetKeys,
    };

    fetch(`${process.env.PUBLIC_SITE_URL}/sql`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(tableData),
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          notificationApi.success({ message: t("tableInfoView.updateSuccess") });
          navigate("/table/");
          return json;
        } else {
          throw new Error(json.message || t("rejects.internalServerError"));
        }
      })
      .catch((error) => {
        notificationApi.error({ message: error.message });
      });
  };

  useEffect(() => {
    if (tableName) {
      fetchTableInfo();
    }
  }, [tableName]);

  if (loading) {
    return (
      <div className={style.container}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={style.container}>
      <Title level={3}>{t("tableInfoView.editHeader")}</Title>
      <Form
        form={mainForm}
        layout="vertical"
        requiredMark={false}
        className={style.form}
        onFinish={handleSubmit}
        onFinishFailed={(errorInfo) => {
          console.error("Failed:", errorInfo);
        }}
      >
        <Form.Item
          label={t("tableCreateView.tableName")}
          name="tableName"
          rules={[{ required: true, message: t("rejects.tableNameRequired") }]}
        >
          <Input placeholder={t("tableCreateView.tableName")} disabled />
        </Form.Item>
        <Flex>
          <Form.Item
            label={t("tableCreateView.methods")}
            name="methods"
            rules={[{ required: true, message: t("rejects.methodsRequired") }]}
          >
            <Transfer
              titles={[t("tableCreateView.available"), t("tableCreateView.selected")]}
              dataSource={[
                { key: "GET", title: "GET" },
                { key: "POST", title: "POST" },
                { key: "DELETE", title: "DELETE" },
              ]}
              targetKeys={transferTargetKeys}
              render={(item) => item.title}
              onChange={(nextTargetKeys) => setTransferTargetKeys(nextTargetKeys)}
            />
          </Form.Item>
        </Flex>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("tableInfoView.update")}
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => navigate("/table/")}>
            {t("common.cancel")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
