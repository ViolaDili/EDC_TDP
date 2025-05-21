let timeLeft = 30 * 60;

/*
    fetchJson(filePath)
    Restituisce la risposta in formato json
    Parametro: filePath (String) - Directory di dove si trova il file json
*/
async function fetchJson(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            alert("C'è stato un errore, riprova")
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        alert("C'è stato un errore, riprova")
        return null;
    }
}


/*
    getRandomIndices(amount)
    Restituisce un array di indici casuali unici.
    Parametro: amount (Int) - Il numero di indici casuali da generare.
    Ritorna un array contenente indici casuali unici.
*/
function getRandomIndices(amount){
    const randomIndices = [];
    while (randomIndices.length < amount) {
        const randomIndex = Math.floor(Math.random() * allQuestions.length);
        if (!randomIndices.includes(randomIndex)) {
            randomIndices.push(randomIndex);
        }
    }
    return randomIndices
}


/*
    countdown
    Gestisce il timer con setInterval e clearInterval
    La durata del timer è data dalla variabile timeLeft (Int) calcolata in secondi
    Ogni secondo viene aggiornato il timer a schermo
*/
let countdown = setInterval(function() {
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  
    document.querySelector(".timer").innerHTML = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    document.title = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} | Patentati.info`

  if (--timeLeft < 0) {
    clearInterval(countdown);
    alert("TEMPO SCADUTO")
    terminaQuiz(false)
  }
}, 1000);


/*
    getRandomIndices(to,at)
    Si occupa di gestire un "cambio pagina" settando il display (none | flex)
    Parametri: 
        to (Int) - Id di pagina da cui si sta effettuando il cambio pagina
        at (Int) - Id di pagina in cui si sta andando
    Si sposta da una pagina all'altra in base al display e id
*/
function changePage(to,at) {
    console.log(`To: ${to}; At: ${at}`);
    
    const to_elements = document.querySelectorAll(`#pg-${to}`)
    const at_elements = document.querySelectorAll(`#pg-${at}`)

    to_elements.forEach(el => {
        el.style.display = "none"
    });

    at_elements.forEach(el => {
        el.style.display = "flex"
    });
    
}


changePage(2,1)