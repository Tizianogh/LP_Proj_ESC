import { Users } from "./Users";
import { Election } from "./Election";
import { TypeOpinion } from "./TypeOpinion";

export class Opinion {
    authorUser: Users;
    concernedUser: Users;
    election: Election;
    reason: string
    type: TypeOpinion;
    dateOpinion: Date;
}