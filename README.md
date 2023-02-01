# Wunderdog thingy

## How to run
1. Open Dev Container (https://code.visualstudio.com/docs/devcontainers/containers)
2. Run `node bin/www` in container (or `npm run start`, I don't judge)
3. Navigate to `localhost:3000` on browser

## How to run otherwise
1. Navigate to `./.devcontainer`
2. Run `docker compose up`
3. Run `node bin/www` in container
4. Navigate to `localhost:3000` on browser

## Run tests
Run `npx mocha`

## Possible issues
`./.devcontainer/docker-compose.yml:28` I have a suspicion this volume may not work on every machine but I don't know, I'm just a datanomi 

## Why it is not production ready
You asked for me to "attempt to produce production ready code". This is not production ready code.
- No validation tokens for forms
- No collision checks for short urls
- Passwords are probably pretty hackable but I don't know, I'm just a datanomi
- Database probably runs on root
- I'm not sure how often `sequelize` saves to database without explicit order to sync, so data might not persist on Node crash
- Needs systems test coverage that actually makes http-requests and gets responses as expected
- May have XSS vulnerability at `./views/layouts/main.handlebars:12` but I just `npm i`'d everything and didn't audit
- First attempt at the following:
  - Node
  - Express
  - Sequelize
  - Bcrypt
  - Mocha
  - Producing Docker dev containers
- I don't even know who Jade and Morgan are but if they're single, please introduce us
- No fancy I18n library to
  - have locales
  - fix funny stuff like "0 kertaa", "1 kertaa"
- Only one funny YouTube video in tests