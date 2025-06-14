import { Button, Table, TableProps } from "antd";
import { Key, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate, useOutletContext } from "react-router";

import style from "./TableView.module.css";

export const TableView = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<TableApi[]>([]);
  const { notificationApi } = useOutletContext<OutletProps>();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  const updateData = () => {
    fetch(`${process.env.PUBLIC_SITE_URL}/sql` || "", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then(async (response) => {
      const json: ApiResponse = await response.json();
      if (response.ok) {
        setData(json.data as TableApi[]);
      } else {
        notificationApi.error({ message: "Internal server error" });
      }
    });
  };

  useEffect(() => {
    updateData();
  }, [location.pathname]);

  const columns: TableProps<TableApi>["columns"] = [
    {
      title: t("tableView.name"),
      dataIndex: "tableName",
      key: "tableName",
    },
    {
      title: t("tableView.methods"),
      dataIndex: "methods",
      key: "path",
      render: (value) => value.join(", "),
    },
    {
      title: t("tableView.path"),
      dataIndex: "path",
      key: "path",
    },
  ];

  return (
    <div className={style.container}>
      <div className={style.buttons}>
        <Button type="primary" onClick={() => navigate("create/")}>
          {t("tableView.add")}
        </Button>
        <Button
          onClick={() => {
            if (selectedRowKeys.length === 0)
              return notificationApi.error({ message: t("tableView.emptyRows") });

            fetch(`${process.env.PUBLIC_SITE_URL}/sql`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(selectedRowKeys),
            })
              .then(async (response) => {
                const json: ApiResponse = await response.json();
                if (response.ok) {
                  setData((prev) =>
                    prev.filter((item) => !selectedRowKeys.includes(item.tableName)),
                  );
                  notificationApi.success({ message: t("api.tableDeleted") });
                } else {
                  notificationApi.error({
                    message: json.message || t("api.internalError"),
                  });
                }
              })
              .catch(() => notificationApi.error({ message: t("api.internalError") }));
          }}
        >
          {t("tableView.delete")}
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey={(rec) => rec.tableName}
        onRow={(record) => ({
          onClick: () => {
            navigate(`/table/${record.tableName}/`);
          },
        })}
        rowSelection={{
          type: "checkbox",
          onChange: (rows) => setSelectedRowKeys(rows),
        }}
      />
    </div>
  );
};
