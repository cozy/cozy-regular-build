# COzy Regular BUild (CORBU)

This is a set of build & maintenance tools used for cozy application.
It supposes your application follow the same structure than cozy's team
applications.

It is only a toolset including

- client-side build : brunch or webpack
- server-side build : coffee-script
- tests runner : mocha
- linter : coffeelint & eslint
- test database : cozy-data-system
- A standard `.gitignore`, `.npmignore`, `.editorconfig` and `.travis.yml`


## Setup your project

cozy-regular-build expects your app to have the following structure :
```
package.json
server.coffee
server/
    assets
    locales
client/
    package.json
    app/
        locales/
test/
build/
```

You can then create standard dotfiles & npm script by running
```bash
npm install -g cozy-regular-build
cd my-app && corbu setup
```

## Use it

```bash
cd my-app
npm run lint
npm run build
npm run test
```

## License

Cozy Regular Build is developed by Cozy Cloud and distributed under the MIT license.

## What is Cozy?

![Cozy Logo](https://raw.github.com/cozy/cozy-setup/gh-pages/assets/images/happycloud.png)

[Cozy](https://cozy.io) is a platform that brings all your web services in the
same private space.  With it, your web apps and your devices can share data
easily, providing you
with a new experience. You can install Cozy on your own hardware where no one
profiles you.

## Community

You can reach the Cozy Community by:

* Chatting with us on IRC #cozycloud on irc.freenode.net
* Posting on our [Forum](https://forum.cozy.io/)
* Posting issues on the [Github repos](https://github.com/cozy/)
* Mentioning us on [Twitter](https://twitter.com/mycozycloud)
