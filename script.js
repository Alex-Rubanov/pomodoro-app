'use strict';

const minutes = document.querySelector('.timer-minutes');
const seconds = document.querySelector('.timer-seconds');
const playBtn = document.querySelector('.play-btn');
const resetBtn = document.querySelector('.reset-btn');
const circleTimer = document.querySelector('.app-circle svg circle:nth-child(2)');

let totalTime = 25 * 60;
let breakTime = 5 * 60;
let remainingTime = totalTime;
let intervalID;

// Step for circleTimeProgress and updateCircleTime()
const step = +(-943 / totalTime); 
let circleTimeProgress = 0; 

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

const updateCircleTime = () => {
    circleTimeProgress += step;
    
    circleTimer.style.strokeDashoffset = circleTimeProgress;
};

function setTime() {
    remainingTime--; 

    let sec = Math.floor(remainingTime % 60);
    let min = Math.floor((remainingTime / 60) % 25);

    updateTime(min, sec);
    updateCircleTime();
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

const switchBtnToPlay = () => {
    playBtn.textContent = 'Play';
    playBtn.className = 'play-btn';
};

const switchBtnToPause= () => {
    playBtn.textContent = 'Pause';
    playBtn.className = 'pause-btn';
};

resetBtn.addEventListener('click', () => {
    remainingTime = totalTime;
    circleTimeProgress = Math.abs(step);

    updateCircleTime();
    updateTime();
    stopTimer();
    switchBtnToPlay();
});

playBtn.addEventListener('click', () => {
    if (playBtn.className === 'pause-btn' && remainingTime > 0) {
        stopTimer();
        switchBtnToPlay();  
        return;     
    }
    
    if (playBtn.className === 'play-btn' && remainingTime > 0) {
        intervalID = setInterval(setTime, 10); 
        switchBtnToPause(); 
        return;
    }
});