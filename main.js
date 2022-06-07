"use strict";

let stateFocus = false;

const stateText = document.querySelector(".state__text");
const screen = document.querySelector(".screen");
const screenText = document.querySelector(".screen__text");
const resetBtn = document.querySelector(".reset-button");

const timeRecordFocus = document.querySelector(".focus__time");
const timeRecordRest = document.querySelector(".rest__time");

class Timer {
  constructor(timeRecordState) {
    this.startTime = 0;
    this.stopTime = 0;
    this.nowTime;
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

    displayTimeText(hours, mins, secs);
    displayTotalTimeRecord(this.timeRecordState, hours, mins, secs);
  }

  start() {
    if (!this.startTime) {
      this.startTime += Date.now(); // 처음 시작할 때
    } else {
      this.startTime += Date.now() - this.stopTime; // 재시작 할 때
    }
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
  return num < 10 ? "0" + num : "" + num;
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
screen.addEventListener("click", onScreenClick);

// click reset button and reset both timer
resetBtn.addEventListener("click", () => {
  if (!confirmeReset()) {
    return;
  }
  focusTimer.reset();
  restTimer.reset();
});

function confirmeReset() {
  let value = confirm("initialize all time reocords into zero 00:00 🙃");
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
    console.log("stop focus timer");
  } else {
    focusTimer.start();
    console.log("start focus timer");
  }
}

// When the State is rest
function onRest() {
  if (stateFocus) {
    restTimer.start();
    console.log("start rest timer");
  } else {
    restTimer.stop();
    console.log("stop rest timer");
  }
}

// change text by the state on the header
function changeStateText(state) {
  stateText.textContent = state ? "Rest" : "Focus";
}

// change theme color by the state
function changeTheme(state) {
  if (state) {
    screen.classList.add("rest");
  } else {
    screen.classList.remove("rest");
  }
}

//
//로컬스토리지 사용해서 time log 저장 및 활용
let pastTimeLogAll = [];

window.addEventListener("beforeunload", () => {
  saveLogInLocalStorage("focusTime", focusTimer.nowTime.getTime());
  saveLogInLocalStorage("restTime", restTimer.nowTime.getTime());

  savePastTimeLogAllInLocalStorage(collectPastTimeLogAll());
});

window.addEventListener("load", initWhenLoad);

function initWhenLoad() {
  // 이전 기록이 없고 처음 접속하는 거라면 불러올 값이 없다.
  if (localStorage.length == 0) {
    console.log("Hi hello 😁");
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
  window.localStorage.setItem("pastTimeLog", objString);
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

function saveLogInLocalStorage(keyname, value) {
  window.localStorage.setItem(keyname, value);
}

function getLogFromLocalStorage() {
  const nowTime1String = window.localStorage.getItem("focusTime");
  const nowTime2String = window.localStorage.getItem("restTime");

  focusTimer.nowTime = new Date(+nowTime1String);
  restTimer.nowTime = new Date(+nowTime2String);

  const logString = window.localStorage.getItem("pastTimeLog");
  const logObj = JSON.parse(logString);
  pastTimeLogAll = logObj;
}

function getState() {
  if (pastTimeLogAll == "") {
    return;
  }
  stateFocus = pastTimeLogAll[pastTimeLogAll.length - 1].state;
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
let myChart;

Chart.defaults.plugins.tooltip.bodyFont = { size: 14 };
Chart.defaults.plugins.tooltip.padding = 10;
Chart.defaults.plugins.tooltip.boxPadding = 4;

const chartBtn = document.querySelector("#chart-button");
const chartContainer = document.querySelector(".pop-up__chart");
const chartDelBtn = document.querySelector(".chart__del-button");

chartBtn.addEventListener("click", getChart);
chartDelBtn.addEventListener("click", destroyChart);

function getChart() {
  console.log(focusTimer.nowTime.getTime());
  console.log(restTimer.nowTime.getTime());
  showPopUp(chartContainer, "pop-up__chart--show");
  const ctx = document.querySelector("#test1").getContext("2d");
  const labels = ["Focus", "Rest"];
  const data = {
    labels,
    datasets: [
      {
        label: "My First Dataset",
        data: [
          Math.floor(focusTimer.nowTime.getTime() / 1000),
          Math.floor(restTimer.nowTime.getTime() / 1000),
          // Math.floor(focusTimer.nowTime.getTime() / (1000 * 60)),
          // Math.floor(restTimer.nowTime.getTime() / (1000 * 60)),
        ],
        backgroundColor: ["#119621", "#ffa500"],
        hoverOffset: 4,
      },
    ],
  };
  const config = {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
        title: {
          display: true,
          text: "All day Focus or Rest",
        },
        subtitle: {
          display: true,
          text: "by minutes",
          padding: {
            bottom: 10,
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              if (context.formattedValue < 60) {
                return context.formattedValue + "secs";
              }
              return Math.floor(context.formattedValue / 60) + "mins";
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

  myChart = new Chart(ctx, config);
}

function destroyChart() {
  myChart.destroy();
  hidePopUp(chartContainer, "pop-up__chart--show");
}

function showPopUp(popUpType, className) {
  popUpType.classList.add(className);
}

function hidePopUp(popUpType, className) {
  popUpType.classList.remove(className);
}
