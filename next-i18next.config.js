const I18NextHttpBackend = require("i18next-http-backend");
/**
 * @type {import('next-i18next').UserConfig}
 */
module.exports = {
  debug: process.env.NODE_ENV === "development",
  i18n: {
    locales: ["default", "en", "vi"],
    defaultLocale: "default",

    backend: {
      // TODO: Fallback value when cannot load translation from backend
      loadPath: `http://127.0.0.1:3000/locales/{{lng}}/{{ns}}`,
    },
  },
  localeDetection: false,
  ns: ["common", "user", "post", "login"],
  // localePath:
  //   typeof window === "undefined"
  //     ? require("path").resolve("./public/locales")
  //     : "/locales",
  serializeConfig: false,
  reloadOnPrerender: process.env.NODE_ENV === "development",
  use: [I18NextHttpBackend],
};
