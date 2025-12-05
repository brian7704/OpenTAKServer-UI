import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpApi from 'i18next-http-backend';
import LanguageDetector from "i18next-browser-languagedetector"

i18n
    .use(initReactI18next)
    .use(HttpApi)
    .use(LanguageDetector)
    .init({
        fallbackLng: "en",
        returnEmptyString: false,
        debug: true,
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        }
    });

export default i18n;
