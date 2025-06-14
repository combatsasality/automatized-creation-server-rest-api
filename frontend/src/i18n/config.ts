import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import { us, uk } from "./localization";

i18next.use(initReactI18next).init({
  lng: "us",

  resources: { ...us, ...uk },
});
