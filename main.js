'use strict';

// import { Tooltip } from "chart.js";

let stateFocus = false;

const stateText = document.querySelector('.state__text');
const screen = document.querySelector('.screen');
const screenText = document.querySelector('.screen__text');
const resetBtn = document.querySelector('.reset-button');

const timeRecordFocus = document.querySelector('.focus__time');
const timeRecordRest = document.querySelector('.rest__time');

class Timer {
  constructor(timeRecordState) {
    this.startTime = 0;
    this.stopTime = 0;
    this.nowTime;
    // //
    // this.currentTime;
    // this.currStartTime;
    // //
    this.timerId;
    this.isRunning;
    this.timeRecordState = timeRecordState;
    this.update = this.update.bind(this);
  }

  update(time) {
    if (time) {
      this.nowTime = time;
    } else {
      this.nowTime = new Date(Date.now() - this.startTime);
    }

    let secs = addZero(this.nowTime.getSeconds());
    let mins = addZero(this.nowTime.getMinutes());
    let hours = addZero(this.nowTime.getHours() - 9);

    // //
    // this.currentTime = new Date(Date.now() - this.currStartTime);

    // let currSecs = addZero(this.currentTime.getSeconds());
    // let currMins = addZero(this.currentTime.getMinutes());
    // let currHours = addZero(this.currentTime.getHours() - 9);

    // displayTimeText(currHours, currMins, currSecs);
    // //
    displayTimeText(hours, mins, secs);

    displayTotalTimeRecord(this.timeRecordState, hours, mins, secs);
  }

  start() {
    if (!this.startTime) {
      this.startTime += Date.now(); // 처음 시작할 때
    } else {
      this.startTime += Date.now() - this.stopTime; // 재시작 할 때
    }
    // //
    // this.currStartTime = Date.now();
    // //
    this.isRunning = true;
    this.update(this.nowTime);
    this.timerId = setInterval(this.update, 1000);
  }

  stop() {
    this.stopTime = Date.now(); // STOP시점의 시간 저장
    this.isRunning = false;
    clearInterval(this.timerId);
  }

  reset() {
    this.startTime = 0;
    this.stopTime = 0;
    this.nowTime = new Date(0);
    this.isRunning = false;

    stateFocus = false;

    pastTimeLogAll = [];
    localStorage.clear();

    this.update(this.nowTime);
    clearInterval(this.timerId);
  }
}

// add zero to single digit number of time text
function addZero(num) {
  return num < 10 ? '0' + num : '' + num;
}

// show time text on screen
function displayTimeText(hours, mins, secs) {
  screenText.textContent = `${hours}:${mins}:${secs}`;
}

// show time record log on footer
function displayTotalTimeRecord(timeRecordState, hours, mins, secs) {
  timeRecordState.textContent = `${hours}:${mins}:${secs}`;
}

const focusTimer = new Timer(timeRecordFocus);
const restTimer = new Timer(timeRecordRest);

// click screen and start or stop timer by state
screen.addEventListener('click', onScreenClick);

// click reset button and reset both timer
resetBtn.addEventListener('click', () => {
  if (!confirmeReset()) {
    return;
  }
  focusTimer.reset();
  restTimer.reset();
});

function confirmeReset() {
  let value = confirm('initialize all time reocords into zero 00:00 🙃');
  return value;
}

// When Click Screen
function onScreenClick() {
  onFocus();
  onRest();
  changeStateText(stateFocus);
  changeTheme(stateFocus);
  getRealtimeSecs();
  savePastTimeLogAllInLocalStorage(collectPastTimeLogAll());
  stateFocus = !stateFocus;
  console.log(stateFocus);
}

// When the State is focus
function onFocus() {
  if (stateFocus) {
    focusTimer.stop();
    console.log('stop focus timer');
  } else {
    focusTimer.start();
    console.log('start focus timer');
  }
}

// When the State is rest
function onRest() {
  if (stateFocus) {
    restTimer.start();
    console.log('start rest timer');
  } else {
    restTimer.stop();
    console.log('stop rest timer');
  }
}

// change text by the state on the header
function changeStateText(state) {
  stateText.textContent = state ? 'Rest' : 'Focus';
}

// change theme color by the state
function changeTheme(state) {
  if (state) {
    screen.classList.add('rest');
  } else {
    screen.classList.remove('rest');
  }
}

//
//로컬스토리지 사용해서 time log 저장 및 활용
let pastTimeLogAll = [];

