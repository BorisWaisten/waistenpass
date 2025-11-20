import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';
import pluginN from 'eslint-plugin-n';
import pluginPromise from 'eslint-plugin-promise';

export default tseslint.config(
  {
    ignores: ['dist/**']
  },
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    settings: {
      'import/resolver': {
        typescript: true
      }
    },
    plugins: {
      import: pluginImport,
      n: pluginN,
      promise: pluginPromise
    },
    rules: {
      ...pluginImport.configs.recommended.rules,
      ...pluginN.configs['flat/mixed-esm-and-cjs'].rules,
      ...pluginPromise.configs.recommended.rules
    }
  }
);
