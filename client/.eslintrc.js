module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['react-app', 'prettier', 'eslint:recommended'],
  plugins: ['prettier'],
  env: {
    browser: true,
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
    'no-debugger': process.env.NODE_ENV === 'development' ? 'warn' : 'error',
  },
  ignorePatterns: ['node_modules/**', 'build/**'],
}
