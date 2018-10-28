const express = require('express');
const catchErrors = require('../lib/async-error');
const request = require('request'); // Simplified HTTP client
const cheerio = require('cheerio'); // Fast, flexible & lean implementation of core jQuery designed specifically for the server.

const router = express.Router();

const categoryNum = 8;
const titleNum = 10;

router.get('/', catchErrors(async (req, res, next) => {
  
}));


module.exports = router;