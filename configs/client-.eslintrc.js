module.exports = {
    env: {
        "browser": true
    },
    globals: {
        "define": true,
        "undefined": true,
        "Backbone": true,
        "jQuery": true,
        "moment": true,
        "app": true,
        "$": true,
        "t": true,
        "jade": true,
        "RRule": true,
        "_": true
    },
    "extends": require('path').join(__dirname, '.eslintrc.js'),
    "rules": {
        "no-empty": ["off"],
        "indent": ["off"],
        "linebreak-style": ["error", "unix"],
        "quotes": ["off"],
        "semi": ["off"],
        "no-extra-semi": ["off"],
        "no-unused-vars": ["error", { "varsIgnorePattern": "^jade_" }],
        "no-unexpected-multiline": ["off"]
    }
}
