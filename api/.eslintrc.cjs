module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['prettier', 'eslint:recommended'],
  plugins: ['prettier', 'no-only-tests'],
  env: {
    browser: false,
    es6: true,
    node: true,
    jest: false,
  },
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'src'],
      },
    },
  },
  rules: {
    'prettier/prettier': 'error',
    'no-only-tests/no-only-tests': 'error',
  },
}
