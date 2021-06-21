import {ITeam} from "../models";

export class MatchmakingController {
    private queue: ITeam[];

    private constructor() {
        this.queue = [];
    }

    private static instance?: MatchmakingController;

    public static async getInstance(): Promise<MatchmakingController> {
        if (MatchmakingController.instance === undefined) {
            MatchmakingController.instance = new MatchmakingController();
        }
        return MatchmakingController.instance;
    }

    public async joinQueue(team: ITeam): Promise<any | Boolean> {
        const found: any | boolean = await this.findOpponent(team);
        if (found === false) {
            this.queue.push(team);
            return true; //return true if no opponent and added in queue
        }
        return found; //return game object if opponent found
    }

    private async findOpponent(team: ITeam): Promise<any |boolean> {
        const opponentIndex: number = await this.fastResearch(0, this.queue.length, team.elo);
        if (opponentIndex !== -1) {
            const team2 = this.queue[opponentIndex];
            this.queue.splice(opponentIndex, 1);
            return {
                team1: team,
                team2: team2
            };
        }
        return false;
    }

    private async fastResearch(low: number, high: number, elo: number): Promise<number> {
        if (high >= low) {
            const mid: number = low + (high - low) / 2;
            if ((mid == 0 || elo > this.queue[mid - 1].elo + 50) && this.queue[mid].elo - 50 < elo && elo < this.queue[mid].elo + 50)
                return mid;
            else if (elo > this.queue[mid].elo + 50)
                return this.fastResearch((mid + 1), high, elo);
            else
                return this.fastResearch(low, (mid - 1), elo);
        }
        return -1;
    }
}
