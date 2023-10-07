module.exports = {
  root: true,
  extends: 'stylelint-config-standard',
  rules: {
    'at-rule-empty-line-before': null,
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'function',
          'if',
          'else',
          'return',
          'each',
          'include',
          'mixin',
          'define-mixin',
          'tailwind',
          'apply',
          'at-root',
          'use',
          'screen',
        ],
      },
    ],
    'declaration-empty-line-before': null,
    'rule-empty-line-before': null,
    'selector-list-comma-newline-after': null,
  },
};
