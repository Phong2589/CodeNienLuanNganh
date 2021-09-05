const express = require('express');
const router = express.Router();

const sitecontroller = require('../app/controllers/SiteControllers');

router.get('/new', sitecontroller.new);
router.get('/', sitecontroller.index);

module.exports = router;
