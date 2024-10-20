module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'import/no-unresolved': ['off'],
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: false,
      },
    ],
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/restrict-template-expressions': ['warn'],
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    quotes: ['error', 'single'],
    'max-len': ['warn', { code: 200 }],
    'no-console': 'off',
    'no-empty': 'off',
    'no-duplicate-imports': 'error',
    '@typescript-eslint/ban-ts-ignore': 'off',
    camelcase: ['warn'],
    eqeqeq: ['warn'],
    radix: ['warn'],
    'no-implicit-globals': 'error',
    'newline-per-chained-call': ['warn'],
    'newline-before-return': 'error',
    'no-restricted-syntax': ['warn'],
    'no-param-reassign': ['error', { props: false }],
    'camelcase': 'off',
  },
  overrides: [
    {
      files: ['*.controller.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['off'],
        '@typescript-eslint/explicit-module-boundary-types': ['off'],
      },
    },
  ],
};
