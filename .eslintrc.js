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
    'import/no-unresolved': ['off'], // Ensures an imported module can be resolved to a module on the local filesystem
    '@typescript-eslint/no-empty-interface': [
      'error',
      {
        allowSingleExtends: false,
      },
    ],
    '@typescript-eslint/explicit-function-return-type': ['warn'],
    '@typescript-eslint/explicit-module-boundary-types': ['warn'],
    '@typescript-eslint/no-explicit-any': ['warn'],
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/no-unused-vars': ['warn'],
    '@typescript-eslint/restrict-template-expressions': ['warn'],

    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variableLike', // matches the same as variable, function and parameter
        format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
      },
      {
        selector: 'memberLike', //matches the same as property, parameterProperty, method, accessor, enumMember with type: none
        format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
        leadingUnderscore: 'forbid',
      },
      {
        selector: 'typeLike', //matches the same as class, interface, typeAlias, enum, typeParameter ( abstract, unused)
        format: ['PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'property', // classProperty, objectLiteralProperty, typeProperty with type types: boolean, string, number, function, array
        modifiers: ['readonly'],
        format: ['PascalCase', 'camelCase', 'UPPER_CASE', 'snake_case'],
      },
    ],
    '@typescript-eslint/no-redeclare': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    quotes: ['error', 'single'],
    'max-len': ['error', { code: 200 }],
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
