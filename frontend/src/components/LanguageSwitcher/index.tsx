import { Select } from "antd";
import { useTranslation } from "react-i18next";
import { GlobalOutlined } from "@ant-design/icons";
export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
    localStorage.setItem("language", value);
  };
  const currentLanguage = localStorage.getItem("language") || "uk";
  return (
    <Select
      value={currentLanguage}
      onChange={handleLanguageChange}
      style={{ width: 120 }}
      suffixIcon={<GlobalOutlined />}
      options={[
        { value: "uk", label: t("common.ukrainian") },
        { value: "us", label: t("common.english") },
      ]}
    />
  );
};