window.addEventListener('beforeunload', () => {
  if (localStorage.length == 0) {
    return;
  }
  saveLogInLocalStorage('focusTime', focusTimer.nowTime.getTime());
  // 옵셔널 체이닝으로 에러가 안뜨고 undefined를 반환하게끔
  saveLogInLocalStorage('restTime', restTimer.nowTime?.getTime());

  savePastTimeLogAllInLocalStorage(collectPastTimeLogAll());
});

window.addEventListener('load', initWhenLoad);

function initWhenLoad() {
  // 이전 기록이 없고 처음 접속하는 거라면 불러올 값이 없다.
  if (localStorage.length == 0) {
    console.log('Hi hello 😁');
    return;
  } else {
    getLogFromLocalStorage();
    getState();
    changeStateText(!stateFocus);
    changeTheme(!stateFocus);
    // 새로고침되면 default상태인데도 자동 작동되는 것 방지
    if (
      focusTimer.nowTime.getSeconds() > 0 ||
      restTimer.nowTime.getSeconds() > 0
    ) {
      if (stateFocus) {
        updateByTimeLogWhenLoad(focusTimer, restTimer);
      } else {
        updateByTimeLogWhenLoad(restTimer, focusTimer);
      }
    }
  }
}

// secsOfToday으로 오늘 현재 시간을 알 수 있다
function getRealtimeSecs() {
  let realYear = new Date().getFullYear();
  let realMonth = new Date().getMonth();
  let realDate = new Date().getDate();
  let realtimeDefault = new Date(realYear, realMonth, realDate, 0, 0, 0);
  // let realtimeDefault = new Date();
  // realtimeDefault.setHours(0, 0, 0, 0);

  let realtime = new Date();

  let msecsOfToday = realtime.getTime() - realtimeDefault.getTime();
  return msecsOfToday;
}

// 1. 생성자 함수를 이용해 객체를 만든다
// 2. 만들어진 객체를 배열에 넣는다
// 3. 그 배열을 LocalStorage에 저장~❤
function PastTimeLog(state, realtime) {
  this.state = state;
  this.realtime = realtime;
  this.elapsedTime;
}

function collectPastTimeLogAll() {
  const obj = new PastTimeLog(stateFocus, getRealtimeSecs());
  pastTimeLogAll.push(obj);
  return pastTimeLogAll;
}
// 이 parameter 이름을 어떻게 해줘야할까 단순 obj말고
// pastTimeLogAll을 전달해주는건데 이게 전역변수이다.
// 전달 안하고 그냥 써도 될까??
function savePastTimeLogAllInLocalStorage(obj) {
  getElapsedTime(obj);
  const objString = JSON.stringify(obj);
  window.localStorage.setItem('pastTimeLog', objString);
}
// 경과된 시간값 얻기 // 나중에 그래프로 표현할 때 필요한 값이다. 사이 시간 값.
// 근데 어차피 객체안의 realtime프로퍼티로 구하는데 따로 새 프로퍼티에 추가할 필요가 있나 싶구여,,
function getElapsedTime(obj) {
  if (obj.length < 2) {
    return;
  } else {
    const latestTime = obj[obj.length - 1].realtime;
    const lastTime = obj[obj.length - 2].realtime;
    obj[obj.length - 1].elapsedTime = latestTime - lastTime;
  }
}

// Local storage
// 1. declare function that saves time-log in the Local Storage
// 2. execute function before browser get refreshed or closed
// 3. get data from the Local Storage

// value 즉 시간값이 없을땐 기본값 0으로 디폴트 파라미터 설정
function saveLogInLocalStorage(keyname, value = 0) {
  window.localStorage.setItem(keyname, value);
}

function getLogFromLocalStorage() {
  const nowTime1String = window.localStorage.getItem('focusTime');
  const nowTime2String = window.localStorage.getItem('restTime');

  focusTimer.nowTime = new Date(+nowTime1String);
  restTimer.nowTime = new Date(+nowTime2String);

  const logString = window.localStorage.getItem('pastTimeLog');
  const logObj = JSON.parse(logString);
  pastTimeLogAll = logObj;
}

function getState() {
  if (pastTimeLogAll == '') {
    return;
  } else if (pastTimeLogAll.length == 1) {
    stateFocus = true;
  } else {
    stateFocus = pastTimeLogAll[pastTimeLogAll.length - 1].state;
  }
}

