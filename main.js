"use strict";

let timerId1;
let time1 = 0;
let timerRunning1 = false;

let timerId2;
let time2 = 0;
let timerRunning2 = false;

let stateStudying = false;

const screen = document.querySelector(".screen");
const screenText = document.querySelector(".screen__text");
// const stopBtn = document.querySelector(".stop-button");
const resetBtn = document.querySelector(".reset-button");
const stateText = document.querySelector(".state__text");

const timeRecordStudy = document.querySelector(".study__time");
const timeRecordBreak = document.querySelector(".break__time");

let startTime1 = 0;
let stopTime1 = 0;
let nowTime1;

let startTime2 = 0;
let stopTime2 = 0;
let nowTime2;

let timerId;

function addZero(num) {
  return num < 10 ? "0" + num : "" + num;
}

/* class Timer {
  constructor() {
    this.time;
    this.timerId;
    this.isRunning;
    this.state;
  }
  changeState()
  update(){
    let hours = Math.floor(this.time / 3600);
    let mins = Math.floor((this.time % 3600) / 60);
    let secs = Math.floor(this.time % 60);

    hours = hours < 10 ? `0${hours}` : hours;
    mins = mins < 10 ? `0${mins}` : mins;
    secs = secs < 10 ? `0${secs}` : secs;

    displayTimeText(hours, mins, secs);
    displayTotalTimeRecord(timeRecordStudy, hours, mins, secs);

    this.time++;
  }
  start(){
    this.isRunning = true;
    this.update();
    this.timerId = setInterval(this.update, 1000);
  }
  stop(){
    this.isRunning = false;
    clearInterval(this.timerId);
  }
  reset(){
    this.time = 0;
    this.isRunning = false;
    this.state = false;
  
    //
    elapsedTimeLogAll = [];
    localStorage.clear();
  
    this.update();
    this.stop();
  }

} */

// click screen and start timer
screen.addEventListener("click", onScreenClick);

// // click stop button and stop timer
// stopBtn.addEventListener("click", () => {
//   stopTimer1();
//   stopTimer2();
//   stateStudying = !stateStudying;
// });

// click reset button and reset timer
resetBtn.addEventListener("click", resetTimer);

// When Click Screen
function onScreenClick() {
  onStudying();
  onBreaking();
  changeStateText(stateStudying);
  getRealtimeSecs();
  saveElapsedInLocalStorage(getElapsedTimeLogAll());
  stateStudying = !stateStudying;
  console.log(stateStudying);
}

// When the State is studying
function onStudying() {
  if (stateStudying) {
    stopTimer1();
    console.log("stop study timer");
  } else {
    startTimer1();
    console.log("start study timer");
  }
}

// When the State is breaktime
function onBreaking() {
  if (stateStudying) {
    startTimer2();
    console.log("start break timer");
  } else {
    stopTimer2();
    console.log("stop break timer");
  }
}

// change text by the state on the header
function changeStateText(state) {
  stateText.textContent = state ? "Breaking" : "Studying";
}

// Start Timer1
function startTimer1() {
  if (!startTime1) {
    startTime1 = Date.now(); // 처음 시작할 때
  } else {
    startTime1 += Date.now() - stopTime1; // 재시작 할 때
  }
  timerRunning1 = true;
  // updateTimer1();
  timerId1 = setInterval(updateTimer1, 1000);
}
// Stop Timer1
function stopTimer1() {
  stopTime1 = Date.now(); // STOP시점의 시간 저장
  timerRunning1 = false;
  clearInterval(timerId1);
}

// Start Timer2
function startTimer2() {
  if (!startTime2) {
    startTime2 = Date.now(); // 처음 시작할 때
  } else {
    startTime2 += Date.now() - stopTime2; // 재시작 할 때
  }
  timerRunning2 = true;
  // updateTimer2();
  timerId2 = setInterval(updateTimer2, 1000);
}
// Stop Timer2
function stopTimer2() {
  stopTime2 = Date.now(); // STOP시점의 시간 저장
  timerRunning2 = false;
  clearInterval(timerId2);
}

// Reset Timer
function resetTimer() {
  startTime1 = 0;
  stopTime1 = 0;
  nowTime1 = new Date(0);
  console.log(nowTime1);
  timerRunning1 = false;

  startTime2 = 0;
  stopTime2 = 0;
  nowTime2 = new Date(0);
  timerRunning2 = false;

  stateStudying = false;

  //
  elapsedTimeLogAll = [];
  // localStorage.removeItem("elapsed");
  localStorage.clear();

  updateTimer1(nowTime1);
  updateTimer2(nowTime2);
  clearInterval(timerId1);
  clearInterval(timerId2);
}

// Update Timer1
function updateTimer1(time) {
  if (time) {
    nowTime1 = time;
  } else {
    nowTime1 = new Date(Date.now() - startTime1);
  }

  let secs = addZero(nowTime1.getSeconds());
  let mins = addZero(nowTime1.getMinutes());
  let hours = addZero(Math.floor(mins / 60));

  displayTimeText(hours, mins, secs);
  displayTotalTimeRecord(timeRecordStudy, hours, mins, secs);
}

