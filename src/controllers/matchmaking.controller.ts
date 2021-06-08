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

    public async cancelQueue(team: ITeam): Promise<Boolean> {
        this.queue = this.queue.filter((teamQ) => {
             return teamQ !== team;
        });
        return true;
    }

    private async findOpponent(team: ITeam): Promise<any |boolean> {
        const opponent: ITeam[] = this.queue.filter((teamQ) => {
            return teamQ.elo < team.elo + 50 && teamQ.elo > team.elo - 50;
        });
        if (opponent.length > 0) {
            await this.cancelQueue(opponent[0]);
            return {
                team1: opponent[0],
                team2: team
            };
        }
        return false;
    }
}
