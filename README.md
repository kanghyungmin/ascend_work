<a name="readme-top"></a>

<!--  목 차  -->
<details open>
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

## 이슈 
* Container의 통신은 처음 GRPC를 사용했지만, 인프라 배포 시 GRPC 통신 설정에 애로 사항이 있어 restAPI 전환
  ( 도메인 파기, SSL 연결, ALB gpc 설정에 따른 시간 소요)
* Container 간 restAPI 통신 시, 
   
