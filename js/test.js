// SELECT questions with testId="Игра_Престолов"
const questions = [
    {
        questionId:1,
        questionTitle: "Первый вопрос",
        questionPhoto: "img/test1/test-1-q-1.jpg",
        questionType: "radio",
        answers: [
            {
                answerId:1,
                answerText:"Первый ответ"
            },
            {
                answerId:2,
                answerText:"Второй ответ"
            },
            {
                answerId:3,
                answerText:"Третий ответ"
            },
            {
                answerId:4,
                answerText:"Четвёртый ответ"
            },
        ]
    },
    {
        questionId:2,
        questionTitle: "Второй вопрос",
        questionPhoto: "img/test1/test-1-q-2.jpg",
        questionType: "checkbox",
        answers: [
            {
                answerId:5,
                answerText:"Первый ответ"
            },
            {
                answerId:6,
                answerText:"Второй ответ"
            },
            {
                answerId:7,
                answerText:"Третий ответ"
            },
            {
                answerId:8,
                answerText:"Четвёртый ответ"
            },
        ]
    }
];

// add gender question
questions.push({
    questionId:"gender",
    questionTitle: "Выберите ваш пол",
    questionPhoto: "img/gender.png",
    questionType: "radio",
    answers: [
        {
            answerId:"male",
            answerText:"Мужской"
        },
        {
            answerId:"female",
            answerText:"Женский"
        },
    ]
});

// ============ Functions ==============

let fillTheQuestion = function(index) {
    let imageBlock = $("#question-image");
    let orderBlock = $("#question-order");
    let textBlock = $("#question-text");
    let answersBlock = $("#question-answers");
    let q = questions[index];

    imageBlock.css({
        "background": `url("${q.questionPhoto}")`,
        "background-size":"cover",
        "background-position": "center"
    });
    orderBlock.text(`${currentIndex+1} из ${questionsNumber} `);
    textBlock.text(q.questionTitle);

    answersBlock.empty();
    for(let i in q.answers){
        answersBlock.append(`<div class="custom-control custom-${q.questionType}">
        <input type="${q.questionType}" class="custom-control-input" id="${q.answers[i].answerId}" value="${q.answers[i].answerId}" name="answer-name">
        <label class="custom-control-label" for="${q.answers[i].answerId}">${q.answers[i].answerText}</label>
    </div>`
        );
    }

    if(currentIndex===0){
        $("#btn-prev").addClass("disabled");  
    } else {
        $("#btn-prev").removeClass("disabled");  
    }
}

let fillThePhoto = function() {
    console.log("fill photo");
}

let getUserAnswer = function() {
    let checkedOption = $('input[name=answer-name]:checked', '#question-form').val();
    let answer = {
        questionNumber: currentIndex,
        questionId: questions[currentIndex].questionId,
        answerId: checkedOption,
    }
    return answer;
}

let saveUserAnswer = function(){
    let answer = getUserAnswer();
    // save to local storage

    // save to array
    userAnswers.push(answer);
}

/* ========================================= */
/* ========================================= */
/* ========================================= */

let currentIndex = 0;
let questionsNumber = null;
let userAnswers = [];

$(document).ready(function() {
    questionsNumber = questions.length;
    fillTheQuestion(currentIndex);
});

// ToDo when I change option my btn should begin be able

$("#btn-prev").on("click",function(e){
    e.preventDefault();
    currentIndex--;
    fillTheQuestion(currentIndex);
})

$("#btn-next").on("click",function(e){
    e.preventDefault();

    saveUserAnswer();
    console.log(userAnswers);


    if(currentIndex===questionsNumber-1){
        fillThePhoto();
    } else {
        currentIndex++;
        fillTheQuestion(currentIndex);
    }
})







//создадим объект
var obj = {
	item1: 1,
	item2: [123, "two", 3.0],
	item3:"hello"
};

var serialObj = JSON.stringify(obj); //сериализуем его

localStorage.setItem("myKey", serialObj); //запишем его в хранилище по ключу "myKey"

var returnObj = JSON.parse(localStorage.getItem("myKey")) //спарсим его обратно объект