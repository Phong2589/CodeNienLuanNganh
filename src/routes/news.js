const express = require('express');
const router = express.Router();

const newscontroller = require('../app/controllers/NewsControllers');

router.get('/newnew', newscontroller.show);
// router.use('/:slug',newscontroller.show)
router.get('/', newscontroller.index);

module.exports = router;
