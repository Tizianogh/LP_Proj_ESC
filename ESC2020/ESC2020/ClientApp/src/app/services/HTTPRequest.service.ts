import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Users } from '../Model/Users';
import { Election } from '../Model/Election';
import { Participant } from '../Model/Participant';
import { Phase } from '../Model/Phase';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Notification } from '../Model/Notification';
import { Opinion } from '../Model/Opinion';

@Injectable({
    providedIn: 'root'
})

export class HTTPRequestService {

    constructor(private service: HttpClient) { }

    // api/Elections
    public getElectionById(electionId: number) {
        return new Promise((resolve, reject) => {
            try {
                this.service.get(window.location.origin + "/api/Elections/" + electionId).subscribe(result => {
                    resolve(result as Election)
                });
            } catch (e) {
                alert("Echec lors de la récupération de l'élection")
                reject(e)
            }
        });
    }

    public updateElection(updatedElection: Election) {
        return new Promise((resolve, reject) => {
            try {
                
                this.service.put(window.location.origin + "/api/Elections/" + updatedElection['electionId'], {
                    "ElectionId": updatedElection.electionId,
                    "Job": updatedElection.job,
                    "Mission": updatedElection.mission,
                    "Responsability": updatedElection.responsability,
                    "StartDate": updatedElection.startDate,
                    "EndDate": updatedElection.endDate,
                    "CodeElection": updatedElection.codeElection,
                    "HostId": updatedElection['hostId'] ,
                    "ElectedUser": updatedElection.electedUser == null ? updatedElection['electedId'] : updatedElection.electedUser['userId'],
                    "ElectionPhaseId": updatedElection.phase == null ? updatedElection['electionPhaseId'] : updatedElection.phase['phaseId']
                }).subscribe(result => {
                    resolve(result as Election)
                });
            } catch (e) { 
                alert("Echec lors de la mise à jour de l'élection")
                reject(e)
            }
        });
    }

    public createElection(election: Election) {
        return new Promise((resolve, reject) => {
            try {
                this.getPhasesById(1).then(
                    data => { // resolve() 
                        console.log(election);
                        this.service.post(window.location.origin + "/api/Elections", {
                            "Job": election.job,
                            "Mission": election.mission,
                            "Responsability": election.responsability,
                            "StartDate": election.startDate,
                            "EndDate": election.endDate,
                            "CodeElection": election.codeElection,
                            "HostId": election.hostElection['userId'],
                            "ElectedUser": null,
                            "ElectionPhaseId": data['phaseId']
                        }).subscribe(result => {
                            resolve(result as Election)
                        });
                    }, error => {//Reject
                        console.log(error)
                    }
                );
            } catch (e) {
                alert("Echec de la création de l'élection")
                reject(e)
            }
        });
    }

    public getElectionByCode(code: string) {
        return new Promise((resolve, reject) => {
            try {
                this.service.get(window.location.origin + "/api/Elections/code/" + code).subscribe(result => {
                    resolve(result as Election)
                });
            } catch (e) {
                alert("Echec lors de la récupération de l'élection")
                reject(e)
            }
        });
    }

    public getElectionsByUser(userId: number) {
        return new Promise((resolve, reject) => {
            try {
                this.service.get(window.location.origin + "/api/userId/" + userId).subscribe(result => {
                    resolve(result as Election[])
                });
            } catch (e) {
                alert("Echec lors de la récupération de l'élection")
                reject(e)
            }
        });
    }


    // api/Users
    public getUserById(userId: number) {
        return new Promise((resolve, reject) => {
            try {
                this.service.get(window.location.origin + "/api/Users/" + userId).subscribe(result => {
                    resolve(result as Users);
                });
            } catch (e) {
                alert("Echec lors de la récupération de l'utilisateur")
                reject(e)
            }
        });
    }

    public updateUser(userId: number, updatedUser: Users) {
        return new Promise((resolve, reject) => {
            try {
                this.service.put<Users>(window.location.origin + "/api/Users/" + userId, {
                    'UserId': updatedUser['userId'],
                    'Email': updatedUser.email,
                    'Password': updatedUser.password,
                    'Salt': updatedUser.salt,
                    'BirthDate': updatedUser.birthDate,
                    'Description': updatedUser.description,
                    'Job': updatedUser.job,
                    'LastName': updatedUser.lastName,
                    'FirstName': updatedUser.firstName,
                    'Avatar': updatedUser.avatar
                }).subscribe(result => {
                    resolve(result as Users)
                });
            } catch (e) {
                alert("Echec lors de la mise à jour de l'utilisateur")
                reject(e);
            }
        });
    }

    public createUser(user: Users) {
        return new Promise((resolve, reject) => {
            try {
                resolve(1)
            } catch (e) {
                alert("Echec lors de la création de l'utilisateur")
                reject(e)
            }
        });
    }


    // api/Participants
    public getParticipant(user: Users, election: Election) {
        return new Promise((resolve, reject) => {
            try {
                this.service.get(window.location.origin + "/api/Participants/" + user['userId'] + "/" + election['electionId']).subscribe(result => {
                    resolve(result as Participant);
                });
            } catch (e) {
                alert("Echec lors de la récupération du participant")
                reject(e)
            }
        });
    }

    public getParticipantsByUser(user: Users) {
        return new Promise((resolve, reject) => {
            try {
                this.service.get(window.location.origin + "/api/Participants/" + user.userId).subscribe(result => {
                    resolve(result as Participant[]);
                });
            } catch (e) {
                alert("Echec lors de la récupération des participants de l'élection")
                reject(e)
            }
        });
    }

