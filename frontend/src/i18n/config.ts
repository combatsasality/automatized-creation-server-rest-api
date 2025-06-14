import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { us, uk } from "./localization";

const savedLanguage = localStorage.getItem("language") || "uk";

i18next.use(initReactI18next).init({
  lng: savedLanguage,
  fallbackLng: "uk",
  resources: { ...us, ...uk },
  interpolation: {
    escapeValue: false,
  },
});

export default i18next;
