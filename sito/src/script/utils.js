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

  if (--timeLeft < 0) {
    clearInterval(countdown);
    alert("Il tempo è scaduto!");
  }
}, 1000);