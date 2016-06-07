module.exports = {
    "env": {
        "node": true,
        "mocha": true,
    },
    "global":["emit"],
    "extends": "eslint:recommended",
    "rules": {
        "indent": ["off"],
        "linebreak-style": ["error", "unix"],
        "quotes": ["off"],
        "semi": ["off"],
        "no-extra-semi": ["off"],
        "no-unused-vars": ["error", { "varsIgnorePattern": "error" }]
    }
};
