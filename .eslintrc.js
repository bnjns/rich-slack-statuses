module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    '@typescript-eslint'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    eqeqeq: ['error', 'smart'],
    curly: ['error'],
    camelcase: ['error'],
    'no-unused-vars': 'warn',
    'max-len': ['warn', { code: 2000, ignoreUrls: true }],
    'space-before-function-paren': ['warn', 'never'],
    ident: 'off',
    'object-curly-spacing': ['warn', 'always'],
    'array-bracket-spacing': ['warn', 'never'],
    'no-trailing-spaces': 'off',
    'no-multiple-empty-lines': 'warn',
    'comma-dangle': 'warn',
    'template-curly-spacing': 'warn',
    'padded-blocks': 'warn',
    '@typescript-eslint/indent': ['warn', 2],
    '@typescript-eslint/ban-ts-comment': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/member-delimiter-style': [
      'warn', {
        multiline: {
          delimiter: 'none'
        },
        singleline: {
          delimiter: 'semi'
        }
      }
    ]
  },
  overrides: [
    {
      files: [
        '**/tests/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    }
  ]
}
