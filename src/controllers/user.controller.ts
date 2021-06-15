import mongoose from 'mongoose';
import { Team, Invitation } from '../models';

export class UserController {

    /**
     * 
     * replyInvitation
     * 
     * Allow users to accept or refuse an invitation
     * 
     * @param user_id 
     * @param team_id : Team's invitation that we want to reply
     * @param reply 
     */
    public async replyInvitation(user_id: string, team_id: string, reply: boolean): Promise<boolean> {

        if(user_id === null || team_id === null)
            return false;

        const team = await Team.findById(team_id);
        if(!team)
            return false;

        const invitations = await Invitation.find();
        invitations.forEach( async (invitation, index) => {
            if(invitation.team_id.toString() === team_id && invitation.user_id.toString() === user_id){
                if(reply) {
                    team.user_ids.push(user_id);
                    team.save();
                } 
                await Invitation.remove({ team_id: team_id, user_id:  user_id})
            }
        });

        return true;
    }

    /**
     * 
     * isPlayerOf
     * 
     * Verify if an user is a player of a specify team
     * 
     * @param user_id 
     * @param team_id 
     */
    public async isPlayerOf(user_id: string, team_id: string): Promise<boolean> {
        let sameId: boolean = false;

        const team = await Team.findById(team_id);

        if(!team)
            return false;

        team.user_ids.forEach( (id, index) => {
            if( user_id === id.toString() ){
                sameId = true;
            }
        });

        if(sameId) return true;

        return false;
    }

}