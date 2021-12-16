export default class GameModel {

    id;
    date;
    time;
    rounds;

    constructor(id, date, time, rounds) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.rounds = rounds;
    }

    toMap() {
        return {
            id: this.id,
            date: this.date,
            time: this.time,
            rounds: this.rounds
        }
    }

}