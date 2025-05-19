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

let timeLeft = 30 * 60; // in secondi

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