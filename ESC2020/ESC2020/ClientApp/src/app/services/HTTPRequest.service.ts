import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../Model/Users';
import { BehaviorSubject } from 'rxjs';
import { Election } from '../Model/Election';
import { Participant } from '../Model/Participant';
import { Phase } from '../Model/Phase';
import { isUndefined } from 'util';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Notification } from '../Model/Notification';


@Injectable({
    providedIn: 'root'
})

export class HTTPRequestService {

    constructor(private service: HttpClient, private router: Router) { }



    // api/Elections
    public getElectionById(electionId: number): Election {
        try {
            this.service.get(window.location.origin + "/api/Elections/" + electionId).subscribe(result => {
                return result as Election;
            }, error => console.error(error));
        } catch (e) {
            return null;
        }
    }

    public updateElection(electionId: number, updatedElection: Election): Election {
        try {
            return null;
        } catch (e) {
            return null;
        }
    }

    public createElection(election: Election, hostUser: Users, code: string): Promise<Election> {
        return new Promise((resolve, reject): Promise<void> => {
            try {
                this.getPhasesByIdBis(1).then(
                    data => { // resolve() 
                        this.service.post(window.location.origin + "/api/Elections", {
                            "Job": election.poste,
                            "Mission": election.missions,
                            "Responsability": election.responsabilite,
                            "StartDate": election.dateD,
                            "EndDate": election.dateF,
                            "CodeElection": code,
                            "HostId": hostUser['userId'],
                            "ElectedId": null,
                            "ElectionPhaseId": data['phaseId']
                        }).subscribe(result => {
                            console.log(result)
                            resolve(result as Election)
                        }, error => console.log(error));
                    }, error => {//Reject
                        console.log("Error: ", error);
                        alert(error)
                    }
                ) 
            } catch (e) {
                console.log(e);
                reject("Echec de la création de l'élection")
            }
        });
    }

    public getElectionByCode(code: string): Election {
        return new Promise((resolve, reject): Promise<void> => {
            try {
                
            } catch (e) {
                console.log(e);
                reject("Error")
            }
        });
    }


    // api/Users
    public getUsersById(userId: number): Users {
        try {
            this.service.get(window.location.origin + "/api/Users/" + userId).subscribe(result => {
                return result as Users;
            }, error => console.error(error));
        } catch (e) {
            return null;
        }
    }

    public updateUsers(userId: number, updatedUsers: Users): Users {
        try {
            this.service.put(window.location.origin + "/api/Users/" + userId, {

            }).subscribe(result => {
                return result as Users;
            }, error => console.error(error));

        } catch (e) {
            return null;

        }
    }

    public createUsers(user: Users): Users {
        try {
            return null;

        } catch (e) {
            return null;

        }
    }



    // api/Participants
    public getParticipant(userId: number, electionId: number): Participant {
        try {
            this.service.get(window.location.origin + "/api/Participants/" + userId + "/" + electionId).subscribe(result => {
                return result as Participant;
            }, error => console.error(error));
        } catch (e) {
            return null;
        }
    }

    public updateParticipant(electionId: number, userId: number, updatedParticipant: Participant): Participant {
        try {
            return null;

        } catch (e) {
            return null;

        }
    }

    public createParticipant(participant: Participant): Participant {
        try {
            this.service.post(window.location.origin + "/api/Participants", {
                'UserId': participant.UserId,
                'ElectionId': participant.ElectionId
            }).subscribe(result => {

            }, error => console.log(error));

        } catch (e) {
            return null;

        }
    }

    public getParticipantsByElection(electionId: number): Participant[] {
        try {
            return null;

        } catch (e) {
            return null;

        }
    }

    public async getParticipantByElection(electionId: number, userId: number): Participant {
        try {
            const response = await (this.service.get(window.location.origin + "/api/Notifications" + typeOpinionId).toPromise()) as Notification[];
            return response;
        } catch (e) {
            return null;
        }
    }



    // api/Phases
    public async getPhasesById(phaseId: number): Phase {
        try {
            const response = await (this.service.get(window.location.origin + "/api/Phases/" + phaseId).toPromise()) as Phase;
            return response;
        } catch (e) {
            console.log(e)
            return null;
        }
    }

    public getPhasesByIdBis(phaseId: number) {
        return new Promise((resolve, reject) => {
            try {
                const response = this.service.get(window.location.origin + "/api/Phases/" + phaseId).subscribe(result => {
                    resolve(result)
                });
            } catch (e) {
                console.log(e);
                reject("Error")
            }
        });
    }


    // api/TypeOpininions
    public async getTypeOpininionsById(typeOpinionId: number): TypeOpinion {
        try {
            const response = await (this.service.get(window.location.origin + "/api/TypeOpinions/" + typeOpinionId).toPromise()) as TypeOpinion;
            return response;
        } catch (e) {
            return null;
        }
    }


    // api/Notifications
    public async getNotifications(): Notification {
        try {
            const response = await (this.service.get(window.location.origin + "/api/Notifications" + typeOpinionId).toPromise()) as Notification[];
            return response;
        } catch (e) {
            return null;
        }
    }


    public createNotifications(notification: Notification) {
        return new Promise((resolve, reject): Promise<void> => {
            try {
                this.service.post(window.location.origin + "/api/Notifications", {
                    "Message": notification.message,
                    "DateNotification": new Date(),
                    "ElectionId": notification.electionId
                }).subscribe(result => {
                    resolve(result)
                }, error => console.log(error));
            } catch (e) {
                console.log(e);
                reject("Echec de la création de l'élection")
            }
        });
    }
}