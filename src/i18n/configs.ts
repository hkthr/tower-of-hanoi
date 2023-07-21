import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { z } from "zod";
import { zodI18nMap } from "zod-i18n-map";
import messages_ja from "zod-i18n-map/locales/ja/zod.json";

// 言語jsonファイルのimport
import translation_en from "./en.json";
import translation_ja from "./ja.json";

const resources = {
  ja: {
    translation: translation_ja,
    zod: messages_ja,
  },
  en: {
    translation: translation_en
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

z.setErrorMap(zodI18nMap);
export default i18n;

