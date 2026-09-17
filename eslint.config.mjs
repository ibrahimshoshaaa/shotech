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
      // Pre-existing hydration-guard idiom (setBusy(false) after mount) that
      // eslint-plugin-react-hooks v7 (shipped with eslint-config-next 16) now
      // flags. Not a bug introduced by the upgrade.
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];

export default eslintConfig;
