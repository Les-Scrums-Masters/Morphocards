export default class RoundModel {

    // numéro du round
    id;
    // si le round a été fait ou non
    done; 
    // succes ou pas
    success;
    // le mot à trouver
    word;
    // le mot de l'utilisateur
    userWord;

    constructor(id, done, success, word, userWord) {
        this.id = id;
        this.done = done;
        this.success = success;
        this.word = word;
        this.userWord = userWord;
    }

}

   