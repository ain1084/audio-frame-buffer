// @ts-check
import stylistic from '@stylistic/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import tsEslint from 'typescript-eslint'

export default [
  {
    ignores: ['**/dist/*', '**/node_modules/*', '**/docs/*'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: [
          './tsconfig.tests.json',
        ],
      },
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error', { prefer: 'type-imports' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      'max-len': [
        'warn',
        {
          code: 120,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreComments: false,
        },
      ],
    },
  },
  ...tsEslint.configs.recommended,
  stylistic.configs['recommended-flat'],
]