// Update Timer2
function updateTimer2(time) {
  if (time) {
    nowTime2 = time;
  } else {
    nowTime2 = new Date(Date.now() - startTime2);
  }

  let secs = addZero(nowTime2.getSeconds());
  let mins = addZero(nowTime2.getMinutes());
  let hours = addZero(Math.floor(mins / 60));

  displayTimeText(hours, mins, secs);
  displayTotalTimeRecord(timeRecordBreak, hours, mins, secs);
}

// show time text on screen
function displayTimeText(hours, mins, secs) {
  screenText.textContent = `${hours}:${mins}:${secs}`;
}

// show time record log on footer
function displayTotalTimeRecord(state, hours, mins, secs) {
  state.textContent = `${hours}:${mins}:${secs}`;
}

//
//
// get real-time
let msecsOfToday;
function getRealtimeSecs() {
  let realYear = new Date().getFullYear();
  let realMonth = new Date().getMonth();
  let realDate = new Date().getDate();
  let realtimeDefault = new Date(realYear, realMonth, realDate, 0, 0, 0);
  let realtime = new Date();

  msecsOfToday = realtime.getTime() - realtimeDefault.getTime();
  // secsOfToday이걸 id값 마냥 전달해주면 될듯...
  // secsOfToday이것만 있으면 오늘 시간 알 수 있다

  // let hmsOfToday = convertSecsToTime(msecsOfToday);
  // console.log(hmsOfToday.hours, hmsOfToday.mins, hmsOfToday.secs);
}

// 1. 생성자 함수를 이용해 객체를 만든다
// 2. 만들어진 객체를 배열에 넣는다
// 3. 그 배열을 LocalStorage에 저장~❤
// let elapsedTime;
function ElapsedTimeLog(state, realtime) {
  this.state = state;
  this.realtime = realtime;
  this.elapsedTime;
}
let elapsedTimeLogAll = [];
function getElapsedTimeLogAll() {
  const array = new ElapsedTimeLog(stateStudying, msecsOfToday);
  elapsedTimeLogAll.push(array);
  return elapsedTimeLogAll;
}
// 이 parameter 이름을 어떻게 해줘야할까 단순 obj말고
// elapsedTimeLogAll을 전달해주는건데 이게 전역변수이다.
// 전달 안하고 그냥 써도 될까??
function saveElapsedInLocalStorage(obj) {
  getElapsedTime(obj);
  const objString = JSON.stringify(obj);
  window.localStorage.setItem("elapsed", objString);
}
// 경과된 시간값 얻기
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

window.addEventListener("beforeunload", () => {
  saveLogInLocalStorage("studyingTime", nowTime1);
  saveLogInLocalStorage("breakingTime", nowTime2);

  getRealtimeSecs();
  saveElapsedInLocalStorage(getElapsedTimeLogAll());
  // const objString = JSON.stringify(elapsedTimeLogAll);
  // saveLogInLocalStorage("elapsed", objString);
});

function getLogFromLocalStorage() {
  const nowTime1String = window.localStorage.getItem("studyingTime");
  const nowTime2String = window.localStorage.getItem("breakingTime");

  nowTime1 = new Date(nowTime1String.split(" ").slice(0, 5));
  nowTime2 = new Date(nowTime2String.split(" ").slice(0, 5));

  const logString = window.localStorage.getItem("elapsed");
  const logObj = JSON.parse(logString);
  elapsedTimeLogAll = logObj;
}

getLogFromLocalStorage();

function getState() {
  if (elapsedTimeLogAll == "") {
    return;
  }
  stateStudying = elapsedTimeLogAll[elapsedTimeLogAll.length - 1].state;
}

getState();
getRealtimeSecs();
changeStateText(!stateStudying);
// 새로고침되면 default상태인데도 자동 작동이 되어버린다.
// 일단 임시방편으로 이렇게 해놓고 다시 손보자

// 여기부터 다시~~
console.log(nowTime2);
if (nowTime1.getSeconds() > 0 || nowTime2.getSeconds() > 0) {
  console.log("hihihihihihi");
  let elapsedMseconds1 =
    nowTime1.getTime() +
    msecsOfToday -
    elapsedTimeLogAll[elapsedTimeLogAll.length - 1].realtime;
  let elapsedMseconds2 =
    nowTime2.getTime() +
    msecsOfToday -
    elapsedTimeLogAll[elapsedTimeLogAll.length - 1].realtime;

  if (stateStudying) {
    nowTime1 = new Date(elapsedMseconds1);
    updateTimer2(nowTime2);
    updateTimer1(nowTime1);

    startTimer1();
  } else {
    nowTime2 = new Date(elapsedMseconds2);
    updateTimer1(nowTime1);
    updateTimer2(nowTime2);

    startTimer2();
    // nowTime2 +=
    //   msecsOfToday - elapsedTimeLogAll[elapsedTimeLogAll.length - 1].realtime;
  }
}

// 이제 원하는 정보는 다 구했나?? 2022-04-23

// isStop = true일 경우에 저장되는 값에 대해서도 생각해보자
// stop이라면 state 둘 중 어느곳도 아니다 제3의 상태이다.
//

// Jooms!! 😆😆😆
/* 해야할 일
- time1,2가 들어간 곳 리팩토링한 것에 맞게 고치기
*/
