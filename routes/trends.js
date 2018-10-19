const express = require('express');
const catchErrors = require('../lib/async-error');
const request = require('request'); // Simplified HTTP client

const router = express.Router();

const categoryNum = 8;
const titleNum = 10;

// Naver API
const client_id = 'rcB_GneSUHAEXt5u2l44'; 
const client_secret = process.env.NAVER_API;
router.get('/', catchErrors(async (req, res, next) => {

  const url = 'https://trends.google.com/trends/topcharts/category';

  // TODO: date와 geo 선택 옵션 추가, 함수화 하여 중복 제거
  request.post({url:url, form:{ajax:1, date:2017, geo:'KR'}}, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      let obj = JSON.parse(body);
      res.render('trends/index', {obj:obj})
    } else {
      res.status(response.statusCode).end();
      console.log('error: ' + response.statusCode)
    }
  });
}));

router.get('/search/blog', function(req, res, next) {
  console.log(req.param)
  let api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(req.query.query); // json 결과
  let options = {
    url: api_url,
    headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.log('error: ' + response.statusCode)
    }
  });
});

// TODO: blog 외의 옵션 추가
router.get('/search/blog/:id', catchErrors(async (req, res, next) => {
  let path = req._parsedOriginalUrl.path // a(href='')에서 post를 사용할 수 없어 사용함.
  let id = path.slice(-2)
  const categoryCode = id.slice(0, 1)
  const titleCode = id.slice(-1)

  const url = 'https://trends.google.com/trends/topcharts/category';

  // TODO: date와 geo 선택 옵션 추가, 함수화 하여 중복 제거
  request.post({url:url, form:{ajax:1, date:2017, geo:'KR'}}, function(error, response, body) {
    if(!error && response.statusCode == 200) {
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
      
      let clickedTitle = obj.data.chartList[categoryCode].trendingChart.entityList[titleCode].title
      console.log(clickedTitle.trim())
      
      // Naver Search API
      let api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(clickedTitle.trim()); // json 결과
      let options = {
        url: api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret':client_secret}
      };

      request.get(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
          // res.end(body);
          // console.log(body)
          let obj = JSON.parse(body);
          res.render('trends/show', {clickedTitle:clickedTitle, obj:obj})
        } else {
          console.log('error!: ' + response)
        }
      });
    } else {
      res.status(response.statusCode).end();
      console.log('error: ' + response.statusCode)
    }
  });
}));

module.exports = router;