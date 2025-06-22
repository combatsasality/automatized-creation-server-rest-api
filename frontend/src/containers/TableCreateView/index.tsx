import { useTranslation } from "react-i18next";
import style from "./TableCreateView.module.css";
import {
  Form,
  Typography,
  Input,
  Button,
  Transfer,
  Flex,
  Menu,
  MenuProps,
  Select,
  Checkbox,
} from "antd";
import { Key, useEffect, useState } from "react";
import { PlusCircleOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, useOutletContext } from "react-router";

const { Title } = Typography;

type MenuItem = Required<MenuProps>["items"][number];

interface FieldType {
  key: string;
  name: string;
  type: string;
  isCanBeNull: boolean;
  isUnique: boolean;
}

export const TableCreateView = () => {
  const { t } = useTranslation();
  const [transferTargetKeys, setTransferTargetKeys] = useState<Key[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>("field");
  const navigate = useNavigate();
  const [menuOptions, setMenuOptions] = useState<MenuItem[]>([
    {
      key: "field",
      label: "Field",
    },
  ]);
  const [data, setData] = useState<FieldType[]>([
    {
      key: "field",
      name: "Field",
      type: "TEXT",
      isCanBeNull: true,
      isUnique: false,
    },
  ]);
  const [fieldForm] = Form.useForm();
  const [mainForm] = Form.useForm();
  const { notificationApi } = useOutletContext<OutletProps>();

  const handleMenuClick = (e: { key: string }) => {
    setSelectedKey(e.key);
    const selectedField = data.find((field) => field.key === e.key);
    if (selectedField) {
      fieldForm.setFieldsValue({
        name: selectedField.name,
        type: selectedField.type,
        isCanBeNull: selectedField.isCanBeNull,
        isUnique: selectedField.isUnique,
      });
    }
  };

  const handleAddField = () => {
    const newFieldKey = `field_${Date.now()}`;
    const newField: FieldType = {
      key: newFieldKey,
      name: `Field ${data.length + 1}`,
      type: "TEXT",
      isCanBeNull: true,
      isUnique: false,
    };

    setData((prev) => [...prev, newField]);
    setMenuOptions((prev) => [
      ...prev,
      {
        key: newFieldKey,
        label: newField.name,
      },
    ]);
    setSelectedKey(newFieldKey);

    fieldForm.setFieldsValue({
      name: newField.name,
      type: newField.type,
      isCanBeNull: newField.isCanBeNull,
      isUnique: newField.isUnique,
    });
  };

  const handleDeleteField = () => {
    if (data.length <= 1) return;

    const updatedData = data.filter((field) => field.key !== selectedKey);
    const updatedMenuOptions = menuOptions.filter(
      (option) => option && option.key !== selectedKey,
    );

    setData(updatedData);
    setMenuOptions(updatedMenuOptions);

    const firstRemainingField = updatedData[0];
    setSelectedKey(firstRemainingField.key);

    fieldForm.setFieldsValue({
      name: firstRemainingField.name,
      type: firstRemainingField.type,
      isCanBeNull: firstRemainingField.isCanBeNull,
      isUnique: firstRemainingField.isUnique,
    });
  };

  const handleFieldChange = () => {
    const values = fieldForm.getFieldsValue();
    setData((prev) =>
      prev.map((field) =>
        field.key === selectedKey ? { ...field, ...values } : field,
      ),
    );

    if (values.name) {
      setMenuOptions((prev) =>
        prev.map((option) =>
          option && option.key === selectedKey
            ? { ...option, label: values.name }
            : option,
        ),
      );
    }
  };

  const validateFields = () => {
    const emptyFields = data.filter((field) => !field.name || !field.type);
    if (emptyFields.length > 0) {
      notificationApi.error({ message: t("rejects.fieldsNotFilled") });
      return false;
    }
    return true;
  };

  const handleSubmit = (values: any) => {
    if (!validateFields()) {
      return;
    }

    const tableData = {
      tableName: values.tableName,
      methods: transferTargetKeys,
      fields: data,
    };

    fetch(`${process.env.PUBLIC_SITE_URL}/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(tableData),
    })
      .then(async (response) => {
        const json = await response.json();
        if (response.ok) {
          notificationApi.success({ message: t("tableCreateView.createSuccess") });
          fieldForm.resetFields();
          mainForm.resetFields();
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
    if (data.length > 0) {
      const firstField = data[0];
      fieldForm.setFieldsValue({
        name: firstField.name,
        type: firstField.type,
        isCanBeNull: firstField.isCanBeNull,
        isUnique: firstField.isUnique,
      });
    }
  }, []);

  return (
    <div className={style.container}>
      <Title level={3}>{t("tableCreateView.createHeader")}</Title>
      <Form
        layout="vertical"
        requiredMark={false}
        className={style.form}
        onFinish={(values) => handleSubmit(values)}
        form={mainForm}
      >
        <Form.Item
          label={t("tableCreateView.tableName")}
          name="tableName"
          rules={[{ required: true, message: t("rejects.tableNameRequired") }]}
        >
          <Input placeholder={t("tableCreateView.tableName")} />
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
          <div className={style.fieldContainer}>
            <Flex align="center">
              <Menu
                selectedKeys={[selectedKey]}
                onClick={handleMenuClick}
                items={menuOptions}
                mode="horizontal"
                className={style.menu}
              />
              <Button
                size="large"
                type="text"
                icon={<PlusCircleOutlined />}
                onClick={handleAddField}
              />
              <Button
                size="large"
                type="text"
                icon={<DeleteOutlined />}
                onClick={handleDeleteField}
                disabled={data.length <= 1}
                danger
              />
            </Flex>
            <Form layout="vertical" form={fieldForm} onValuesChange={handleFieldChange}>
              <Form.Item name="name" label={t("tableCreateView.fieldName")}>
                <Input placeholder={t("tableCreateView.fieldName")} />
              </Form.Item>
              <Form.Item name="type" label={t("tableCreateView.fieldType")}>
                <Select
                  options={[
                    { label: "TEXT", value: "TEXT" },
                    { label: "INT", value: "INT" },
                    { label: "BOOLEAN", value: "BOOLEAN" },
                    { label: "NUMERIC", value: "NUMERIC" },
                  ]}
                  placeholder={t("tableCreateView.fieldType")}
                />
              </Form.Item>
              <Form.Item name="isCanBeNull">
                <Checkbox>{t("tableCreateView.isCanBeNull")}</Checkbox>
              </Form.Item>
              <Form.Item name="isUnique">
                <Checkbox>{t("tableCreateView.isUnique")}</Checkbox>
              </Form.Item>
            </Form>
          </div>
        </Flex>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("tableCreateView.create")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
