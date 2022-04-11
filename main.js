"use strict";

let timerId;
let time = 0;
let timerRunning = false;
let stateStudying = false;

const screen = document.querySelector(".screen");
const screenText = document.querySelector(".screen__text");
const stopBtn = document.querySelector(".stop-button");

// click screen and start timer
screen.addEventListener("click", () => {
  if (stateStudying) {
    onBreaking();
  } else {
    onStudying();
  }
});
stopBtn.addEventListener("click", stopTimer);

// Update Timer
function updateTimer() {
  let hours = Math.floor(time / 3600);
  let mins = Math.floor(time / 60);
  let secs = time % 60;

  hours = hours < 10 ? `0${hours}` : hours;
  mins = mins < 10 ? `0${mins}` : mins;
  secs = secs < 10 ? `0${secs}` : secs;

  screenText.textContent = `${hours}:${mins}:${secs}`;

  time++;
}

// Start Timer
function startTimer() {
  timerRunning = true;
  updateTimer();
  timerId = setInterval(updateTimer, 1000);
}

// Stop Timer
function stopTimer() {
  timerRunning = false;
  clearInterval(timerId);
}

// Reset Timer
function resetTimer() {}

// When the State is studying
function onStudying() {
  if (timerRunning) {
  }
}

// When the State is breaktime
function onBreaking() {}
