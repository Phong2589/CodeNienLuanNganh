const express = require('express');
const router = express.Router();

const Mecontroller = require('../app/controllers/MeControllers');

router.get('/stored/cources', Mecontroller.storedCources);
router.get('/trash/cources', Mecontroller.trashCources);

module.exports = router;
