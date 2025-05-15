const allQuestions = [];

for (let i = 0; i<30; i++) {
    document.querySelector(".answer-done").innerHTML += `<div class="check" id="check${i}"></div>`
}

const allMarks = document.querySelectorAll(".answer-done .check")


fetchJson('src/api/quizPatenteB2023.json').then(jsonData => {
    if (!jsonData) return;
    function extractQuestions(obj) {
        for (const key in obj) {
            if (Array.isArray(obj[key])) {
                obj[key].forEach(item => {
                    if (item.q && typeof item.a === 'boolean') {
                        allQuestions.push({
                            q: item.q,
                            answer: item.a,
                            img: item.img || null
                        });
                    }
                });
            } else if (typeof obj[key] === 'object') {
                extractQuestions(obj[key]);
            }
        }
    }

    extractQuestions(jsonData);

    setQuestions() 
});

allMarks.forEach(mark => {
    mark.addEventListener("click", () => {
        const i = Number(mark.id.split("check")[1])
        console.log(i);
        setQuestion(i)
    })    
});


const quiz = new Quiz()

function setQuestions() {
    const randomIndices = getRandomIndices(30)
    randomIndices.forEach(index => {
        const question = allQuestions[index];
        quiz.add(new Domanda(question["q"], question.img, question.answer));
    });
    setDomandaOnScreen(quiz.getDomanda())
    selectMark(quiz.indice)
}

function setDomandaOnScreen() {
    let domanda = quiz.getDomanda()
    const img = document.querySelector(".quiz-card .image img")
    const text = document.querySelector(".quiz-card .text")

    const question_counter = document.querySelector(".navbar .start .title")

    text.innerHTML = domanda.text
    question_counter.innerHTML = `Domanda ${quiz.indice + 1} di 30`

    if(domanda.img != null){
        img.src = "src/api"+domanda.img
    } else {
        img.src = "src/assets/img/think.png"
    }

    console.log("La risposta giusta è: ", domanda.correctAnswer);
    setInputAnswer()
}

function setQuestion(index) {
    quiz.setIndice(index)
    setDomandaOnScreen()
    selectMark(index)
    setButton()
}


function nextQuestion() {
    quiz.next()
    setDomandaOnScreen()
    selectMark(quiz.indice)
    setButton()
}

function prevQuestion() {
    quiz.prev()
    setDomandaOnScreen()
    selectMark(quiz.indice)
    setButton()
}

function selectMark(indice) {
    allMarks.forEach(mark => {

        if(Number(mark.id.split("check")[1]) == indice){
            mark.classList.add("pass")
        } else {
            mark.classList.remove("pass")
        }

    });
}

function setInputAnswer() {
    let userInput = quiz.getDomanda().userAnswer
    if (userInput == null){
        document.querySelector(".answers .answer-btn.true").classList.remove("sel")
        document.querySelector(".answers .answer-btn.false").classList.remove("sel")
    } else {
        document.querySelector(`.answers .answer-btn.${userInput}`).classList.add("sel")
        document.querySelector(`.answers .answer-btn.${!userInput}`).classList.remove("sel")

    }
    
}

function selectAnswer(answer) {
    document.querySelector(`.answers .answer-btn.${answer}`).classList.add("sel")
    document.querySelector(`.answers .answer-btn.${!answer}`).classList.remove("sel")
    
    quiz.getDomanda().setUserAnswer(answer)
    document.querySelector(`.answer-done #check${quiz.indice}`).classList.add("sel")
}

let endQuiz = false;

function setButton() {
    let indice = quiz.indice
    let btn = document.querySelector(".buttons .btn-next")
    if(indice == 29 && endQuiz == false){
        btn.innerHTML = "Termina il quiz"
        endQuiz = true
    } 
    else if (indice == 29 && endQuiz == true){
        terminaQuiz()
    }
    else {
        btn.innerHTML = `Prossima domanda <i class="fa-solid fa-arrow-right"></i>`
        endQuiz = false
    }
}


function terminaQuiz() {
    const domande = quiz.domande
    let domandeSbagliate = []

    if(!confirm("Sei sicuro di voler terminare il quiz?")) return

    for (const domanda of domande) {
        if (!domanda.isCorrect()){
            domandeSbagliate.push(domanda)
        }  
    }


    console.log(domandeSbagliate);
    

    

    console.log((30-(domandeSbagliate.length)) + " / " + 30);
    
}

function exitQuiz() {
    if(!confirm("Sei sicuro di voler uscire?")) return
    window.location.href = "../"
}