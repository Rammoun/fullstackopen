import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {ignores: ['dist']},

  // --- CONFIG OBJECT 1: Base setup for ALL files ---
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {jsx: true},
        sourceType: 'module'
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', {varsIgnorePattern: '^[A-Z_]'}],
      'react-refresh/only-export-components': [
        'warn',
        {allowConstantExport: true}
      ],
      indent: ['error', 2],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'never'],
      'no-trailing-spaces': 'error',
      'object-curly-spacing': ['error', 'never'],
      'eqeqeq': 'error',
      'no-console': 'off',
      'curly': ['error', 'multi-or-nest', 'consistent'],
      'brace-style': ['error', '1tbs', {'allowSingleLine': true}],
      'arrow-spacing': 'off',
      'space-infix-ops': 'off',
      'keyword-spacing': 'off'
    }
  },

  // --- CONFIG OBJECT 2: Overrides specifically for TEST files ---
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.vitest
      }
    }
  }
]