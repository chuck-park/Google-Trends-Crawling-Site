const express = require('express');
const catchErrors = require('../lib/async-error');
const request = require('request'); // Simplified HTTP client
const cheerio = require('cheerio'); // Fast, flexible & lean implementation of core jQuery designed specifically for the server.

const router = express.Router();

router.get('/', catchErrors(async (req, res, next) => {
  res.render('crawler/index');
}));

// 공식 API가 없고 npm의 google-trends-api 모듈에 daliy trend에 관한 함수가 없어 직접 크롤링함.
// Google trends Topcharts crawling(2017, KR)
router.get('/trends', catchErrors(async (req, res, next) => {

  const url = 'https://trends.google.co.kr/trends/api/dailytrends?hl=ko&tz=-540&geo=KR&ns=15';

  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      body = body.slice(5, body.length) // remove useless parentheses
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error: ' + response.statusCode)
    }
  });
}));


module.exports = router;