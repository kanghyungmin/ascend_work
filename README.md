##  local에서 프로그램 수행 방법
 ```
 # checkout Master branch
 git checkout master
 
 # nest 모듈 설치
 yarn add @nestjs/cli
 
 # node-moudle 모듈 설치
 yarn 
 
 # 1번 container 수행
 nest start data-app
 
 # 2번 container 수행
 nest start trade-app
 ```

***
&nbsp;&nbsp;&nbsp;&nbsp;
<a name="readme-top"></a>

<!--  목 차  -->
<details>
  <summary>목 차</summary>
  <ol>
    <li>
      <a href="#과제-설명">과제 설명</a>
    </li>
    <li>
      <a href="#기술-스택">기술 스택</a>
    </li>
    <li><a href="#시스템-구조">시스템 구조</a></li>
    <li><a href="#프로그램-구조">프로그램 구조</a></li>
    <li><a href="#CI/CD-구성">CI/CD 구성</a></li>
    <li><a href="#데이터-수집">데이터 수집</a></li>
    <li><a href="#전략">전략</a></li>
    <li><a href="#모니터링"><del>모니터링</del></a></li>
    <li>
      <a href="#이슈">이슈</a>
    </li>
  </ol>
</details>
&nbsp;&nbsp;&nbsp;&nbsp;

<!-- 과제 설명 -->
## 과제 설명
* 전략
  - MA(10), MA(20)부터 파라미터 값을 1씩 증가시킨 MA(110), MA(120)까지의 101개의 간단한 전략 사용
  ```
   전략1: MA(10)과 MA(20) BTC/USDT
   전략2: MA(11)과 MA(21) BTC/USDT
   … 
   전략101: MA(110)과 MA(120) BTC/USDT
   ```
  - golden cross 시 매수, dead cross 시 매도 전략 사용
  - golden cross: 단기 MA가 장기 MA를 돌파하고 올라 갈 때
  - dead cross: 단기 MA가 장기 MA를 뚫고 내려갈 때
* 데이터 수집
  - 기준 가격 캔들은 1m 사용
  - BTC close price 사용
  - Binance websocket 이용하여 데이터 가져오기
* CI/CD 구성
  - github action, jenkins, circle CI등 자유롭게 사용 
* 인프라
  - 클라우드 혹은 로컬에 Docker로 배포
* 모니터링
  - Dash및 그라파나 등 자유롭게 사용
  - 각 전략 별 수익률 및 balance 현황
<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- 기술 스택 -->
## 기술 스택
* 인프라 : AWS ECS/ECR, ALB, 
* CI/CD  : Github actions
* WAS : nodejs(framework: nestjs)
* DB : mongoDB Atlas
* Monitoring : Grafana Sass
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 시스템 구조
* Container Cluster로 AWS ECS를 사용했으며 총 1개의 Cluster를 사용
* 2개의 Container가 배포되며 각각 아래와 같은 목적을 가지고 있음
  - Data Container(가칭) : 바이낸스와 같은 곳에서 Data를 수집 / 전략 수행 / 체결 명령 전달
  - Trade Container(가칭) : Data Container로 부터 체결 명령을 전달받아 실제적으로 체결을 수행
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 프로그램 구조
* 2개의 Container가 존재. 그리고 2개의 Container는 많은 부분을 공유. 이에, monorepo 방식으로 설계
* libs에는 공통으로 사용되는 모듈, 데이터 타입, 그리고  ORM이 존재하며 &nbsp;  
  apps 폴더에는 2개의 Container들에 대한 독립적인 로직들이 각각 존재
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## CI/CD 구성
* Container마다 필요한 파일들(taskdefinition, workflow)이 존재하며 dockerfile은 공유
* 아래와 같이 각 Container에 대한 배포 브랜치가 존재
  - Data Container(가칭) : `deploy/data`
  - Trade Container(가칭) : `deploy/trade`
* 각 배포 브랜치에 Merge 시, 배포되도록 `git actions` 구성
 
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 데이터 수집
* _문제를 정확히 파악하고 진행해야하는데 그렇지 못해 요구하신 사항과 맞지 않는 부분이 있습니다. 양해 부탁 드립니다._
* websocket으로 특정 페어 `BTCUSDT`에 대한 구독. Callbakc 함수에서 데이터 추출 후, 변수에 대입
```typescript
private async _onMessage(data) {
    const { b, B, a, A } = JSON.parse(data); //데이터 추출
    this.tickData = { bidPrice: b, bidQty: B, askPrice: a, askQty: A };
  }
```
* 1분마다 주기적으로 호출하는 함수에서 해당 변수를 queue 등록
  - 최대 120개의 데이터만 저장되며 이때 전략에 대한 판단 후, 트레이트 API 호출
```typescript
private async checkTrading() {
    const checkFun = async () => {
      // let start = new Date().getTime();
      if (this.tickData) {
        this.bidAskInfo.push(this.tickData);
        if (this.bidAskInfo.length == this.tickDatanums) {
          this.bidAskInfo.shift();
          //전략에 기반하여 trade 여부 결정.this.resultChkStr 변수 참조
          this.calStrategy(this.tickData.ask, this.tickData.bid);
          await this.callTradeAPI();
        }
      }
      // console.log(`elapsed time : ${new Date().getTime() - start}`);
    };

    setInterval(checkFun, 60000); // 1분
  }
```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 전략
* __
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## <del>모니터링</del>
* _이 부분은 작업을 수행하지 못했습니다._
<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 이슈 
* Container의 통신은 처음 gRPC를 사용했지만, 인프라 배포 시 GRPC 통신 설정에 애로 사항이 있어 &nbsp;  
  restAPI 전환
* Container 간 restAPI 통신 시, Cluster 내에서 통신하는 방법 적용 필요. 현재는 외부로 나갔다가 들어옴

<p align="right">(<a href="#readme-top">back to top</a>)</p>
   
