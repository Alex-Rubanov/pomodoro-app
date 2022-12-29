'use strict';

const minutes = document.querySelector('.timer-minutes');
const  seconds = document.querySelector('.timer-seconds');

let totalTime = 25 * 60;
let remainingTime;

const addZero = (number) => {
    if (number >= 0 && number < 10) {
       return `0${number}`;
    } else {
        return number;
    }
};

function setTime() {
    totalTime--;
    remainingTime = totalTime;
    
    let sec = Math.floor(totalTime % 60);
    let min = Math.floor((totalTime / 60) % 25);

    function updateTime() {
        minutes.textContent = addZero(min);
        seconds.textContent = addZero(sec);   
    }

    
    updateTime();
    stopTimer();  
}

const timer = setInterval(() => setTime(), 10);

const stopTimer = () => {
    if (totalTime <= 0) {
        clearInterval(timer);

        minutes.textContent = '00';
        seconds.textContent = '00';
    }
};




