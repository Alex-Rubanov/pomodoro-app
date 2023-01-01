'use strict';

const SESSION_TIME_COLOR = 'rgb(250, 128, 114)';
const BREAK_TIME_COLOR = 'rgb(107,142,35)';
const SVG_STROKE_DASHOFFSET = -943;

const minutes = document.querySelector('.timer-minutes');
const seconds = document.querySelector('.timer-seconds');
const playBtn = document.querySelector('.play-btn');
const resetBtn = document.querySelector('.reset-btn');
const circleBorder = document.querySelector('.app-circle svg circle');
const circleTimer = document.querySelector('.app-circle svg circle:nth-child(2)');

const totalTime = 25 * 60;
const breakTime = 5 * 60;

let remainingSessionTime = totalTime;
let intervalID;
let breakID = true;

// Step for circleTimeProgress and updateCircleTime()
let step = +(SVG_STROKE_DASHOFFSET / totalTime); 
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

const setTime = () => {
    remainingSessionTime--; 

    let sec = Math.floor(remainingSessionTime % 60);
    let min = Math.floor((remainingSessionTime / 60) % 25);

    updateTime(min, sec);
    updateCircleTime();
    clearTimer(); 
};

const animateCircle = (duration) => {
    const parentNode = document.querySelector('.app-circle');
    const animationClass = breakID ? 'app-circle--border-red' : 'app-circle--border-green';

    const circleAnimation = document.createElement('div');
    circleAnimation.classList.add(animationClass);
    parentNode.prepend(circleAnimation); 

    setTimeout(() => {
        circleAnimation.remove();
    }, duration);
};

const switchToBreakTime = () => {
    remainingSessionTime = breakTime;
    step = +(SVG_STROKE_DASHOFFSET / breakTime);

    circleBorder.style.stroke = BREAK_TIME_COLOR;
    intervalID = setInterval(setTime, 10); 
};

const clearTimer = () => {
    if (remainingSessionTime <= 0) {
        clearInterval(intervalID);
        animateCircle(10000);

        if (breakID) {  
            setTimeout(switchToBreakTime, 10000);
        }

        minutes.textContent = '00';
        seconds.textContent = '00';

        breakID = !breakID;
    }
    return;
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
    remainingSessionTime = totalTime;
    step = breakID ? +(SVG_STROKE_DASHOFFSET / totalTime) : +(SVG_STROKE_DASHOFFSET / breakTime);
    circleTimeProgress = Math.abs(step);
    circleBorder.style.stroke = SESSION_TIME_COLOR;

    updateCircleTime();
    updateTime();
    stopTimer();
    switchBtnToPlay();
});

playBtn.addEventListener('click', () => {
    if (playBtn.className === 'pause-btn' && remainingSessionTime > 0) {
        stopTimer();
        switchBtnToPlay();  
        return;     
    }
    
    if (playBtn.className === 'play-btn' && remainingSessionTime > 0) {
        intervalID = setInterval(setTime, 10); 
        switchBtnToPause(); 
        return;
    }
});