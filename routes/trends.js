const express = require('express');
const catchErrors = require('../lib/async-error');
const request = require('request'); // Simplified HTTP client

const router = express.Router();

const categoryNum = 8;
const titleNum = 10;

// Naver API Key
const client_id = 'rcB_GneSUHAEXt5u2l44'; 
const client_secret = process.env.NAVER_API;
const youtube_key = process.env.YOUTUBE_API;


// Google trends Topcharts crawling(2017, KR)
router.get('/', catchErrors(async (req, res, next) => {
  console.log(youtube_key)
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

// clicked title을 네이버 블로그 API를 이용하여 검색 
router.get('/search/blog', async function(req, res, next) {
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
// clicked title에 맞는 상세 정보를 출력
router.get('/search/blog/:id', catchErrors(async (req, res, next) => {
  let path = req._parsedOriginalUrl.path // a(href='')에서 post를 사용할 수 없어 사용함.
  let id = path.slice(-2)
  const categoryCode = id.slice(0, 1)
  const titleCode = id.slice(-1)

  const url = 'https://trends.google.com/trends/topcharts/category';

  // TODO: date와 geo 선택 옵션 추가, 함수화 하여 중복 제거
  // Database를 사용하지 않았기 때문에 크롤링 데이터를 배열화하여 선택한 데이터를 알아냄
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

// function searchBlog(clickedTitle) {
//   // Naver Search API
//   let api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(clickedTitle.trim()); // json 결과
//   let options = {
//     url: api_url,
//     headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret':client_secret}
//   };

//   request.get(options, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
//       // res.end(body);
//       // console.log(body)
//       let obj = JSON.parse(body);
//       return obj;
//     } else {
//       console.log('error!: ');
//       return response;
//     }
//   });
// }

// clicked title에 맞는 상세 정보를 출력
router.get('/details/:id', catchErrors(async (req, res, next) => {

  const url = 'https://trends.google.com/trends/topcharts/category'; // google trends topchart 

  let path = req._parsedOriginalUrl.path; // a(href='')에서 post를 사용할 수 없어 사용함.
  let id = path.slice(-2);
  const categoryCode = id.slice(0, 1);
  const titleCode = id.slice(-1);
  let clickedTitle = '';
  var blogObj;
  var youtubeObj;
  
  // TODO: date와 geo 선택 옵션 추가, 함수화 하여 중복 제거
  // Database를 사용하지 않았기 때문에 크롤링 데이터를 배열화하여 선택한 데이터를 알아냄
  request.post({url:url, form:{ajax:1, date:2017, geo:'KR'}}, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      const googleObj = JSON.parse(body);
      let arr = new Array(categoryNum);
      for(let i = 0; i < categoryNum; i++) {
        arr[i] = new Array(titleNum); 
      }
      for(let i = 0; i < categoryNum; i++) {
        arr[i][0] = googleObj.data.chartList[i].trendingChart.visibleName
        for (let j = 0; j < titleNum; j++) {
          arr[i][j+1] = googleObj.data.chartList[i].trendingChart.entityList[j].title
        }
      }
      
      clickedTitle = googleObj.data.chartList[categoryCode].trendingChart.entityList[titleCode].title
      
      // Naver Search API
      let naver_api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(clickedTitle.trim()); // json 결과
      let naver_options = {
        url: naver_api_url,
        headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret':client_secret}
      };
      
      // Youtube API
      let youtube_api_url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&q=' + encodeURI(clickedTitle.trim()) + '&key=' + youtube_key; // json 결과
      let youtube_options = {
        url: youtube_api_url
      }
      

      // Naver
      request.get(naver_options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
          // res.end(body);
          blogObj = JSON.parse(body);

          // Youtube
          request.get(youtube_options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
              // res.end(body);
              youtubeObj = JSON.parse(body);
              res.render('trends/show', {clickedTitle:clickedTitle, blogObj:blogObj, youtubeObj:youtubeObj});
            } else {
              console.log('Youtube error');
              return response;
            }
          });
        } else {
          console.log('Naver error');
          return response;
        }
      });
    }
  })
}));
  


// router.get('/search/wiki', function(req, res, next) {
//   console.log(req.param)
//   let api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(req.query.query); // json 결과
//   let options = {
//     url: api_url,
//     headers: {'X-Naver-Client-Id':client_id, 'X-Naver-Client-Secret': client_secret}
//   };
//   request.get(options, function (error, response, body) {
//     if (!error && response.statusCode == 200) {
//       res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
//       res.end(body);
//     } else {
//       res.status(response.statusCode).end();
//       console.log('error: ' + response.statusCode)
//     }
//   });
// });

module.exports = router;