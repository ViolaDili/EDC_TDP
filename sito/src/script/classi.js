/*
    Domanda
    --------------------------
    Rappresenta una singola domanda del quiz, con testo, immagine, risposta corretta e risposta data dall'utente.
*/
class Domanda{
    constructor(text, img, correctAnswer){
        this.text = text;
        this.img = img;
        this.correctAnswer = correctAnswer;
        this.userAnswer = null
    }

    setUserAnswer(input){
        this.userAnswer = input //true|false
        console.log("L'utente ha selezionato: ", input);
        
    }

    isCorrect() {
        return this.userAnswer == this.correctAnswer
    }

}


/*
    Quiz
    --------------------------
    Gestisce la logica e lo stato del quiz, mantiene la lista delle domande e l'indice della domanda corrente.
*/
class Quiz{
    constructor(){
        this.indice = 0;
        this.domande = [];
        this.risposteSbagliate = [];
    }

    add(domanda){
        this.domande.push(domanda)
    }

    getDomanda(){
        return this.domande[this.indice]
    }

    getDomandaDaIndice(i){
        return this.domande[i]
    }

    setIndice(i){
        this.indice = i
    }

    next(){
        if(this.indice >= 29){
            return
        }
        this.indice++
    }

    prev(){
        if(this.indice<=0){
            return
        }
        this.indice--
    }


}

