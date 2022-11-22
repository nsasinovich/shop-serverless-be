module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  env: { node: true },
  ignorePatterns: ['**/*.js', 'serverless.ts'],
  rules: {
    'no-duplicate-imports': 'error',
    'comma-dangle': ['warn', 'always-multiline'],
    'prefer-const': 'warn',
    'no-multi-spaces': 'warn',
    'no-else-return': 'warn',
    'eol-last': ['warn', 'always'],
    'object-curly-spacing': ['error', 'always'],
    quotes: ['warn', 'single'],
    'no-use-before-define': [
      'error',
      {
        functions: false,
        classes: false,
      },
    ],
  },
};
