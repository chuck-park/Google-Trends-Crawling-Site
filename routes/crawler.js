const express = require('express');
const catchErrors = require('../lib/async-error');
const request = require('request'); // Simplified HTTP client
const cheerio = require('cheerio'); // Fast, flexible & lean implementation of core jQuery designed specifically for the server.

const router = express.Router();

const categoryNum = 8;
const titleNum = 10;

router.get('/', catchErrors(async (req, res, next) => {

  const url = 'https://trends.google.com/trends/topcharts/category';

  request.post({url:url, form:{ajax:1, date:2017, geo:'KR'}}, function(error, response, body) {
    if(!error) {
      let obj = JSON.parse(body);
      let arr = new Array(categoryNum);
      for(let i = 0; i < categoryNum; i++) {
        arr[i] = new Array(titleNum); 
      }
      for(let i = 0; i < categoryNum; i++) {
        arr[i][0] = obj.data.chartList[i].trendingChart.visibleName
        for (let j = 0; j < titleNum; j++) {
          arr[i][j+1] = obj.data.chartList[i].trendingChart.entityList[j].title
        }
      }
      res.render('crawler/index', {arrs:arr, obj:obj})
    }
  })
}));

module.exports = router;