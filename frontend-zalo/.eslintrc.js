module.exports = {
    root: true,
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb",
        "prettier",
    ],

    // Nạp plugin react-hooks để các chỉ thị eslint-disable react-hooks/* hợp lệ
    // (rule có sẵn nhưng không bật mặc định → không phát sinh cảnh báo mới).
    plugins: ["react-hooks"],

    rules: {
        // General rules
        "no-console": ["warn", { allow: ["warn", "error"] }],
        "no-debugger": "warn",

        // React rules
        "react/prop-types": "off", // Disable prop-types as we use TypeScript
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",

        // TypeScript rules
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "off",

        // Airbnb specific overrides
        "import/extensions": "off",
        "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
        "import/prefer-default-export": "off",
        "no-useless-catch": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "error",
        "react/function-component-definition": "off",
        "react/require-default-props": "off",
        "no-use-before-define": "off",
        "react/jsx-props-no-spreading": "off",
        "react/no-array-index-key": "warn",
        // twin.macro dùng prop `tw` (được babel-plugin-macros xử lý) — hợp lệ.
        "react/no-unknown-property": ["error", { ignore: ["tw"] }],
    },
    overrides: [
        {
            // File test được phép import devDependencies (vitest…).
            files: ["**/*.test.{ts,tsx,js,jsx}", "**/*.spec.{ts,tsx,js,jsx}"],
            rules: { "import/no-extraneous-dependencies": "off" },
        },
    ],
    settings: {
        "import/resolver": {
            typescript: {},
        },
    },
};
