# NAVER-CAMPUS-HACKDAY-RESUME
네이버 캠퍼스 핵데이에 참가하기 위해 만든 레포지토리입니다.
참가하고 싶은 이슈에 대한 개발 관련 경험이 적어서 해당 이슈의 개발 요구 사항을 참고하여 데모 버전을 직접 만들어 보았습니다.
Heroku를 사용하여 deploy하였으며 첫 페이지에서 5번과 7번 이슈를 선택할 수 있습니다.

### https://naver-hackday-resume.herokuapp.com/

## Contents
### 7. Trends(트렌드 모아보기)
Google Trends의 Trending Searches를 크롤링하여 인덱스 페이지를 제작하였습니다(geo=KR). 구글 트렌드 페이지와 비슷하게 각 리스트에 트래픽 순위, 쿼리 이름, 트래픽 수, 관련 뉴스 기사를 넣었으며 해당 기사 사진이나 미디어 이름을 클릭하면 해당 미디어로 이동합니다. 쿼리 이름을 클릭하면 네이버 블로그 검색 API를 이용한 '블로그 검색결과'와 Youtube search video API를 이용한 '유튜브 검색결과' 리스트로 구성된 페이지로 이동합니다. 마찬가지로 해당 글이나 이미지를 클릭하면 해당 사이트로 이동합니다.

### 5. Crawler(사이트 크롤러를 이용한 Android/iOS 앱 제작)
안드로이드 어플리케이션이기 때문에 인덱스 페이지에는 어플리케이션 동작 사진과 apk 파일 다운로드 링크를 첨부하였습니다. 데이터는 Google Trends를 크롤링하는 crawler/trends 페이지에서 받아옵니다. 리스트 항목을 클릭하면 어떤 항목이 클릭 됐는지 Toast 메시지가 출력됩니다. 7. Trends와는 다르게 블로그나 유튜브 검색 결과를 보여주는 페이지는 생략하였습니다.

## Screenshots
### 7. Trends(트렌드 모아보기)
![capture1](https://user-images.githubusercontent.com/15935262/47731088-c1dd7c80-dca6-11e8-8d8f-f13c836a89c9.PNG)
![capture2-1](https://user-images.githubusercontent.com/15935262/47653251-71ddb780-dbcb-11e8-8989-4ce9dcb99d44.PNG)
![capture2-2](https://user-images.githubusercontent.com/15935262/47653983-36dc8380-dbcd-11e8-9c57-cf1f97a5ea2a.PNG)
![capture3](https://user-images.githubusercontent.com/15935262/47653254-73a77b00-dbcb-11e8-9189-c7ae68c5d0e7.PNG)
------------------------
### 5. Crawler(사이트 크롤러를 이용한 Android/iOS 앱 제작)
![capture4](https://user-images.githubusercontent.com/15935262/47731211-fc471980-dca6-11e8-8e06-0af310ac2a96.PNG)
![capture5-1](https://user-images.githubusercontent.com/15935262/47731215-fea97380-dca6-11e8-94ec-aaebfa4ecdf4.PNG)
![capture5-2](https://user-images.githubusercontent.com/15935262/47731335-3b756a80-dca7-11e8-959e-9edbce1d88e6.PNG)

## Authors
* **Chungmin Park** - [ChungminPark](https://github.com/ChungminPark)
