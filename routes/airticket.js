const express = require('express');
const catchErrors = require('../lib/async-error');

const router = express.Router();

router.get('/', catchErrors(async (req, res, next) => {
  res.render('airticket/index');
}));

module.exports = router;