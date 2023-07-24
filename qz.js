//Getting all required elements
const start_btn = document.querySelector(".start_btn button");
const information_box = document.querySelector(".information_box");
const exit_btn = information_box.querySelector(".buttons .quit");
const continue_btn = information_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const timeCount = quiz_box.querySelector(".timer .timer_sec");
const timeLine = quiz_box.querySelector("header .time_line");
const timeOff = quiz_box.querySelector("header .time_text");
const option_list = document.querySelector(".option_list");
const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

let que_count = 0;
let que_numb = 1;
let counter;
let counterLine;
let timeValue = 60;
let widthValue = 0;
let userScore = 0;
let timeTaken = 0;

//If start quiz button is clicked
start_btn.onclick = () => {
    information_box.classList.add("activeInfo"); //show the information box
};

//If exit button is clicked
exit_btn.onclick = () => {
    information_box.classList.remove("activeInfo"); //hide the information box
};

//If continue button is clicked
continue_btn.onclick = () => {
    information_box.classList.remove("activeInfo"); //hide the information box
    quiz_box.classList.add("activeQuiz");   //show the quiz  box
    showQuestions(0);
    queCounter(1);
    clearInterval(counter);
    startTimer(timeValue);
    clearInterval(counterLine);
    startTimerLine(widthValue);
};

// If restart button is clicked
restart_quiz.onclick = () => {
    next_btn.innerHTML = "Next Question";
    quiz_box.classList.add("activeQuiz");
    result_box.classList.remove("activeResult");
    que_count = 0;
    que_numb = 1;
    timeValue = 60;
    widthValue = 0;
    userScore = 0;
    timeTaken = 0;
    showQuestions(0);
    queCounter(1);
    clearInterval(counter);
    startTimer(timeValue);
    clearInterval(counterLine);
    startTimerLine(widthValue);
    next_btn.style.display = "none";
    timeOff.textContent = "Time Left";
}

// If quit button is clicked
quit_quiz.onclick = () => {
    window.location.reload();
}

// If next button clicked
next_btn.onclick = () => {
    if (que_count === questions.length - 2) {
        next_btn.innerHTML = "Submit";
    }
    if (que_count < questions.length - 1) {
        que_count++;
        que_numb++;
        showQuestions(que_count);
        queCounter(que_numb);
        next_btn.style.display = "none";
        timeOff.textContent = "Time Left";
    }
    else {
        console.log("Questions Completed");
        if (result_box.classList.contains("activeResult")) {
            return;
        }
        else {
            showResultBox();
        }
    }
}

//Getting questions and options from array
function showQuestions(index) {
    const que_text = document.querySelector(".que_text");
    let que_tag = '<span>' + questions[index].numb + ". " + questions[index].question + '</span>';
    let option_tag = '<div class="option">' + questions[index].options[0] + '<span></span></div>'
        + '<div class="option">' + questions[index].options[1] + '<span></span></div>'
        + '<div class="option">' + questions[index].options[2] + '<span></span></div>'
        + '<div class="option">' + questions[index].options[3] + '<span></span></div>';
    que_text.innerHTML = que_tag;
    option_list.innerHTML = option_tag;
    const option = option_list.querySelectorAll(".option");
    for (let i = 0; i < option.length; i++) {
        option[i].setAttribute("onclick", "optionSelected(this)")
    }
}

let tickIcon = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIcon = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function optionSelected(answer) {
    let userAns = answer.textContent;
    let correctAns = questions[que_count].answer;
    let allOptions = option_list.children.length;
    if (userAns === correctAns) {
        userScore += 1;
        answer.classList.add("correct");
        answer.insertAdjacentHTML("beforeend", tickIcon);
    }
    else {
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIcon);
        //If answer is incorrect then automatically select the correct answer
        for (let i = 0; i < allOptions; i++) {
            if (option_list.children[i].textContent == correctAns) {
                option_list.children[i].setAttribute("class", "option correct");
                option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
            }
        }
    }
    // Once user selected disabled all options 
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
    }
    next_btn.style.display = "block";
}

function showResultBox() {
    console.log(timeTaken);
    information_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score_text");
    if (userScore > 7) {
        let scoreTag = '<p;>and Well Done! You got <span>' + userScore + '</span> out of <span>' + questions.length + '</span></p;>';
        scoreText.innerHTML = scoreTag;
        result_box.style.backgroundColor = "green";
    }
    else if (userScore > 3) {
        let scoreTag = '<p>and Amazing! You got <span>' + userScore + '</span> out of <span>' + questions.length + '</span></p>';
        scoreText.innerHTML = scoreTag;
        result_box.style.backgroundColor = "yellow";
    }
    else {
        let scoreTag = '<p>and Sorry, You got <span>' + userScore + '</span> out of <span>' + questions.length + '</span></p>';
        scoreText.innerHTML = scoreTag;
        result_box.style.backgroundColor = "red";
    }
    const duration = result_box.querySelector(".time_taken");
    if (isNaN(timeTaken)) {
        let durationTag = '<p>Time Taken : <span>' + 0 + '</span> Seconds</p>';
        duration.innerHTML = durationTag;
    }
    else {
        let durationTag = '<p>Time Taken : <span>' + timeTaken + '</span> Seconds</p>';
        duration.innerHTML = durationTag;
    }
    timeTaken = 0;
}

function startTimer(time) {
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
        timeTaken = 59 - (time);
        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }
        if (time < 0) {
            showResultBox();
            clearInterval(counter);
            timeCount.textContent = "00";
            timeOff.textContent = "Time Off";
            let correctAns = questions[que_count].answer;
            let allOptions = option_list.children.length;
            for (let i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent === correctAns) {
                    option_list.children[i].setAttribute("class", "option correct");
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIcon);
                }
            }
            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled");
            }
            next_btn.style.display = "block";
        }
    }
}

// Display timer line
function startTimerLine(time) {
    counterLine = setInterval(timer, 110);
    function timer() {
        time += 1;
        timeLine.style.width = time + "px";
        if (time > 549) {
            clearInterval(counterLine);
        }
    }
}

function queCounter(index) {
    const bottom_ques_counter = quiz_box.querySelector(".total_que");
    let totalQuesCountTag = '<span><p>' + index + '</p>of<p>' + questions.length + '</p>Questions</span>';
    bottom_ques_counter.innerHTML = totalQuesCountTag;
}
