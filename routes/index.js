const express        = require('express'),
      router         = express.Router(),
      url_controller = require('../controllers/url_controller');

router.get('/', url_controller.new);
router.post('/create', url_controller.create);
router.get('/:shortUrl', url_controller.redirect);
router.get('/:shortUrl/stats', url_controller.read);
router.delete('/:shortUrl/destroy', url_controller.destroy);
router.post('/:shortUrl/destroy', url_controller.destroy);

module.exports = router;
