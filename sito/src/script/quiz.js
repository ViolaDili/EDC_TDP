const allQuestions = [];        // Array che conterrà tutte le domande estratte dal file JSON.
const quiz = new Quiz()         // Istanza della classe Quiz che gestisce lo stato e le domande del quiz corrente.

for (let i = 0; i<30; i++) {
    document.querySelector(".answer-done").innerHTML += `<div class="check" id="check${i}"></div>`
}

const allMarks = document.querySelectorAll(".answer-done .check") // NodeList contenente tutti gli elementi HTML che rappresentano i segnatori di domanda (i "check").


// Chiamata alla funzione asyncrona per prendere i dati dal file json delle domande
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


/*
    Imposta l'evento di click a tutti i segnatori di domanda 
    in modo tale da poter cambiare indice di domanda in base al loro id
*/
allMarks.forEach(mark => {
    mark.addEventListener("click", () => {
        const i = Number(mark.id.split("check")[1])
        console.log(i);
        setQuestion(i)
    })    
});


/*
    setQuestions()
    Prende casualmente 30 domande e le pusha nella lista delle domande della classe quiz con il metodo add
*/
function setQuestions() {
    const randomIndices = getRandomIndices(30)
    randomIndices.forEach(index => {
        const question = allQuestions[index];
        quiz.add(new Domanda(question["q"], question.img, question.answer));
    });
    setDomandaOnScreen(quiz.getDomanda())
    selectMark(quiz.indice)
}


/*
    setDomandaOnScreen()
    Si occupa di impostare a schermo il testo e l'immagine della domanda attuale
    Come? utlizzando innerHtml e img.src
    Chiama la seguente funzione: setInputAnswer
*/
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


/*
    setQuestion(index)
    nextQuestion()
    prevQuestion()
    -------------------------
    Si occupano di cambiare domanda del quiz in base all'interazione dell'utente
    Chiamando le seguente funzioni: setDomandaOnScreen, selectMark, setButton
    E i metodi principali di quiz per il cambio domanda
*/

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

/*
    selectMark(indice)
    Evidenzia sullo schermo la domanda attualmente selezionata,
    aggiungendo o rimuovendo la classe "pass" ai relativi indicatori.
*/
function selectMark(indice) {
    allMarks.forEach(mark => {
        if(Number(mark.id.split("check")[1]) == indice){
            mark.classList.add("pass")
        } else {
            mark.classList.remove("pass")
        }

    });
}

/*
    setInputAnswer()
    Si occupa di far visualizzare a schermo lo stato di risposta alla domanda [True | False]
    Come? Togliendo e aggiungendo la classe "sel"
*/
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


/*
    selectAnswer(answer)
    --------------------------
    Gestisce la selezione della risposta da parte dell'utente.
    Aggiorna la visualizzazione dei bottoni di risposta e salva la risposta dell'utente nella domanda corrente.
    Segna la domanda come risolta nella barra di avanzamento.
*/
function selectAnswer(answer) {
    document.querySelector(`.answers .answer-btn.${answer}`).classList.add("sel")
    document.querySelector(`.answers .answer-btn.${!answer}`).classList.remove("sel")
    
    quiz.getDomanda().setUserAnswer(answer)
    document.querySelector(`.answer-done #check${quiz.indice}`).classList.add("sel")
}

let endQuiz = false;


/*
    setButton()
    --------------------------
    Aggiorna il testo e il comportamento del pulsante "Prossima domanda"/"Termina il quiz" in base all'indice della domanda corrente.
    Se si è all'ultima domanda, permette di terminare il quiz.
*/
function setButton() {
    let indice = quiz.indice
    let btn = document.querySelector(".buttons .btn-next")
    if(indice == 29 && endQuiz == false){
        btn.innerHTML = "Termina il quiz"
        endQuiz = true
    } 
    else if (indice == 29 && endQuiz == true){
        terminaQuiz(true)
    }
    else {
        btn.innerHTML = `Prossima domanda <i class="fa-solid fa-arrow-right"></i>`
        endQuiz = false
    }
}



/*
    terminaQuiz(askPermission)
    --------------------------
    Si occupa di terminare il quiz, mostrare la revisione degli errori e cambiare pagina.
    Se askPermission è true, chiede conferma all'utente prima di terminare.
    Raccoglie tutte le domande sbagliate e le passa a setErrors per la revisione.
    Ferma il timer e aggiorna il titolo della pagina.
*/
async function terminaQuiz(askPermission) {
    const domande = quiz.domande
    let domandeSbagliate = []

    if(askPermission && !confirm("Sei sicuro di voler terminare il quiz?")) return

    for (const domanda of domande) {
        if (!domanda.isCorrect()){
            domandeSbagliate.push(domanda)
        }  
    }

    setErrors(domandeSbagliate)
    changePage(1,2)
    clearInterval(countdown);

    document.title = `Revisione | Patentati.info`
}




/*
    exitQuiz()
    --------------------------
    Gestisce l'uscita anticipata dal quiz.
    Chiede conferma all'utente e, se confermato, reindirizza alla pagina principale.
*/
function exitQuiz() {
    if(!confirm("Sei sicuro di voler uscire?")) return
    window.location.href = "../"
}

const PASSED_MESSAGES = ["Bravo, hai superato il quiz", "Sei pronto per affrontare l’esame teorico della patente!"]
const FAIL_MESSAGES = ["Non hai superato il quiz", "Non sei pronto per affrontare l’esame teorico della patente, studia!"]


/*
    setErrors(errors)
    --------------------------
    Mostra a schermo il risultato del quiz e la lista delle domande sbagliate.
    Aggiorna titolo, descrizione e punteggio in base al numero di errori.
    Per ogni errore, aggiunge un elemento alla lista con immagine, testo e risposta corretta.
*/
function setErrors(errors) {
    let result = ``
    let error_amount = errors.length

    const title = document.querySelector("#result-title")
    const desc = document.querySelector("#result-desc")
    const point = document.querySelector("#result-point")

    if(error_amount <= 3){
        title.innerHTML = PASSED_MESSAGES[0]
        desc.innerHTML = PASSED_MESSAGES[1]
    } else {
        title.innerHTML = FAIL_MESSAGES[0]
        desc.innerHTML = FAIL_MESSAGES[1]
    }

    point.innerHTML = `Hai totalizzato ${error_amount} errori su un massimo di 3`

    const errors_container = document.querySelector(".error-list")
    errors.forEach(error => {
        result += `
            <div class="error">
            <div class="image"><img src="${error.img !== null ? ("src/api"+error.img) : "src/assets/img/think.png"}" /></div>
            <span class="text">${error.text}</span>
            <div class="answer">${error.correctAnswer === true ? "È Vero, non falso.." : "È Falso, non vero.."}</div>
            </div>
        `
    });
    errors_container.innerHTML += result
}
