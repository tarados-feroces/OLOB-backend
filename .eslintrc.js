module.exports = {
    plugins: [
        'no-unsafe-regex' // защита от экспоненциального потребления вычислительных ресурсов
    ],
    env: {
        es6: true,
        commonjs: true
    },
    parserOptions: {
        ecmaVersion: 8,
        "sourceType": "module",
    },
    globals: {
        console: false,
        Uint8Array: false
    },
    rules: {
        semi: [2, 'always', { omitLastInOneLineBlock: true }],
        'semi-spacing': [2, { before: false, after: true }],
        'wrap-iife': [2, 'inside'],
        'no-use-before-define': [2, 'nofunc'],
        'no-caller': 2,
        'no-cond-assign': [2, 'except-parens'],
        'no-constant-condition': 2,
        'no-debugger': 2,
        'no-dupe-args': 2,
        'no-dupe-keys': 2,
        'no-duplicate-case': 2,
        'no-empty': [2, { allowEmptyCatch: true }],
        'no-extra-boolean-cast': 2,
        'no-extra-semi': 2,
        'no-func-assign': 2,
        'no-sparse-arrays': 2,
        'no-undef': 2,
        'no-unexpected-multiline': 2,
        'no-unreachable': 2,
        'no-unused-vars': [
            2,
            {
                vars: 'all',
                args: 'none'
            }
        ],
        strict: 0,
        'max-params': [2, 5],
        'max-depth': [2, 4],
        'no-eq-null': 0,
        'no-unused-expressions': 0,
        'dot-notation': 0,
        'use-isnan': 2,

        // Best practices
        'block-scoped-var': 2,
        complexity: [2, { max: 30 }],
        curly: [2, 'multi-line'],
        eqeqeq: [2, 'always', { null: 'ignore' }],
        'no-extra-bind': 2,
        'no-implicit-coercion': 2,
        'no-return-assign': 0,
        'no-sequences': 2,
        yoda: 2,

        // Variables
        'no-restricted-globals': [2, 'fdescribe', 'fit'],

        // RegExp
        'no-unsafe-regex/no-unsafe-regex': 2, // Запрещаем опасные регулярки, которые могут жрать ресурсы

        // Codestyle
        'arrow-parens': [2, 'always'],
        'array-bracket-spacing': [2, 'never'],
        'brace-style': [2, '1tbs', { allowSingleLine: true }],
        camelcase: [2, { properties: 'never' }],
        'comma-dangle': [2, 'never'],
        'comma-spacing': [2, { before: false, after: true }],
        'eol-last': 2,
        'func-call-spacing': 2,
        'keyword-spacing': [2, { before: true, after: true }],
        'max-len': [2, {
            code: 120,
            ignoreUrls: true,
            ignoreRegExpLiterals: true,
            ignoreTemplateLiterals: true,
            ignoreStrings: true,
            ignoreComments: true,
            ignorePattern: 'require'
        }],
        'no-lonely-if': 2,
        'no-mixed-spaces-and-tabs': 2,
        'no-multi-spaces': 2,
        'no-multiple-empty-lines': [2, { max: 1, maxBOF: 0, maxEOF: 0 }],
        'no-trailing-spaces': 2,
        'no-unneeded-ternary': 2,
        'object-curly-spacing': [2, 'always'],
        'one-var-declaration-per-line': [2, 'initializations'],
        'operator-linebreak': [2, 'after'],
        'padded-blocks': [2, 'never'],
        'quote-props': [2, 'as-needed', { numbers: true }],
        quotes: [2, 'single', { avoidEscape: true }],
        'space-before-blocks': [2, 'always'],
        'space-in-parens': 2,
        'no-console': [2, { allow: ['assert', 'error', 'warn', 'log'] }],
        'key-spacing': [2, { beforeColon: false, afterColon: true, mode: 'strict' }],
        'space-infix-ops': 2,
        'space-before-function-paren': ['error', {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        }]
    }
};
