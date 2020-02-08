const testId = 1;
const maxFileSize = 5242880; // get from the server

let packageToServer = {
    image: null,
    userAnswers:null
}

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
        questionType: "radio",
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

let drawQuestionPage = function(index) {
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
        <input type="${q.questionType}" class="custom-control-input" id="answer-${q.answers[i].answerId}" value="${q.answers[i].answerId}" name="answer-name">
        <label class="custom-control-label" for="answer-${q.answers[i].answerId}">${q.answers[i].answerText}</label>
    </div>`
        );
    }
    
    // Если ответ уже висит в userAnswers
    if(userAnswers[currentIndex]) {
        $("#answer-"+userAnswers[currentIndex].answerId).attr('checked', 'checked');
    } else {
        $("#btn-next").addClass("disabled");  
    }
    
    if(currentIndex===0)
        $("#btn-prev").addClass("disabled");  
    else 
        $("#btn-prev").removeClass("disabled");  
}

let drawLoadPhotoPage = function() {
    $("#btn-prev").css({"display":"none","visibility":"hidden"});
    $("#btn-next").css({"display":"none","visibility":"hidden"});
    $("#question-image").css({"display":"none","visibility":"hidden"});
    $("#question-order").css({"display":"none","visibility":"hidden"});
    $("#question-answers").css({"display":"none","visibility":"hidden"});

    $("#question-text").text("Загрузите свою фотографию для получения результата.");

    $("#btn-final").css({"display":"block","visibility":"visible"});
    $("#btn-prev-photo").css({"display":"flex","visibility":"visible"});
    $("#btn-final").css({"display":"flex","visibility":"visible"});
    $("#load-photo-block").css({"display":"block","visibility":"visible"});

    // toDo clear local storage
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

    // save to array
    if(userAnswers[currentIndex]){
        userAnswers[currentIndex].answerId = answer.answerId;
    } else {
        userAnswers.push(answer);
    }

    // push array to local storage
    var serialObj = JSON.stringify(userAnswers); 
    localStorage.setItem("userAnswers"+testId, serialObj);
}

function sendFiles(files) {
    let maxFileSize = 5242880;
    let Data = new FormData();
    $(files).each(function(index, file) {
         if ((file.size <= maxFileSize) && ((file.type == 'image/png') || (file.type == 'image/jpeg'))) {
              Data.append('images[]', file);
         }
    });
};

/* ========================================= */
/* ========================================= */
/* ========================================= */

let currentIndex = 0;
let questionsNumber = null;
let userAnswers = [];

$(document).ready(function() {
    // try to catch userAnwsers from localStorage
    if(localStorage.getItem("userAnswers"+testId)){
        // set the current index
        userAnswers = JSON.parse(localStorage.getItem("userAnswers"+testId));
        currentIndex = userAnswers.length-1;
    }
        
    questionsNumber = questions.length;
    drawQuestionPage(currentIndex);
});

// ToDo when I change option my btn should begin be able

$("#btn-prev").on("click",function(e){
    e.preventDefault();
    currentIndex--;
    drawQuestionPage(currentIndex);
});

$( "#question-form" ).change(function() {
    $("#btn-next").removeClass("disabled");  
});

$("#btn-next").on("click",function(e){
    e.preventDefault();
    saveUserAnswer();

    if(currentIndex===questionsNumber-1){
        drawLoadPhotoPage();
    } else {
        currentIndex++;
        drawQuestionPage(currentIndex);
    }
});

/* Load photo page btns events */
$("#btn-prev-photo").on("click",function(e){
    e.preventDefault();
    $("#btn-prev").css({"display":"flex","visibility":"visible"});
    $("#btn-next").css({"display":"flex","visibility":"visible"});
    $("#question-image").css({"display":"block","visibility":"visible"});
    $("#question-order").css({"display":"block","visibility":"visible"});
    $("#question-answers").css({"display":"block","visibility":"visible"});

    $("#btn-final").css({"display":"none","visibility":"hidden"});
    $("#btn-prev-photo").css({"display":"none","visibility":"hidden"});
    $("#btn-final").css({"display":"none","visibility":"hidden"});
    $("#load-photo-block").css({"display":"none","visibility":"hidden"});

    drawQuestionPage(currentIndex);
});

$('#final-photo-file').change(function() {
    let files = this.files;
    if(files){
        $('.invalid-feedback').css("display","none");
        let Data = new FormData();
        if ((files[0].size <= maxFileSize)) {
            if((files[0].type == 'image/png') || (files[0].type == 'image/jpeg')){
                Data.append('images[]', files[0]);
                $("#btn-final").removeClass("disabled");  
                $("#file-label").text(files[0].name);
    
                packageToServer = {
                    image: Data,
                    userAnswers:userAnswers
                }
            } else {
                $('.invalid-feedback').text("Неверный формат файла – должен быть jpeg или png");
                $('.invalid-feedback').css("display","block");
            }
            
        } else {
            $('.invalid-feedback').text("Загружаемый файл слишком большой. Используйте фото до "+Math.floor(maxFileSize/1000000)+" МБ");
            $('.invalid-feedback').css("display","block");
        } 
    } 
});

$("#btn-final").on("click",function(e){
    e.preventDefault();
   
    // Send the test rezults and photo to the server
    console.log(packageToServer);

    // $.ajax({
    //     url: ZhenyaUrl,
    //     type: type,
    //     data: packageToServer,
    //     contentType: false,
    //     processData: false,
    //     success: function(data) {
    //         alert('Ответ от сервака');
    //     }
    // });
});