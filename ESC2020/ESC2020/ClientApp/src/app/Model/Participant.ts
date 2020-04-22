import { Users } from "./Users";
import { Election } from "./Election";

export class Participant
{
    user: Users;
    election: Election;
    hasTalked: boolean = true;
    voteCounter: number;
}
