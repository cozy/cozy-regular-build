var common = require('path').join(__dirname, '.eslintrc.js');

module.exports = {
    env: {
        browser: true,
    },
    globals: {
        ColorHash: false,
        define: false,
        async: false,
        undefined: false,
        Backbone: false,
        Polyglot: false,
        CozySocketListener: false,
        Spinner: false,
        jQuery: false,
        moment: false,
        app: false,
        $: false,
        t: false,
        jade: false,
        RRule: false,
        _: false,
    },
    extends: common,
    rules: {
        indent: ['off'],
        quotes: ['off'],
        semi: ['off'],
        'no-console': ['off'],
        'no-empty': ['off'],
        'linebreak-style': ['error', 'unix'],
        'no-extra-semi': ['off'],
        'no-unused-vars': ['error', {
            vars: 'local',
            varsIgnorePattern: '^([A-Z]|jade_|error[1-9]+)' },
        ],
        'no-unexpected-multiline': ['off'],
    },
};
