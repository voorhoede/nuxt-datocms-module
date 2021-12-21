module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    '@nuxtjs',
  ],
  parserOptions: {
    ecmaVersion: 13,
    parser: '@babel/eslint-parser',
    sourceType: 'module',
  },
  plugins: [
    'vue',
  ],
  rules: {
    semi: ['warn', 'always'],
    indent: ['warn', 2, { SwitchCase: 1 }],
    quotes: ['warn', 'single'],
    'comma-dangle': ['warn', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
    }],
    'no-shadow': 0,
    'no-use-before-define': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'vue/multi-word-component-names': 0,
  },
};
