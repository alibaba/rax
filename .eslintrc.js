/* eslint quotes: false */

module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "mocha": true,
    "jest": true,
    "commonjs": true,
    "amd": true,
  },
  "plugins": [
    "react"
  ],
  "parserOptions": {
    "sourceType": "module",
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "ecmaFeatures": {
    "arrowFunctions": true,
    "blockBindings": true,
    "classes": true,
    "defaultParams": true,
    "destructuring": true,
    "forOf": true,
    "objectLiteralComputedProperties": true,
    "objectLiteralShorthandMethods": true,
    "objectLiteralShorthandProperties": true,
    "spread": true,
    "superInFunctions": true,
    "templateStrings": true
  },
  "globals": {
    "__weex_data__": true,
    "__weex_options__": true,
    "__weex_downgrade__": true,
    "__weex_define__": true,
    "__weee_require__": true,
    "WXEnvironment": true,
    "webkitRequestAnimationFrame": true,
  },
  "parser": "babel-eslint",
  "rules": {
    // ES6
    "prefer-const": "off",
    "no-const-assign": "error",
    "no-class-assign": "error",
    "no-dupe-class-members": "error",
    "rest-spread-spacing": "error",
    "no-duplicate-imports": "error",
    "no-useless-rename": "error",
    "arrow-spacing": "error",
    "no-useless-computed-key": "error",
    "template-curly-spacing": "error",
    "generator-star-spacing": ["error", {"before": false, "after": true}],
    "yield-star-spacing": ["error", {"before": false, "after": true}],
    "strict": ["off", "global"],
    "global-strict": ["off", "always"],
    "no-extra-strict": "off",
    "no-shadow": "off",
    "no-unused-vars": ["off", {
      "vars": "local",
      "args": "after-used",
      "varsIgnorePattern": "createElement"
    }],
    "no-undef": "error",
    "no-unused-expressions": "off",
    "no-use-before-define": "off",
    "yoda": "off",
    "eqeqeq": "off",
    "no-new": "off",
    "consistent-return": "off",
    "dot-notation": ["error", {
      "allowKeywords": true
    }],
    "no-extend-native": "error",
    "no-native-reassign": "error",
    "no-return-assign": "off",
    "no-constant-condition": ["error", {
      "checkLoops": false
    }],
    "no-caller": "error",
    "no-loop-func": "off",

    // Node.js
    "no-console": "off",
    "no-catch-shadow": "error",
    "no-new-require": "off",
    "no-mixed-requires": ["off", false],
    "no-path-concat": "off",
    "handle-callback-err": "off",

    "no-empty": "off",
    "indent": ["error", 2, {
      "SwitchCase": 1
    }],
    "camelcase": ["off", {
      "properties": "always"
    }],
    "quotes": ["error", "single", "avoid-escape"],
    "brace-style": ["error", "1tbs", {
      "allowSingleLine": false
    }],
    "comma-spacing": ["error", {
      "before": false,
      "after": true
    }],
    "comma-style": ["error", "last"],
    "eol-last": "off",
    "func-names": "off",
    "new-cap": ["error", {
      "newIsCap": true
    }],
    "key-spacing": ["error", {
      "beforeColon": false,
      "afterColon": true
    }],
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": "error",
    "no-new-object": "error",
    "no-spaced-func": "error",
    "no-trailing-spaces": "error",
    "no-extra-parens": "error",
    "padded-blocks": ["error", "never"],
    "semi": "error",
    "semi-spacing": "error",
    "keyword-spacing": "error",
    "space-before-blocks": "error",
    "space-before-function-paren": ["error", "never"],
    "space-infix-ops": "error",
    "spaced-comment": ["error", "always", {
      "line": {
        "markers": ["/"],
        "exceptions": ["-", "+"]
      },
      "block": {
        "markers": ["!"],
        "exceptions": ["*"],
        "balanced": true
      }
    }],

    /**
     * React & JSX
     */
    "react/display-name": "off",
    "react/jsx-boolean-value": ["off", "always"],
    "jsx-quotes": ["error", "prefer-double"],
    "react/jsx-no-undef": "error",
    "react/jsx-sort-props": "off",
    "react/jsx-sort-prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "error",
    "react/no-did-mount-set-state": "off",
    "react/no-did-update-set-state": "off",
    "react/no-multi-comp": "off",
    "react/no-unknown-property": "error",
    "react/prop-types": "off",
    "react/no-is-mounted": "error",
    "react/react-in-jsx-scope": "off",
    "react/self-closing-comp": "error",
    "react/jsx-wrap-multilines": "off",
    "react/sort-comp": ["off", {
      "order": [
        "lifecycle",
        "/^on.+$/",
        "/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/",
        "everything-else",
        "/^render.+$/",
        "render"
      ]
    }]
  }
};
