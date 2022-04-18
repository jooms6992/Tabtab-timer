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
const stopBtn = document.querySelector(".stop-button");
const resetBtn = document.querySelector(".reset-button");
const stateText = document.querySelector(".state__text");

const timeRecordStudy = document.querySelector(".study__time");
const timeRecordBreak = document.querySelector(".break__time");

// click screen and start timer
screen.addEventListener("click", onScreenClick);

// click stop button and stop timer
stopBtn.addEventListener("click", () => {
  stopTimer1();
  stopTimer2();
});

// click reset button and reset timer
resetBtn.addEventListener("click", resetTimer);

// When Click Screen
function onScreenClick() {
  onStudying();
  onBreaking();
  changeStateText();
  stateStudying = !stateStudying;
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
function changeStateText() {
  stateText.textContent = stateStudying ? "Breaking" : "Studying";
}

// Start Timer1
function startTimer1() {
  timerRunning1 = true;
  updateTimer1();
  timerId1 = setInterval(updateTimer1, 1000);
}
// Stop Timer1
function stopTimer1() {
  timerRunning1 = false;
  clearInterval(timerId1);
}

// Start Timer2
function startTimer2() {
  timerRunning2 = true;
  updateTimer2();
  timerId2 = setInterval(updateTimer2, 1000);
}
// Stop Timer2
function stopTimer2() {
  timerRunning2 = false;
  clearInterval(timerId2);
}

// Reset Timer
function resetTimer() {
  time1 = 0;
  timerRunning1 = false;

  time2 = 0;
  timerRunning2 = false;

  stateStudying = false;

  updateTimer1();
  updateTimer2();
  stopTimer1();
  stopTimer2();
}

// Update Timer1
function updateTimer1() {
  let hms = convertSecsToTime(time1);

  let hours = hms.hours;
  let mins = hms.mins;
  let secs = hms.secs;

  displayTimeText(hours, mins, secs);
  displayTotalTimeRecord(timeRecordStudy, hours, mins, secs);

  time1++;
}

// Update Timer2
function updateTimer2() {
  let hms = convertSecsToTime(time2);

  let hours = hms.hours;
  let mins = hms.mins;
  let secs = hms.secs;

  displayTimeText(hours, mins, secs);
  displayTotalTimeRecord(timeRecordBreak, hours, mins, secs);

  time2++;
}

// convert time to hours:minutes:seconds
function convertSecsToTime(time) {
  let hours = Math.floor(time / 3600);
  let mins = Math.floor((time % 3600) / 60);
  let secs = Math.floor(time % 60);

  // 0이 붙으면 문자열로 반환이된다. 일단은 문제는 없는데,, 메모해둠
  hours = hours < 10 ? `0${hours}` : hours;
  mins = mins < 10 ? `0${mins}` : mins;
  secs = secs < 10 ? `0${secs}` : secs;

  return { hours, mins, secs };
}

// show time text on screen
function displayTimeText(hours, mins, secs) {
  screenText.textContent = `${hours}:${mins}:${secs}`;
}

// show time record log on footer
function displayTotalTimeRecord(state, hours, mins, secs) {
  state.textContent = `${hours}:${mins}:${secs}`;
}

// Local storage
// 1. declare function that saves time-log in the Local Storage
// 2. execute function before browser get refreshed or closed
// 3. get data from the Local Storage
function saveTimeLogInLocalStorage(studyingTime, breakingTime) {
  localStorage.setItem("studyingTime", studyingTime);
  localStorage.setItem("breakingTime", breakingTime);
}

window.addEventListener("beforeunload", () => {
  saveTimeLogInLocalStorage(time1, time2);
});

function getTimeLogFromLocalStorage() {
  // -1 because time increase when web is initialized by func updateTimer()
  time1 = localStorage.getItem("studyingTime") - 1;
  time2 = localStorage.getItem("breakingTime") - 1;
}

getTimeLogFromLocalStorage();
updateTimer1();
updateTimer2();

//
//
// get real-time

let realYear = new Date().getFullYear();
let realMonth = new Date().getMonth();
let realDate = new Date().getDate();
let realtimeDefault = new Date(realYear, realMonth, realDate, 0, 0, 0);
let realtime = new Date();
console.log(realtimeDefault);
console.log(realtime);
let secsOfToday = (realtime.getTime() - realtimeDefault.getTime()) / 1000;
// secsOfToday이걸 id값 마냥 전달해주면 될듯...

let hmsOfToday = convertSecsToTime(secsOfToday);
console.log(hmsOfToday.hours, hmsOfToday.mins, hmsOfToday.secs);

function saveTimeLogWithRealtime() {}
// saveTimeLogWithRealtime(hmsOfToday.hours, hmsOfToday.mins, hmsOfToday.secs);
