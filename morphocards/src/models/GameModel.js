import RoundData from "./RoundData";
import WordModel from "./WordModel";

export default class GameModel {

    id;
    date;
    time;
    rounds;

    constructor(id, date, time, rounds) {
        this.id = id;
        this.date = date;
        this.time = time;

        // Conversion des rounds
        let roundsList = [];
        rounds.forEach((element) => {
            let r = new RoundData(new WordModel(element['word'], null), null);
            r.success = element['isSuccess'];
            r.userWord = element['userWord'];
            roundsList.push(r);
        })
        this.rounds = roundsList;
    }

    toMap() {
        return {
            id: this.id,
            date: this.date,
            time: this.time,
            rounds: this.rounds
        }
    }

    // GENERATED
    dateString;
    successes;

    generate() {
        // Transcription de la date
        var today = new Date(this.date);

        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    
        this.dateString = date+' '+time;

        // Comptage du nombre d'erreurs et de succès
        let s = 0;
        this.rounds.forEach((element) => {
            if (element.success) s++;
        });
        this.successes = s;
    }

}