var tDisplay = document.getElementById('time'),
    pauseBtn = document.getElementById('pause'),
    startBtn = document.getElementById('start'),
    resetBtn = document.getElementById('reset'),
    workIntInc = document.getElementById('work-int-inc'),
    workIntDec = document.getElementById('work-int-dec'),
    breakIntInc = document.getElementById('break-int-inc'),
    breakIntDec = document.getElementById('break-int-dec'),
    intervalLabel = document.getElementsByClassName('ctl-label')[0],
    breakLabel = document.getElementsByClassName('ctl-label')[1],
    minuteHand = document.getElementById('minuteHand'),
    secondHand = document.getElementById('secondHand'),
    completed = document.getElementsByClassName('completed')[0],
    paused = document.getElementsByClassName('paused')[0],
    working = document.getElementsByClassName('working')[0],
    breaking = document.getElementsByClassName('onBreak')[0],
    audio = new Audio('chimes.mp3');
// audio is first 10 seconds from http://www.freesound.org/people/juskiddink/sounds/86277/

// pomodoro module
var Pom = (function(){
    var pomodoro = 1500, // 25 minutes
        brk = 300, // 5 minutes
        onBreak = false,
        count,
        timer,
        totalIntervals = 0;

    function init(){
        count = pomodoro;
        _updateDisplay();
    }
    function start() {
        if (timer) {
            clearInterval(timer);
        }
        paused.style.display = "none";
        if (onBreak) {
            working.style.display = "none";
            breaking.style.display = "inline";
        } else {
            working.style.display = "inline";
            breaking.style.display = "none";
        }
        timer = setInterval(_countDown, 1000);
    }
    function pause() {
        paused.style.display = "inline";
        working.style.display = "none";
        breaking.style.display = "none";
        clearInterval(timer);
    }
    function reset(){
        clearInterval(timer);
        init();
    }
    function setTime(time){
        pomodoro = time;
        init();
    }
    function setBreak(breakTime){
        brk = breakTime;
        init();
    }
    function _startBreak() {
        count = brk;
        _updateDisplay();
        working.style.display = "none";
        breaking.style.display = "inline";
        timer = setInterval(_countDown, 1000);
    }
    function _countDown(){
        count--;
        _updateDisplay();
        if (count === 0) {
            clearInterval(timer);
            audio.play();
            if(onBreak) {
                init();
                onBreak = false;
                start();
            } else {
                totalIntervals++;
                completed.innerHTML = totalIntervals;
                onBreak = true;
                _startBreak();
            }
        }
    }
    function _updateDisplay(){
        var minutes = Math.floor(count / 60);
        var seconds = count % 60;
        var mRot = minutes * 6;
        var sRot = seconds * 6;
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        secondHand.setAttribute("transform", "rotate(" + sRot + ")");
        minuteHand.setAttribute("transform", "rotate(" + mRot + ")");
        tDisplay.innerHTML = minutes + ':' + seconds;
    }

    return {
        init: init,
        start: start,
        pause: pause,
        reset: reset,
        setTime: setTime,
        setBreak: setBreak
    };

})();
Pom.init();
startBtn.addEventListener("click", Pom.start);
pauseBtn.addEventListener("click", Pom.pause);
resetBtn.addEventListener("click", Pom.reset);

var WorkIntervalCtl = (function(){
    var count = 25; // default pomodoro time

    function increment(){
        count++;
        intervalLabel.innerHTML = count;
        Pom.pause();
        Pom.setTime(count * 60);
    }
    function decrement(){
        if (count > 1) {
            count--;
            intervalLabel.innerHTML = count;
            Pom.pause();
            Pom.setTime(count * 60);
        }
    }
    return {
        increment: increment,
        decrement: decrement
    };
})();
workIntDec.addEventListener("click", WorkIntervalCtl.decrement);
workIntInc.addEventListener("click", WorkIntervalCtl.increment);

var BreakIntervalCtl  = (function(){
    var count = 5; // default break time (minutes)

    function increment(){
        count++;
        breakLabel.innerHTML = count;
        Pom.pause();
        Pom.setBreak(count * 60);
    }
    function decrement(){
        if (count > 1) {
            count--;
            breakLabel.innerHTML = count;
            Pom.pause();
            Pom.setBreak(count * 60);
        }
    }
    return {
        increment: increment,
        decrement: decrement
    };
})();
breakIntDec.addEventListener("click", BreakIntervalCtl.decrement);
breakIntInc.addEventListener("click", BreakIntervalCtl.increment);
