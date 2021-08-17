import { ITeam } from "../models";

export class MatchmakingController {

    public async joinQueue(team: ITeam): Promise<any | Boolean> {
        return true;
    }
}