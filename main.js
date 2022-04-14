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

// Update Timer
function updateTimer1() {
  let hours = Math.floor(time1 / 3600);
  let mins = Math.floor(time1 / 60);
  let secs = time1 % 60;

  hours = hours < 10 ? `0${hours}` : hours;
  mins = mins < 10 ? `0${mins}` : mins;
  secs = secs < 10 ? `0${secs}` : secs;

  displayTimeText(hours, mins, secs);
  displayTotalTimeRecord(timeRecordStudy, hours, mins, secs);

  time1++;
}

function updateTimer2() {
  let hours = Math.floor(time2 / 3600);
  let mins = Math.floor(time2 / 60);
  let secs = time2 % 60;

  hours = hours < 10 ? `0${hours}` : hours;
  mins = mins < 10 ? `0${mins}` : mins;
  secs = secs < 10 ? `0${secs}` : secs;

  displayTimeText(hours, mins, secs);
  displayTotalTimeRecord(timeRecordBreak, hours, mins, secs);

  time2++;
}

// show time text on screen
function displayTimeText(hours, mins, secs) {
  screenText.textContent = `${hours}:${mins}:${secs}`;
}

// show time record log on footer
function displayTotalTimeRecord(state, hours, mins, secs) {
  state.textContent = `${hours}:${mins}:${secs}`;
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

// When Click Screen
function onScreenClick() {
  onStudying();
  onBreaking();
  changeStateText();
  // displayTotalTimeRecord();
  stateStudying = !stateStudying;
}

// change text by the state on the header
function changeStateText() {
  stateText.textContent = stateStudying ? "Breaking" : "Studying";
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
  time1 = localStorage.getItem("studyingTime") - 1;
  time2 = localStorage.getItem("breakingTime") - 1;
}
getTimeLogFromLocalStorage();
updateTimer1();
updateTimer2();
