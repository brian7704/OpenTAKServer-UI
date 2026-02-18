import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: [
    "en",
    "de",
    "fr",
    "es",
    "pt",
    "uk",
    "da",
    "ko",
    "pl",
    "pt_BR",
    "jp",
    "el",
    "it",
    "ar",
    "nl"
  ],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json"
  }
});
