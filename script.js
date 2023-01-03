'use strict';

const DEFAULT_SESSION_TIME = 25;
const DEFAULT_BREAK_TIME = 5;
const SESSION_TIME_COLOR = 'rgb(250, 128, 114)';
const BREAK_TIME_COLOR = 'rgb(107,142,35)';
const SVG_STROKE_DASHOFFSET = -912;

const startBtn = document.querySelector('.start-btn');
const resetBtn = document.querySelector('.reset-btn');
const circle = document.querySelector('.app-circle');
const circleBorder = document.querySelector('.app-circle svg circle');
const circleTimer = document.querySelector('.app-circle svg circle:nth-child(2)');
const sessionTimeInput = document.querySelector('#session');
const breakTimeInput = document.querySelector('#break');

let minutes = document.querySelector('.timer-minutes');
let seconds = document.querySelector('.timer-seconds');
let sessionMinutes = DEFAULT_SESSION_TIME, breakMinutes = DEFAULT_BREAK_TIME;
let totalTime = sessionMinutes * 60, breakTime = breakMinutes * 60;

let remainingSessionTime = totalTime;
let intervalID;
let breakTimeID = true;

// Step for circleTimeProgress and updateCircleTime()
let step = +(SVG_STROKE_DASHOFFSET / totalTime);
let circleTimeProgress = 0; 

// Color fill inside the circle and it's pace
let colorFill = 100 / totalTime;
let colorFillProgress = 0; 

const setTime = () => {
    if (sessionMinutes) {
        totalTime = sessionMinutes * 60;
        remainingSessionTime = totalTime;

        step = +(SVG_STROKE_DASHOFFSET / totalTime);
        colorFill = 100 / totalTime;  
    }

    if (breakMinutes) {
        breakTime = breakMinutes * 60;
    }

    minutes.textContent = addZero(sessionMinutes);
};

const updateScreenTimeInfo = () => {
    const sessionInfo = document.querySelector('.session-value');
    const breakInfo = document.querySelector('.break-value');
 
    sessionInfo.textContent = `Session time: ${sessionMinutes} min`;
    breakInfo.textContent = `Break time: ${breakMinutes} min`;
};

const setScreenTimeInfoToDefault = () => {
    sessionMinutes = DEFAULT_SESSION_TIME;
    breakMinutes = DEFAULT_BREAK_TIME;

    updateScreenTimeInfo(sessionMinutes);
    updateScreenTimeInfo(breakMinutes);
    setTime();
    clearBorderProgressBar();
};

const setSessionMinutes = () => {
    sessionTimeInput.addEventListener('keydown', (e) => {

        if (e.code === 'Enter') {
            if (startBtn.className === 'pause-btn' && remainingSessionTime === 0) {
                colorFillProgress = 0;
                
                stopTimer();
                resetTimer();
                switchBtnToStart();      
            }

            sessionMinutes = +(sessionTimeInput.value);
            sessionTimeInput.value = '';
            minutes.textContent = addZero(sessionMinutes);

            updateScreenTimeInfo(sessionMinutes);
            setTime();
        }
    });
};

setSessionMinutes();

const setBreakMinutes = () => {
    breakTimeInput.addEventListener('keydown', (e) => {

        if (e.code === 'Enter') {
            if (startBtn.className === 'pause-btn' && remainingSessionTime === 0) {
                colorFillProgress = 0;
                
                stopTimer();
                resetTimer();
                setTime();
                switchBtnToStart();      
            }

            breakMinutes = +(breakTimeInput.value);
            breakTimeInput.value = '';

            updateScreenTimeInfo(breakMinutes);
        }
    });
};

setBreakMinutes();

const addZero = (number) => {
    if (number >= 0 && number < 10) {
       return `0${number}`;
    }

    return number;  
};

const updateClockTime = (min = 25, sec = 0) => {
    minutes.textContent = addZero(min);
    seconds.textContent = addZero(sec);     
};  

const updateCircleBorderProgress = () => {
    circleTimeProgress += step;
    
    circleTimer.style.strokeDashoffset = circleTimeProgress;
};

const updateColorProgressBar = () => {
    colorFillProgress += colorFill;

    circle.style.setProperty('--height', `${colorFillProgress}%`);
};

const setClockTime = () => {
    remainingSessionTime--; 

    let sec = Math.floor(remainingSessionTime % 60);
    let min = Math.floor((remainingSessionTime / 60) % 25);

    updateClockTime(min, sec);
    updateCircleBorderProgress();
    updateColorProgressBar();
    clearTimer(); 
};