    public getParticipantsByElection(election: Election) {
        return new Promise((resolve, reject) => {
            try {
                this.service.get(window.location.origin + "/api/Participants/election/" + election.electionId).subscribe(result => {
                    resolve(result as Participant[]);
                });
            } catch (e) {
                alert("Echec lors de la récupération des participants de l'élection")
                reject(e)
            }
        });
    }

    public updateParticipant( election: Election, updatedParticipant: Participant) {
        return new Promise((resolve, reject) => {
            try {
                let userId = updatedParticipant.user == null ? updatedParticipant['userId'] : updatedParticipant.user['userId'];

                this.service.put<Participant>(window.location.origin + "/api/Participants/" + userId + "/" + election['electionId'], {
                    'UserId': updatedParticipant.user == null ? updatedParticipant['userId'] : updatedParticipant.user['userId'],
                    'ElectionId': updatedParticipant.election == null ? updatedParticipant['electionId'] : updatedParticipant.election['electionId'],
                    'HasTalked': updatedParticipant.hasTalked,
                    'VoteCounter': updatedParticipant.voteCounter,
                }).subscribe(result => {
                    resolve(result)
                });
            } catch (e) {
                console.log(e)
                alert("Echec lors de la mise à jour du participant")
                reject(e)
            }
        });
    }

    public createParticipant(participant: Participant) {
        return new Promise((resolve, reject) => {
            try {
                this.service.post(window.location.origin + "/api/Participants", {
                    'UserId': participant.user['userId'],
                    'ElectionId': participant.election['electionId']
                }).subscribe(result => {
                    resolve(result as Participant)
                });
            } catch (e) {
                alert("Echec lors de la création du participant")
                reject(e)
            }
        });
    }

    public deleteParticipant(participant: Participant) {
        return new Promise((resolve, reject) => {
            try {
                this.service.delete(window.location.origin + "/api/Participants/" + participant.user['userId'] + "/" + participant.election['electionId']).subscribe(result => {
                    resolve(result)
                });
            } catch (e) {
                alert("Echec lors de la suppression du participant")
                reject(e)
            }
        });
    }


    // api/Phases
    public getPhasesById(phaseId: number) {
        return new Promise((resolve, reject) => {
            try {
                const response = this.service.get(window.location.origin + "/api/Phases/" + phaseId).subscribe(result => {
                    resolve(result as Phase)
                });
            } catch (e) {
                alert("Echec lors de la récupération de la phase de l'élection")
                reject(e)
            }
        });
    }


    // api/TypeOpininions
    public getTypeOpininionsById(typeOpinionId: number) {
        return new Promise((resolve, reject) => {
            try {
                const response = this.service.get(window.location.origin + "/api/TypeOpinions/" + typeOpinionId).subscribe(result => {
                    resolve(result as TypeOpinion)
                });
            } catch (e) {
                alert("Echec lors de récupération du type de l'opinion")
                reject(e)
            }
        });
    }


    // api/Opinions
    public async getOpinions(electionId: number) {
        return new Promise((resolve, reject) => {
            try {
                this.service.get(window.location.origin + "/api/Opinions/election/" + electionId).subscribe(result => {
                    resolve(result as Opinion[])
                })
            } catch (e) {
                alert("Echec lors de la récupération des opinions de l'élection")
                reject(e)
            }
        });
    }

    public createOpinion(opinion: Opinion) {
        return new Promise((resolve, reject) => {
            try {
                this.service.post(window.location.origin + "/api/Opinions", {
                    'AuthorId': opinion.authorUser['userId'],
                    'ConcernedId': opinion.concernedUser['userId'],
                    'Reason': opinion.reason,
                    'TypeId': opinion.type['typeId'] ,
                    'DateOpinion': opinion.dateOpinion,
                    'ElectionId': opinion.election['electionId']
                }).subscribe(result => {
                    resolve(result as Opinion)
                });
            } catch (e) {
                alert("Echec lors de la création de l'opinion")
                reject(e)
            }
        });
    }

    public getVotesFromUser(electionId: number, user: Users) {
        return new Promise((resolve, reject) => {
            try {
                this.service.get(window.location.origin + "/api/Opinions/vote/" + electionId + '/' + user['userId']).subscribe(result => {
                    resolve(result as Opinion[])
                })
            } catch (e) {
                alert("Echec lors de la récupération des votes du participant")
                reject(e)
            }
        });
    }


    // api/Notifications
    public async getNotifications(electionId: number) {
        return new Promise((resolve, reject) => {
            try {
                this.service.get(window.location.origin + "/api/Notifications/FromElection/" + electionId).subscribe(result => {
                    resolve(result as Notification[])
                })
            } catch (e) {
                alert("Echec lors de la récupération des notifications de l'élection")
                reject(e)
            }
        });
    }

    public createNotification(notification: Notification) {
        return new Promise((resolve, reject) => {
            try {
                this.service.post(window.location.origin + "/api/Notifications", {
                    "Message": notification.message,
                    "DateNotification": new Date(),
                    "ElectionId": notification.election['electionId']
                }).subscribe(result => {
                    resolve(result as Notification)
                });
            } catch (e) {
                alert("Echec lors de la création de la notification")
                reject(e)
            }
        });
    }
}