const express = require('express');
const router = express.Router();

const sitecontroller = require('../app/controllers/SiteControllers');


// router.get('/new', sitecontroller.new);
// router.post('/new', sitecontroller.newMes);
router.post('/register', sitecontroller.register);
router.post('/login', sitecontroller.login);

router.get('/checkUserDatabase', sitecontroller.checkUserDatabase);

router.get('/', sitecontroller.index);

module.exports = router;
