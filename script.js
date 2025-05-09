// DOM Elements
const minutesElement = document.getElementById('minutes');
const secondsElement = document.getElementById('seconds');
const statusElement = document.getElementById('status');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const sessionCounter = document.getElementById('session-counter');
const workTimeInput = document.getElementById('work-time');
const breakTimeInput = document.getElementById('break-time');
const saveSettingsButton = document.getElementById('save-settings');
const alarmSound = document.getElementById('alarm-sound');
const body = document.body;

// Timer variables
let timer;
let isRunning = false;
let isPaused = false;
let isWorkTime = true;
let totalSeconds = 25 * 60; // 25 minutes in seconds
let workTime = 25; // in minutes
let breakTime = 5; // in minutes
let sessionsCompleted = 0;

// Initialize the timer display
updateTimerDisplay();

// Event listeners
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
saveSettingsButton.addEventListener('click', saveSettings);

// Functions
function startTimer() {
    if (isRunning && !isPaused) return;
    
    if (isPaused) {
        isPaused = false;
    } else {
        isRunning = true;
        if (isWorkTime) {
            body.className = 'work-mode';
            statusElement.textContent = 'Work Time';
            totalSeconds = workTime * 60;
        } else {
            body.className = 'break-mode';
            statusElement.textContent = 'Break Time';
            totalSeconds = breakTime * 60;
        }
        updateTimerDisplay();
    }
    
    timer = setInterval(() => {
        totalSeconds--;
        
        if (totalSeconds <= 0) {
            clearInterval(timer);
            playAlarm();
            showNotification();
            
            if (isWorkTime) {
                sessionsCompleted++;
                sessionCounter.textContent = sessionsCompleted;
                isWorkTime = false;
                statusElement.textContent = 'Break Time';
                totalSeconds = breakTime * 60;
                body.className = 'break-mode';
            } else {
                isWorkTime = true;
                statusElement.textContent = 'Work Time';
                totalSeconds = workTime * 60;
                body.className = 'work-mode';
            }
            
            updateTimerDisplay();
            isRunning = false;
        } else {
            updateTimerDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    if (!isRunning) return;
    
    clearInterval(timer);
    isPaused = true;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    isWorkTime = true;
    totalSeconds = workTime * 60;
    statusElement.textContent = 'Work Time';
    body.className = '';
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    minutesElement.textContent = minutes.toString().padStart(2, '0');
    secondsElement.textContent = seconds.toString().padStart(2, '0');
}

function saveSettings() {
    const newWorkTime = parseInt(workTimeInput.value);
    const newBreakTime = parseInt(breakTimeInput.value);
    
    if (newWorkTime > 0 && newWorkTime <= 60) {
        workTime = newWorkTime;
    }
    
    if (newBreakTime > 0 && newBreakTime <= 30) {
        breakTime = newBreakTime;
    }
    
    resetTimer();
    alert('Settings saved!');
}

function playAlarm() {
    alarmSound.currentTime = 0;
    alarmSound.play();
}

function showNotification() {
    // Check if browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications");
        return;
    }
    
    // Check if permission is already granted
    if (Notification.permission === "granted") {
        createNotification();
    } 
    // Otherwise, request permission
    else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                createNotification();
            }
        });
    }
    
    // Create a custom notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = isWorkTime ? 
        'Break time! Take 5 minutes to relax.' : 
        'Work time! Focus for the next 25 minutes.';
    
    document.body.appendChild(notification);
    
    // Remove the notification after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function createNotification() {
    const title = isWorkTime ? 'Break Time!' : 'Work Time!';
    const options = {
        body: isWorkTime ? 
            'Take a 5-minute break to relax.' : 
            'Time to focus for the next 25 minutes.',
        icon: 'favicon.ico'
    };
    
    const notification = new Notification(title, options);
    
    // Close the notification after 5 seconds
    setTimeout(() => {
        notification.close();
    }, 5000);
}