'use strict';

const minutes = document.querySelector('.timer-minutes');
const seconds = document.querySelector('.timer-seconds');
const playBtn = document.querySelector('.play-btn');
const resetBtn = document.querySelector('.reset-btn');

let totalTime = 25 * 60;
let breakTime = 5 * 60;
let remainingTime = totalTime;
let intervalID;

const addZero = (number) => {
    if (number >= 0 && number < 10) {
       return `0${number}`;
    } else {
        return number;
    }
};

const updateTime = (min = 25, sec = 0) => {
    minutes.textContent = addZero(min);
    seconds.textContent = addZero(sec);     
};

function setTime() {
    remainingTime--; 

    let sec = Math.floor(remainingTime % 60);
    let min = Math.floor((remainingTime / 60) % 25);

    updateTime(min, sec);
    clearTimer(); 
}




const clearTimer = () => {
    if (remainingTime <= 0) {
        clearInterval(intervalID);

        minutes.textContent = '00';
        seconds.textContent = '00';
    }
};

const stopTimer = () => {
    clearInterval(intervalID);
};

resetBtn.addEventListener('click', () => {
    remainingTime = totalTime;

    updateTime();
    stopTimer();
});

playBtn.addEventListener('click', () => {
    if (playBtn.className === 'pause-btn') {
        stopTimer();

        playBtn.textContent = 'Play';
        playBtn.className = 'play-btn';
    } else {
        intervalID = setInterval(setTime, 10); 
    
        playBtn.textContent = 'Pause';
        playBtn.className = 'pause-btn';
    }
});

