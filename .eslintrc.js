module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    requireConfigFile: false,
  },
  rules: {
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'import/prefer-default-export': 'off',
    'no-param-reassign': ['error', { props: false }],
    'class-methods-use-this': 'off',
  },
};
