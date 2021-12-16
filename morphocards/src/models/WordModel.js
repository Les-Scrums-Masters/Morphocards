
/**
 * Model d'un mot
 * @class
 * @classdesc Modèle qui contient les données d'un mot
 */
class WordModel {

    id;
    cards;

    /**
     * Crée un model de mot.
     * @param {id} id - Valeur du mot
     * @param {Object[]} cards - Listes des cartes composant le mot
     */
    constructor(id, cards) {
        this.id = id;
        this.cards = cards;
    }

}
export default WordModel;
