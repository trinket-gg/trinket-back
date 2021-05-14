import mongoose from 'mongoose';
import { ITeam, User, IInvitation, Invitation } from '../models';

export class TeamController {

    /**
     * 
     * inviteUsers
     * 
     * Invite one or more users to your team
     * 
     * @param users : Array of users id(type string)
     * @returns 
     */
    public async inviteUsers(user_ids: Array<string>, team: ITeam): Promise<boolean> {
        
        if(user_ids.length === 0)
            return false;
        
        for (const id of user_ids) {
            const userExists: boolean = await User.exists({ _id: id });
            if (!userExists) 
                return false;
        }

        /*
         * Si un user est déjà dans la team OU qu'il a déjà reçu la notification d'invitation. Lors du listage des users, rendre impossible la possibilité d'invité le(s) user(s) en question
         * 
         */
        user_ids.forEach( (id, index) => {
            team.user_ids.forEach( async (db_id, index) => {
                if( db_id != id ){
                    const user = await User.findById(id);
                    if(user){
                        const invitation: IInvitation = new Invitation({
                            _id : new mongoose.Types.ObjectId(),
                            status : "inProgress",
                            team_id : team.id,
                            user_id : id,
                        });

                        invitation.save();
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            });
        });
        
        return true;
    }
    
}