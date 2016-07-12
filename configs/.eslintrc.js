module.exports = {
    env: {
        node: true,
        mocha: true,
    },
    global:["emit"],
    extends: "eslint:recommended",
    rules: {
        indent: ["off"],
        quotes: ["off"],
        semi: ["off"],
        "linebreak-style": ["error", "unix"],
        "no-extra-semi": ["off"],
        "no-unused-vars": ["error", { "varsIgnorePattern": "error" }]
    }
};
