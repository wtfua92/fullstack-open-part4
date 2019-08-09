module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true,
        'jest': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'windows'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        "no-trailing-spaces": "error",
        "no-else-return": "error",
        "no-whitespace-before-property": "error",
        "no-unused-vars": ["error", {"args": "after-used"}],
        "eqeqeq": ["error", "always"]
    }
};