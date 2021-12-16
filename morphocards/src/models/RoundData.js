

/**
 * Model d'un round
 * @class
 * @classdesc Modèle qui contient les données d'un round
 */
class RoundData {

    handcards;
    word;

    success;
    userWord;

    /**
     * Crée un model de round (destiné à la main).
     * @param {WordModel} word - Le mot attendus du round
     * @param {HandCardModel[]} handcards - Listes des cartes de la main
     */
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
export default RoundData