const createAnimatedCircle = (delay) => {
    const parentNode = document.querySelector('.app-circle');
    const animationClass = breakTimeID ? 'app-circle--border-red' : 'app-circle--border-green';

    const circleAnimation = document.createElement('div');
    circleAnimation.classList.add(animationClass);
    parentNode.prepend(circleAnimation); 

    parentNode.style.overflow = 'visible';

    setTimeout(() => {
        circleAnimation.remove();
        parentNode.style.overflow = 'hidden';
    }, delay);
};

const switchToBreakTime = () => {
    setTime();

    remainingSessionTime = breakTime;
    step = +(SVG_STROKE_DASHOFFSET / breakTime);

    colorFillProgress = 0;
    colorFill = 100 / breakTime;
    circleBorder.style.stroke = BREAK_TIME_COLOR;

    intervalID = setInterval(setClockTime, 10);    
};

const clearTimer = () => {
    if (remainingSessionTime <= 0) {
        clearInterval(intervalID);
        createAnimatedCircle(10000);

        if (breakTimeID) {  
            setTimeout(switchToBreakTime, 10000);
        }

        minutes.textContent = '00';
        seconds.textContent = '00';

        breakTimeID = !breakTimeID;
    }
    return;
};

const stopTimer = () => {
    clearInterval(intervalID);
};

const clearBorderProgressBar = () => {
    step = breakTimeID ? +(SVG_STROKE_DASHOFFSET / totalTime) : +(SVG_STROKE_DASHOFFSET / breakTime);
    circleTimeProgress = Math.abs(step);
    circleBorder.style.stroke = SESSION_TIME_COLOR;
};

const clearColorFillProgress = () => {
    colorFillProgress = 0;
    colorFill = 100 / totalTime;
    circle.style.setProperty('--height', 0);
};


const resetTimer = () => {
    if (!breakTimeID) {
        breakTimeID = !breakTimeID;
    }

    remainingSessionTime = totalTime;

    clearBorderProgressBar();
    clearColorFillProgress();
    setScreenTimeInfoToDefault();
    updateCircleBorderProgress();
    updateClockTime();
    stopTimer();
    switchBtnToStart();
};

const switchBtnToStart = () => {
    startBtn.textContent = 'Start';
    startBtn.className = 'start-btn';
};

const switchBtnToPause= () => {
    startBtn.textContent = 'Pause';
    startBtn.className = 'pause-btn';
};

resetBtn.addEventListener('click', () => {
    resetTimer();
});

startBtn.addEventListener('click', () => {
    if (startBtn.className === 'pause-btn' && remainingSessionTime > 0) {
        stopTimer();
        switchBtnToStart();  
        return;     
    }
    
    if (startBtn.className === 'start-btn' && remainingSessionTime > 0) {
        intervalID = setInterval(setClockTime, 10); 
        switchBtnToPause(); 
        return;
    }
});

const switchSoundMode = () => {
    const soundOn = document.querySelector('.icon-music_note');
    const soundMode = document.querySelector('[data-sound-mode]');

    soundMode.addEventListener('click', () => {
        if (soundMode.classList.contains('icon-music_off')) {
            soundMode.className = 'icon-music_note';
            return;
        }

        soundOn.className = 'icon-music_off';
        soundOn.classList.toggle('disabled');
    });

    
};

switchSoundMode();

const switchLoopMode = () => {
    const loopOn = document.querySelector('.icon-loop');
    const loopMode = document.querySelector('[data-loop-mode]');

    loopMode.addEventListener('click', () => {
        if (loopMode.classList.contains('icon-sync_disabled')) {
            loopMode.className = 'icon-loop';
            return;
        }

        loopOn.className = 'icon-sync_disabled';
        loopMode.classList.toggle('disabled');
    });
};

switchLoopMode();

const showSettingsMenu = (element) => {
    const settingsMenu = document.querySelector('.settings-menu');

    if (element.classList.contains('active')) {
        settingsMenu.style.setProperty('opacity', 1);
        return;
    }

    settingsMenu.style.setProperty('opacity', 0);  
};

const showNotes = (element) => {
    const notes = document.querySelector('.notes-history');

    if (element.classList.contains('active')) {
        notes.classList.add('show');
        return;
    }

    notes.classList.remove('show');
};

const hideNotes = () => {
    const closeBtn = document.querySelector('.close-btn');

    closeBtn.addEventListener('click', () => {
        const notesHistory = document.querySelector('.notes-history');
        const notesMenu = document.querySelector('.icon-notes');

        notesHistory.classList.remove('show');
        notesMenu.classList.remove('active');

    });
};

hideNotes();

const switchActiveClass = () => {
    const icons = document.querySelectorAll('[data-icon]');

    icons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.target.classList.toggle('active');

            if (e.target.classList.contains('icon-settings')) {
                showSettingsMenu(icon);
            } 

            if (e.target.classList.contains('icon-notes')) {
                showNotes(icon);
            }
        });
    });
};

switchActiveClass();

