/** @type {import('prettier').Config} */
export default {
  trailingComma: 'all',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: true,
  arrowParens: 'avoid',
  printWidth: 100,
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  importOrderCaseInsensitive: true,
  importOrderParserPlugins: ['classProperties', 'decorators-legacy', 'typescript', 'jsx'],
  importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^../(.*)', '^./(.*)'],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
};
