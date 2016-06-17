module.exports = {
    env: {
        "browser": true
    },
    globals: {
        "ColorHash": false,
        "define": false,
        "async": false,
        "undefined": false,
        "Backbone": false,
        "Polyglot": false,
        "CozySocketListener": false,
        "Spinner": false,
        "jQuery": false,
        "moment": false,
        "app": false,
        "$": false,
        "t": false,
        "jade": false,
        "RRule": false,
        "_": false
    },
    "extends": require('path').join(__dirname, '.eslintrc.js'),
    "rules": {
        "no-console": ["off"],
        "no-empty": ["off"],
        "indent": ["off"],
        "linebreak-style": ["error", "unix"],
        "quotes": ["off"],
        "semi": ["off"],
        "no-extra-semi": ["off"],
        "no-unused-vars": ["error", {
            "vars": "local",
            "varsIgnorePattern": "^([A-Z]|jade_|error[1-9]+)" }
        ],
        "no-unexpected-multiline": ["off"]
    }
}