// unload 전 state에 해당하는 timer가 reload시 이어서 작동하도록 한다.
function updateByTimeLogWhenLoad(runningTimer, stoppedTImer) {
  let recordedTimeBeforeUnload = runningTimer.nowTime.getTime();
  let realTimeBeforeUnload = pastTimeLogAll[pastTimeLogAll.length - 1].realtime;
  let realTimeWhenLoad = getRealtimeSecs();

  // unload시점과 reload시점 사이의 시간을 더해주어서 시간이 이어서 작동하게끔
  let elapsedMilliseconds =
    recordedTimeBeforeUnload + (realTimeWhenLoad - realTimeBeforeUnload);

  runningTimer.nowTime = new Date(elapsedMilliseconds);

  stoppedTImer.update(stoppedTImer.nowTime);
  runningTimer.update(runningTimer.nowTime);

  runningTimer.startTime = -elapsedMilliseconds;
  stoppedTImer.startTime = -stoppedTImer.nowTime.getTime();
  runningTimer.start();
}

// Jooms!! 😆😆😆
/* 해야할 일
갑자기 2초씩 텍스트가 넘어가버리는 경우가 있다. 지연시간 보장 관련된건가??
*/

// 1. 이제 스타일링 좀 손보고
// css div 라인 만들기 state text 그리고 time record부분에
// reset 버튼에 경고창 만들어야겠다.
// 2. 데이터 그래프로 나타내는 단계로 넘어가자

// let's visualize data into several kinds of charts
let myDoughnutChart;
let myPolarAreaChart;
let myTimetableChart;
let testArr = [];

Chart.defaults.plugins.tooltip.bodyFont = { size: 14 };
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.boxPadding = 4;

const chartBtn = document.querySelector('#chart-button');
const chartContainer = document.querySelector('.pop-up__chart');
const chartDelBtn = document.querySelector('.chart__del-button');

chartBtn.addEventListener('click', () => {
  getPastTimeLog();
  getChart();
});
chartDelBtn.addEventListener('click', destroyChart);

function getChart() {
  showPopUp(chartContainer, 'pop-up__chart--show');
  // getDoughnutChart();
  // getPolarAreaChart();
  getTimetableChart();
}

function getDoughnutChart() {
  const ctx = document.querySelector('#test1').getContext('2d');
  const labels = ['Focus', 'Rest'];
  const data = {
    labels,
    datasets: [
      {
        label: 'My First Dataset',
        data: [
          Math.floor(focusTimer.nowTime.getTime() / 1000) || 1,
          Math.floor(restTimer.nowTime?.getTime() / 1000) || 1,
          // Math.floor(focusTimer.nowTime.getTime() / (1000 * 60)),
          // Math.floor(restTimer.nowTime.getTime() / (1000 * 60)),
        ],
        backgroundColor: ['#5CCD56', '#FFDC4F'],
        borderColor: ['#119621', '#ffa500'],
        // backgroundColor: ["#119621", "#ffa500"],
        hoverOffset: 4,
      },
    ],
  };
  const config = {
    type: 'doughnut',
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'All day Focus or Rest',
        },
        subtitle: {
          display: true,
          text: 'by minutes',
          padding: {
            bottom: 10,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              if (context.parsed < 60) {
                return context.parsed + 'secs';
              }
              return Math.floor(context.parsed / 60) + 'mins';
              // return context.formattedValue + "mins";
            },
            title: function (context) {
              return context[0].label;
            },
          },
        },
      },
      layout: {
        padding: 20,
      },
    },
  };

  myDoughnutChart = new Chart(ctx, config);
}

//

function getPolarAreaChart() {
  const ctx = document.querySelector('#test2').getContext('2d');
  const data = {
    labels: ['Focus', 'Rest'],
    datasets: [
      {
        label: 'My First Dataset',
        data: testArr || [1, 1],
        // backgroundColor: ["#119621", "#ffa500"],
        // borderColor: ["#119621", "#ffa500"],
        borderWidth: 1,
        hoverBorderWidth: 3,
        hoverBorderColor: ['#119621', '#ffa500'],
        hoverOffset: 4,
      },
    ],
  };
  const config = {
    type: 'polarArea',
    data: data,
    options: {
      parsing: {
        key: 'elapsed',
      },
      backgroundColor: function (context) {
        const index = context.dataIndex;
        const value = context.dataset.data[index];
        // return index % 2 == 0 ? "#119621" : "#ffa500";
        return index % 2 == 0
          ? 'rgba(92, 205, 86, 0.5)'
          : 'rgba(255, 220, 79, 0.7)';
      },
      scales: {},
      plugins: {
        legend: {
          display: false,
        },
        title: {
          display: true,
          text: 'your pattern',
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return context.formattedValue + 'mins';
            },
            title: function (context) {
              let now = new Date();
              let timeStartAt = new Date(
                now.setHours(0, 0, 0, 0) + context[0].raw.startAt
              );
              return `from ${addZero(timeStartAt.getHours())} : ${addZero(
                timeStartAt.getMinutes()
              )}`;
            },
          },
        },
      },
      layout: {
        padding: {
          right: 20,
          top: 20,
        },
      },
      // labels: function (context) {
      //   const index = context.dataIndex;
      //   console.log(context);
      //   // const value = context.dataset.data[index];
      //   return index % 2 == 0 ? "Focus" : "Rest";
      // },
    },
  };

  myPolarAreaChart = new Chart(ctx, config);
}

