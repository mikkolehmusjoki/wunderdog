const {Url, UrlVisit} = require('../models/url');

exports.new = (req, res) => {
  res.render(
    'url/new', 
    { 
      title: "Lyhennä linkki",
      url_create_path: '/create'
    }
  );
};

exports.create = async (req, res) => {
  const createdUrl = await Url.create({ shortUrl : Url.uid, url: req.body.url, password: req.body.password });
  res.status(201).render(
    'url/created',
    {
      title: 'Lyhennelinkki luotu',
      fullUrl: createdUrl.url,
      shortUrl: `${req.protocol}://${req.get('host')}/${createdUrl.shortUrl}`
    }
  )
};

exports.read = async (req, res) => {
  const foundUrl = await Url.findOne({where: {shortUrl: req.params.shortUrl}});

  if (!foundUrl?.url) {
    res.status(404).send('<strong>HTTP 404</strong> eeppä löyvy :<');
    return 
  }

  res.render(
    'url/read',
    {
      title: 'Lyhennelinkin tilastot',
      url_destroy_path: `/${req.params.shortUrl}/destroy/`,
      fullUrl: foundUrl.url,
      shortUrl: `${req.protocol}://${req.get('host')}/${req.params.shortUrl}`,
      visits: await foundUrl.aggregateUrlVisits(),
      visitsCount: await foundUrl.countUrlVisits()
    }
  )
};

exports.redirect = async (req, res) => {
  const foundUrl = await Url.findOne({where: {shortUrl: req.params.shortUrl}});
  if (!foundUrl?.url) {
    res.status(404).send('<strong>HTTP 404</strong> eeppä löyvy :<');
    return 
  }
  UrlVisit.create({UrlId: await foundUrl.id});
  res.redirect(303, foundUrl.url)
};

exports.destroy = async (req, res) => {
  const foundUrl = await Url.findOne({where: {shortUrl: req.params.shortUrl}});
  if (!foundUrl?.url) {
    res.status(404).send('<strong>HTTP 404</strong> eeppä löyvy :<');
    return 
  }
  const { url } = foundUrl;
  res.render(
    'url/destroyed',
    {
      title: 'Lyhennelinkki poistettu',
      fullUrl: url,
      shortUrl: `${req.protocol}://${req.get('host')}/${req.params.shortUrl}`,
      visitsCount: await foundUrl.countUrlVisits().then(foundUrl.destroy())
    },
    
  )
};
