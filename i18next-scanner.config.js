const fs = require("fs");

module.exports = {
  input: [
    "app/**/*.{js,jsx}",
    // Use ! to filter out files or directories
    "!app/**/*.spec.{js,tsx}",
    "!app/i18n/**",
    "!**/node_modules/**",
  ],
  output: "./public",
  options: {
    debug: true,
    func: {
      list: ["i18next.t", "i18n.t"],
      extensions: [".js", ".jsx"],
    },
    trans: {
      component: "Trans",
      i18nKey: "i18nKey",
      defaultsKey: "defaults",
      extensions: [".js", ".jsx"],
      fallbackKey: function (ns, value) {
        return value;
      },
      acorn: {
        ecmaVersion: 2020,
        sourceType: "module", // defaults to 'module'
        // Check out https://github.com/acornjs/acorn/tree/master/acorn#interface for additional options
      },
    },
    lngs: ["en", "vi"],
    ns: ["locale", "resource"],
    defaultLng: "en",
    defaultNs: "resource",
    defaultValue: "__STRING_NOT_TRANSLATED__",
    resource: {
      loadPath: "locales/{{lng}}/{{ns}}.json",
      savePath: "locales/{{lng}}/{{ns}}.json",
      jsonIndent: 2,
      lineEnding: "\n",
    },
    nsSeparator: false, // namespace separator
    keySeparator: false, // key separator
    interpolation: {
      prefix: "{{",
      suffix: "}}",
    },
  },
  transform: function customTransform(file, enc, done) {
    "use strict";
    const parser = this.parser;
    const content = fs.readFileSync(file.path, enc);
    let count = 0;

    parser.parseFuncFromString(
      content,
      { list: ["t", "i18next.__"] },
      (key, options) => {
        parser.set(
          key,
          Object.assign({}, options, {
            nsSeparator: false,
            keySeparator: false,
          })
        );
        ++count;
      }
    );

    if (count > 0) {
      console.log(
        `i18next-scanner: count=${count}, file=${JSON.stringify(file.relative)}`
      );
    }

    done();
  },
};
