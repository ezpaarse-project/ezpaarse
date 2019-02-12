module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  extends: [
    'plugin:vue/recommended'
  ],
  // add your custom rules here
  rules: {
    // // allow async-await
    // 'generator-star-spacing': 0,
    // // allow debugger during development
    // 'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'comma-dangle': ['error', 'never'],
    'no-param-reassign': ['error', { 'props': false }],
    'space-before-function-paren': ['error', 'always'],
    'no-warning-comments': 1,
    'prefer-const': 2,
    'no-var': 2,
    'prefer-arrow-callback': 2,
    'prefer-template': 1,
    'arrow-parens': 0, // allow paren-less arrow functions
    'no-console': 2, // do not allow console.logs
    'no-multi-spaces': [2, {
      exceptions: {
        VariableDeclarator: true,
        ImportDeclaration: true,
        Property: true
      }
    }]
  },
  globals: {}
}