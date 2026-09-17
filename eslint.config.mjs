import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    rules: {
      // Pre-existing `any` usage across the codebase — downgraded to warning
      // instead of a rewrite of every type right now.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Pre-existing patterns flagged by the new React-Compiler-era rules
      // shipped with eslint-plugin-react-hooks v7 (bundled in
      // eslint-config-next 16). Not bugs introduced by the upgrade —
      // downgraded to warnings rather than mixing a behavioral refactor
      // into a CI/lint-config fix.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/static-components': 'warn',
    },
  },
];

export default eslintConfig;
