import { Users } from "./Users";
import { Phase } from "./Phase";

export class Election {
    electionId?: number;
    job?: string;
    mission?: string;
    responsability?: string;
    startDate?: string;
    endDate?: string;
    codeElection?: string;
    hostElection?: Users;
    electedUser?: Users;
    phase?: Phase;

    nbParticipant?: number;
}
