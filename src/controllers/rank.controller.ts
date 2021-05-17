import {RANKS} from "../utils";

export type RankInfo = {
    "name": string,
    "lowRange": number;
    "highRange": number;
};

export class RankController {

    private readonly ranks: RankInfo[];

    private static instance?: RankController;

    public static async getInstance(): Promise<RankController> {
        if (RankController.instance === undefined) {
            RankController.instance = new RankController(RANKS);
        }
        return RankController.instance;
    }

    private constructor(ranks: RankInfo[]) {
        this.ranks = ranks
    }

    public async getCorrespondingRank(elo: number): Promise<RankInfo> {
        const index: number = await this.fastRankResearch(0, this.ranks.length, elo);
        if (index === -1) {
            return this.ranks[this.ranks.length-1];
        }
        return this.ranks[index];
    }

    private async fastRankResearch(low: number, high: number, elo: number): Promise<number> {
        if (high >= low) {
            const mid: number = low + (high - low) / 2;
            if ((mid == 0 || elo > this.ranks[mid - 1].highRange) && this.ranks[mid].lowRange < elo && elo < this.ranks[mid].highRange)
                return mid;
            else if (elo > this.ranks[mid].highRange)
                return this.fastRankResearch((mid + 1), high, elo);
            else
                return this.fastRankResearch(low, (mid - 1), elo);
        }
        return -1;
    }

}
