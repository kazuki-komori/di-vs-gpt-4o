import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import prettierPlugin from "eslint-plugin-prettier"
import unusedImportPlugin from "eslint-plugin-unused-imports"
import importPlugin from "eslint-plugin-import"

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "prettier": prettierPlugin,
      "unused-imports": unusedImportPlugin,
      "import": importPlugin,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      // ダブルクォートを強制
      "quotes": ["error", "double"],
      "@typescript-eslint/quotes": "off",
      // 使っていない import をエラー
      "unused-imports/no-unused-imports": "error",
      // import の並べ替え
      "import/order": [
        "error",
        {
        // 並べ替えするグループ
        "groups": ["builtin", "external", "parent", "sibling", "index", "object", "type"],
        // path グループから排除する対象
        "pathGroupsExcludedImportTypes": ["builtin"],
        // アルファベット順
        "alphabetize": {
          "order": "asc"
        },
        // グループごとに改行
        "newlines-between": "always"
      }],
      // 括弧の前後は空白
      "object-curly-spacing": ["error", "always"],
      // ファイルの最終行は改行
      "eol-last": ["error", "always"],
      // セミコロンは書かない
      "prettier/prettier": ["error", { "printWidth": 80, "semi": false }],
     //  white true を許可
     "no-constant-condition": ["error", { "checkLoops": false }],
    },
  },
)
