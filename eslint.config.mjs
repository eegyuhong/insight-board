import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // next 관련 설정 유지
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // 직접 스타일 규칙 추가
  {
    rules: {
      indent: ['error', 2],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'always-multiline'],
      'object-curly-spacing': ['error', 'always'],
      'arrow-parens': ['error', 'always'],
      'eol-last': ['error', 'always'],
      // 'max-len': ['error', { code: 80 }],
    },
  },
];

export default eslintConfig;
