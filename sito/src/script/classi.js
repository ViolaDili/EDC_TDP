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

class Quiz{
    constructor(){
        this.indice = 0;
        this.domande = [];
        this.risposteSbagliate = [];

        this.punteggio = new Punteggio()
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

        console.log(this.domande[this.indice]);
        
    }

    prev(){
        if(this.indice<=0){
            return
        }
        this.indice--

        console.log(this.domande[this.indice]);

    }


}

class Punteggio{
    constructor(){
        this.punteggio = 0;
        this.domandeTotali = 30;
        this.risposteCorrette = 0;
    }

    rispostaCorretta(){
        this.risposteCorrette++;
        this.punteggio++
    }

    getPunteggio(){
        return this.punteggio;
    }

}


class Correttore{
    constructor(){
    }

    static async getCorrezioni() {
        console.log("ciao");
        
    }
}

Correttore.getCorrezioni()