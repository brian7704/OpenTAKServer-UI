import i18n from "i18next";
import {initReactI18next} from "react-i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: ["en", "de", "fr", "es", "pt", "uk", "da", "ko", "pl", "nl", "sv", "th", "zh_Hans"],
        fallbackLng: "en",
        returnEmptyString: false,
        debug: false,
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        }
    });

export default i18n;
