const express = require('express');
const catchErrors = require('../lib/async-error');
const request = require('request'); // Simplified HTTP client

const router = express.Router();

const categoryNum = 8;
const titleNum = 10;

// API Keys
const naver_client_id = 'rcB_GneSUHAEXt5u2l44'; 
const naver_client_secret = process.env.NAVER_API;
const youtube_key = process.env.YOUTUBE_API;

// 공식 API가 없고 npm의 google-trends-api 모듈에 daliy trend에 관한 함수가 없어 직접 크롤링함.
// Google trends Topcharts crawling(2017, KR)
router.get('/', catchErrors(async (req, res, next) => {

  const url = 'https://trends.google.co.kr/trends/api/dailytrends?hl=ko&tz=-540&geo=KR&ns=15';

  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
      // res.end(body);
      body = body.slice(5, body.length) // remove useless parentheses
      let trendsObj = JSON.parse(body);

      let trendsLengthToday = trendsObj.default.trendingSearchesDays[0].trendingSearches.length
      // let trendsLengthYesterday = trendsObj.default.trendingSearchesDays[1].trendingSearches.length
      res.render('trends/index', {trendsObj:trendsObj, trendsLengthToday:trendsLengthToday})
    } else {
      res.status(response.statusCode).end();
      console.log('error: ' + response.statusCode)
    }
  });
}));

// clicked title에 맞는 상세 정보를 출력
router.get('/details/:id', catchErrors(async (req, res, next) => {

  const url = 'https://trends.google.co.kr/trends/api/dailytrends?hl=ko&tz=-540&geo=KR&ns=15'; // google trends dailytrends
  
  // TODO: date와 geo 선택 옵션 추가, 함수화 하여 중복 제거
  // Database를 사용하지 않았기 때문에 크롤링 데이터를 배열화하여 선택한 데이터를 알아냄
  request.get(url, function(error, response, body) {
    if(!error && response.statusCode == 200) {
      body = body.slice(5, body.length) // remove useless parentheses
      const trendsObj = JSON.parse(body);
      // let day = (req.params.id).slice(0, 1)
      // let rank = (req.params.id).slice(1, 2)
      let clickedTitle = (req.params.id)

      // Naver Search API
      let naver_api_url = 'https://openapi.naver.com/v1/search/blog?query=' + encodeURI(clickedTitle.trim()); // json 결과
      let naver_options = {
        url: naver_api_url,
        headers: {'X-Naver-Client-Id':naver_client_id, 'X-Naver-Client-Secret':naver_client_secret}
      };
      // Youtube API
      let youtube_api_url = 'https://www.googleapis.com/youtube/v3/search?maxResults=25&part=snippet&q=' + encodeURI(clickedTitle.trim()) + '&key=' + youtube_key; // json 결과
      let youtube_options = {
        url: youtube_api_url,
      }
      
      
      // Naver
      request.get(naver_options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
          // res.end(body);
          let blogObj = JSON.parse(body);
          // console.log(blogObj)
          
          // remake blog content link (bloggerlink + '/' + contentNum)
          let i = 0;
          while(i < blogObj.items.length) {
            let linkLength = blogObj.items[i].link.length;
            let contentNum = blogObj.items[i].link.substring(linkLength-12, linkLength)
            blogObj.items[i].link = blogObj.items[i].bloggerlink + '/' + contentNum
            i++;
          }

          // remove <b> </b> text from title, description
          function regEx(target) {
            switch(target) {
              case "<b>": return "";
              case "</b>": return "";
              case "&lt;": return "<";
              case "&gt;": return ">";
              case "&quot;": return "";
            }
          }

          i = 0;
          while(i < blogObj.items.length) {
            let title = blogObj.items[i].title;
            let desc = blogObj.items[i].description;
            title = title.replace(/<b>|<\/b>|\&lt;|\&gt;|&quot;/g, regEx);
            desc = desc.replace(/<b>|<\/b>|\&lt;|\&gt;|&quot;/g, regEx);
            blogObj.items[i].title = title;
            blogObj.items[i].description = desc;
            // console.log(desc)
            i++;
          }

          // Youtube
          request.get(youtube_options, function (error, response, body) {
            if (!error && response.statusCode == 200) {
              // res.writeHead(200, {'Content-Type': 'text/json;charset=utf-8'});
              // res.end(body);
              let youtubeObj = JSON.parse(body);
              // console.log(youtubeObj)
              res.render('trends/show', {clickedTitle:clickedTitle, trendsObj:trendsObj, blogObj:blogObj, youtubeObj:youtubeObj});
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
    } else { 
      console.log('request error')
    }
  })
}));

module.exports = router;