import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import vitestPlugin from 'eslint-plugin-vitest'

export default [
  {
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...vitestPlugin.environments.env.globals,
      },
      parser: tsParser,
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      '@stylistic': stylistic,
      'vitest': vitestPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      ...vitestPlugin.configs.recommended.rules,
      'no-console': 'error',
      'prefer-const': 'error',
      'sort-imports': 'error',
      'vitest/expect-expect': [
        'error',
        {
          'assertFunctionNames': ['expect', 'expectValid', 'expectInvalid', 'expectTypeOf'],
        },
      ],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/member-delimiter-style': ['error', {
        'multiline': {
          'delimiter': 'comma',
          'requireLast': true,
        },
        'singleline': {
          'delimiter': 'comma',
          'requireLast': false,
        },
        'multilineDetection': 'brackets',
      }],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
    },
  },
]