// Horizontal Bar Chart
function getTimetableChart() {
  const ctx = document.querySelector('#test3').getContext('2d');
  const data = {
    labels: [
      '00',
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      // "07",
      // "08",
      // "09",
      // "10",
      // "11",
      // "12",
      // "13",
      // "14",
      // "15",
      // "16",
      // "17",
      // "18",
      // "19",
      // "20",
      // "21",
      // "22",
      // "23",
      // "24",
    ],
    datasets: [
      {
        label: 'Focus',
        data: ['10', '20', '60'],
        borderWidth: 1,
        hoverBorderWidth: 3,
        hoverOffset: 4,
        backgroundColor: 'red',
        barPercentage: 0.5,
      },
    ],
  };
  const config = {
    type: 'bar',
    data: data,
    options: {
      scales: {
        x: {
          max: 60,
          min: 0,
        },
      },
      // indexAxis: "y",
      // Elements options apply to all of the options unless overridden in a dataset
      // In this case, we are setting the border of each horizontal bar to be 2px wide
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Chart.js Horizontal Bar Chart',
        },
      },
    },
  };

  myTimetableChart = new Chart(ctx, config);
}

function destroyChart() {
  myTimetableChart.destroy();
  // myDoughnutChart.destroy();
  // myPolarAreaChart.destroy();
  hidePopUp(chartContainer, 'pop-up__chart--show');
}

function showPopUp(popUpType, className) {
  popUpType.classList.add(className);
}

function hidePopUp(popUpType, className) {
  popUpType.classList.remove(className);
}

/*
애초에 state가 같으면 += 로 누적해서 기존의 elapsedTime값을 저장하고
달라졌을 때 새로운 객체에 새로운 elapsedTime에 저장
*/

// 여기서 reload할 때와 같이 데이터가 갱신이 되어야 한다.
// 배열 메서드를 활용할 때다!!
function getPastTimeLog() {
  // if (pastTimeLogAll == "") {
  let accArr = [];
  testArr = [];
  // }
  const logString = window.localStorage.getItem('pastTimeLog');
  const logArray = JSON.parse(logString);
  let currentState = false;
  let accElapsed = 0;

  for (let obj of logArray) {
    if (!obj.elapsedTime) {
      continue;
    }
    if (currentState != obj.state) {
      accArr.push({
        elapsed: accElapsed,
        startAt: obj.realtime - obj.elapsedTime,
      });

      // accArr.push(accElapsed);

      accElapsed = 0;
    }
    accElapsed += obj.elapsedTime;
    currentState = obj.state;
  }

  // 데이터 갱신해서 차트에 최신 데이터 띄우기
  savePastTimeLogAllInLocalStorage(collectPastTimeLogAll());
  // accArr.push(accElapsed);
  accArr.push({ elapsed: accElapsed });

  // 밀린 인덱스 조정하기
  for (let i = 0; i < accArr.length - 1; i++) {
    accArr[i].elapsed = accArr[i + 1].elapsed;
  }
  accArr.pop();

  console.log(accArr);
  // for (let value of accArr) {
  //   if (value == 0) {
  //     continue;
  //   }
  //   testArr.push(Math.ceil(value / (1000 * 60)));
  // }
  for (let value of accArr) {
    if (value.elapsed == 0) {
      continue;
    }
    testArr.push({
      elapsed: Math.ceil(value.elapsed / (1000 * 60)),
      startAt: value.startAt,
    });
  }
  console.log(testArr);
}

// 우선 PI차트 기본을 만들어 놓고 데이터가 어떤식으로 이용되는지 보자

// Side bar toggle buttton
const toggleSidebarButton = document.querySelector('.header__toggle-btn');
const sidebar = document.querySelector('.sidebar');

toggleSidebarButton.addEventListener('click', () => {
  sidebar.classList.toggle('active');
  // if (sidebar.style.display === 'none') {
  //   sidebar.style.display = 'block';
  //   sidebar.classList.add('active');
  // } else {
  //   sidebar.style.display = 'none';
  //   sidebar.classList.remove('active');
  // }
});
