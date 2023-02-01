const assert = require('assert'),
      Sequelize = require('sequelize');

global.sequelize = new Sequelize(`postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@localhost:5432/${process.env.POSTGRES_DB}`);

const Url = require('../models/url.js');

describe('The model Url', function() {
  it('can be created and destroyed', async function() {
    await global.sequelize.sync();
    const initialCount = await Url.count(),
          url          = await Url.create({ shortUrl : Url.uid, url : 'https://www.youtube.com/watch?v=tcOY8ziJdLk', password : 'aeiou'});

    await global.sequelize.sync();
    assert.equal((initialCount + 1), await Url.count());
    await url.destroy();
    await global.sequelize.sync();
    assert.equal(initialCount, await Url.count());
  });

  it('can be found by shortUrl', async function() {
    const urlInstance = await Url.create({ shortUrl : Url.uid, url : 'https://www.youtube.com/watch?v=tcOY8ziJdLk', password : 'aeiou'}),
          url = urlInstance.url,
          shortUrl = urlInstance.shortUrl,
          foundUrl = await Url.findOne({
            where: {
              shortUrl: shortUrl
            }
          });
    assert.equal(foundUrl.url, url);
    urlInstance.destroy();
  });

  it('can validate password', async function() {
    const urlInstance = await Url.create({ shortUrl : Url.uid, url : 'https://www.youtube.com/watch?v=tcOY8ziJdLk', password : 'aeiou'});
    assert(await urlInstance.validatePassword('aeiou'));
    assert(!await urlInstance.validatePassword('ruisleipä'));
  });

  it('can not have a silly url', function() {
    try {
      Url.create({ shortUrl : Url.uid, url : 'ruisleipä', password : 'aeiou'});
      return false;
    } catch(e) {
      return true;
    }
  });
});