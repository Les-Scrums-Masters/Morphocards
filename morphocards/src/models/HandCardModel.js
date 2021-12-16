/**
 * Model d'une carte de la main
 * @class
 * @classdesc Modèle d'une carte destiné à être dans la main
 */

class HandCardModel {
    id;
    value;
    position;
    uniqueId;

    /**
     * Crée un model de carte (destiné à la main).
     * @param {string} id - La valeur de la carte
     * @param {number} value - Symbole de la carte
     */
    constructor(id, value) {
        this.id = id;
        this.value = value;
    }

}
export default HandCardModel;
