export default class RoundData {

    handcards;
    word;
    
    success;
    userWord;

    constructor(word, handcards) {
        this.handcards = handcards;
        this.word = word;
    }

    toMap() {
        let map = {
            isSuccess: this.success,
            word: this.word.id
        };

        if (!this.success) {
            map['userWord'] = this.userWord;
        }

        return map;
    }

}
