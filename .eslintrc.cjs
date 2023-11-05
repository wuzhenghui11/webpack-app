module.exports = {
  root: true,
  // 启用node中和浏览器中全局变量
  env: {
    node: true,
    browser: true,
    es2020: true,
    commonjs: true,
  },
  globals: {
    vx: 'readonly',
  },
  /** */
  // plugin:vue/vue3-essential 需要使用eslint-plugin-vue
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended'],
  parserOptions: {
    // parser: '@typescript-eslint/parser', // - 将 TypeScript 转换为 ESTree 兼容形式的解析器，以便它可以在 ESLint 中使用。
    parser: '@babel/eslint-parser', //  - Babel 解析器的封装器，使其与 ESLint 兼容。
    requireConfigFile: false,
    ecmaVersion: 'latest',
    sourceType: 'module',
    /* ecmaFeatures: {
      jsx: true
    } */
  },
  rules: {
    'quotes': 0,
    'semi': 0,
    'no-unused-vars': 1,
    'no-undef': 1,
    // "no-console": process.env.NODE_ENV === "production" ? "error" : "off",
    // "no-debugger": process.env.NODE_ENV === "production" ? "error" : "off"
  },
  // plugins: ['import'],
}
