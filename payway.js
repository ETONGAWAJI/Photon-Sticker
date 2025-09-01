let minutes = 5;
let seconds = 0;
let intervalId;

const minutesElement = document.getElementById('tm');
const secondsElement = document.getElementById('ts');

function startTimer() {
  intervalId = setInterval(() => {
    if (seconds === 0) {
      if (minutes === 0) {
        clearInterval(intervalId);
        minutesElement.textContent = '00';
        secondsElement.textContent = '00';
      } else {
        minutes--;
        seconds = 59;
      }
    } else {
      seconds--;
    }

    minutesElement.textContent = String(minutes).padStart(2, '0');
    secondsElement.textContent = String(seconds).padStart(2, '0');
  }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  startTimer();
});


