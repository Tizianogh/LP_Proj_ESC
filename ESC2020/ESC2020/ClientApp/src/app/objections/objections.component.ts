import { Component, OnInit } from '@angular/core';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { AuthentificationService } from '../services/authentification.service';
import { Opinion } from '../Model/Opinion';
import * as signalR from "@microsoft/signalr";
import { Phase } from '../Model/Phase';
import { ElectionService } from '../services/election.service';
import { isUndefined } from 'util';
import { HTTPRequestService } from '../services/HTTPRequest.service';
import { Notification } from '../Model/Notification';

@Component({
    selector: 'app-objections',
    templateUrl: './objections.component.html',
    styleUrls: ['./objections.component.css']
})

export class ObjectionsComponent implements OnInit {

    connected: boolean;
    connectedAccount: Users = new Users();

    objectionAuthor: Users = new Users();

    election: Election = new Election();
    actualProposed: Users = new Users();
    connectedParticipant: Participant = new Participant();
    type: TypeOpinion = new TypeOpinion();

    host: boolean = false;

    participantsList: Participant[] = [];
    opinionsList: Opinion[] = [];
    usersList: Users[] = [];
    objectionsList: Opinion[] = [];
    propositions: Proposition[] = [];

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private httpRequest: HTTPRequestService, private authentificationService: AuthentificationService, private electionService: ElectionService) { }

    ngOnInit() {
        this.setOnSignalReceived();
        this.hubConnection.start().catch(err => console.log(err));

        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        this.electionService.GetElection().subscribe(anElection => this.election = anElection);

        this.initParticipant();
    }

    setOnSignalReceived() {

        this.hubConnection.on("nextParticipant", (electionId: number) => {
            if (electionId == this.election["electionId"])
                this.initParticipant();
        });

        this.hubConnection.on("updateObjections", (electionId: number) => {
            if (electionId == this.election["electionId"])
                this.getObjections();
        });
    }

    initParticipant() {
        this.participantsList = [];
        this.httpRequest.getParticipantsByElection(this.election).then(
            participantsData => {
                this.participantsList = participantsData as Participant[]
                this.connectedParticipant = this.participantsList.find(p => p['userId'] == this.connectedAccount['userId'])
                this.httpRequest.getUserByElection(this.election).then(
                    usersData => {
                        this.usersList = usersData as Users[]
                        this.election.hostElection = this.election.hostElection;
                        this.checkHost();
                        this.mainRequest();
                    }, error => console.error(error)
                );
            }, error => console.error(error)
        );
    }

    mainRequest() {
        //RÃ©cupÃ©rer l'id de l'Ã©lection actuelle Ã  partir de l'url
        this.actualProposed = new Users();
        this.objectionsList = [];
        this.propositions = [];
        this.startCounting();
    }

    checkHost() {
        if (this.connectedAccount["userId"] == this.election['hostId'])
            this.host = true;
        else
            this.host = false;
    }

    startCounting() {

        for (let i = 0; i < this.participantsList.length; i++) {
            if (this.participantsList[i]['voteCounter'] > 0) {
                let user = this.usersList.find(element => element['userId'] == this.participantsList[i]['userId']);
                this.propositions.push(new Proposition(user['userId'], this.participantsList[i]['voteCounter']));
            }
        }

        if (isUndefined(this.propositions[0])) {
            if (this.host)
                this.noMoreCandidate()
        }
        else {
            this.sortPropositions();
            this.actualProposed = this.usersList.find(user => user['userId'] == this.propositions[0].UserId);
            this.getObjections();
        }
    }

    sortPropositions() {
        this.propositions.sort((p1, p2) => {
            if (p1.VoteCounter > p2.VoteCounter)
                return -1;
            if (p1.VoteCounter < p2.VoteCounter)
                return 1;
            return 0;
        });
    }

    noMoreCandidate() {

        this.httpRequest.getParticipantsByElection(this.election).then(
            participantsData => {
                this.participantsList = participantsData as Participant[];
                this.participantsList.forEach(p => {
                    p.hasTalked = false;
                    p.election = this.election;
                    this.httpRequest.updateParticipant(p)
                })
            }
        )

        this.httpRequest.getPhasesById(5).then(
            phase5 => {
                let anElection = this.election;
                anElection.phase = phase5 as Phase;

                this.httpRequest.updateElection(anElection).then(
                    () => {
                        let newNotification: Notification = {
                            message: "Aucun participant n'a été retenu pour pourvoir le poste de " + this.election['job'] + ".",
                            date: new Date(),
                            election: this.election as Election
                        };
                        this.httpRequest.createNotification(newNotification).then(
                            () => {
                                this.hubConnection.send("updatePhase", Number(this.election['electionId']));
                            }, error => console.log(error)
                        );
                    }, error => console.log(error)
                )
            }, error => console.log(error)
        );
    }

    objection() {
        //génération d'une opinion objection (id du type : 3 = opinion de type objection)
        this.httpRequest.getTypeOpininionsById(3).then(
            typeOpinion => {
                let revote: Opinion = {
                    authorUser: this.connectedAccount,
                    concernedUser: this.actualProposed,
                    reason: (<HTMLInputElement>document.getElementById("argumentaires")).value,
                    type: typeOpinion as TypeOpinion,
                    dateOpinion: new Date(),
                    election: this.election
                }
                this.httpRequest.createOpinion(revote).then(
                    () => {
                        (<HTMLInputElement>document.getElementById("argumentaires")).value = "";
                        this.hubConnection.send("updateObjections", this.election["electionId"]);
                    }
                );
            }, error => console.log(error)
        );
    }

    endObjection() {
        this.connectedParticipant['hasTalked'] = true;
        this.httpRequest.updateParticipant(this.connectedParticipant);
    }

    getObjections() {
        this.httpRequest.getObjectionsFromElection(this.election).then(
            objectionsData => {
                let tempObjectionsList: Opinion[] = objectionsData as Opinion[];
                for (let i in tempObjectionsList) {
                    if (tempObjectionsList[i]['concernedId'] == this.actualProposed['userId'] && !this.alreadyInObjections(tempObjectionsList[i]))
                        this.objectionsList.push(tempObjectionsList[i])
                   
                }
                this.objectionsList.forEach(opinion => {
                console.log(opinion);
                this.getObjectionsAuthor(opinion);
           });
            }, error => console.log(error)
        );
    }

    getObjectionsAuthor(opinion: Opinion) {
        //récupérer l'utilisateur actuellement élu en fonction du champ electedId d'une élection
        console.log(opinion);
        if (opinion['authorId'] != null) {
            this.service.get(window.location.origin + "/api/Users/" + opinion['authorId']).subscribe(userResult => {
                this.objectionAuthor = userResult as Users;
                this.objectionAuthor.FirstName = userResult['firstName'];
                this.objectionAuthor.LastName = userResult['lastName'];
                document.getElementById("opinion" + opinion['opinionId']).innerHTML = "&nbsp;" + this.objectionAuthor.FirstName + " " + this.objectionAuthor.LastName
            }, error => console.error(error));
        }
    }

    alreadyInObjections(objection: Opinion) {
        for (let i in this.objectionsList) {
            if (this.objectionsList[i]['opinionId'] == objection['opinionId'])
                return true;
        }
        return false;
    }

    validateObjection() {
        this.httpRequest.getParticipant(this.actualProposed, this.election).then(
            participantData => {
                let actualParticipant = participantData as Participant;
                actualParticipant.voteCounter = 0;
                this.httpRequest.updateParticipant(actualParticipant).then(
                    () => {
                        let newNotification: Notification = {
                            message: "Une objection à l'élection de " + this.actualProposed['firstName'] + ' ' + this.actualProposed['lastName'] + " a été validée par le facilitateur.",
                            date: new Date(),
                            election: this.election as Election
                        };
                        this.httpRequest.createNotification(newNotification);
                        this.objectionsList = []
                        this.updateParticipantForVote();
                    }, error => console.log(error)
                )
            }, error => console.log(error)
        );
    }

    updateParticipantForVote() {
        this.httpRequest.getParticipantsByElection(this.election).then(
            participantData => {
                let participants = participantData as Participant[];
                participants.forEach(participant => {
                    participant.hasTalked = false;
                    this.httpRequest.updateParticipant(participant);
                });
                this.hubConnection.send("nextParticipant", this.election["electionId"]);
            }, error => { console.log(error) } 
        );
    }

    acceptCandidate() {
        this.httpRequest.getParticipantsByElection(this.election).then(
            participantsData => {
                this.participantsList = participantsData as Participant[];
                this.participantsList.forEach(p => {
                    p.hasTalked = false;
                    p.election = this.election;
                    console.log(p)
                    this.httpRequest.updateParticipant(p).then(
                        updatedParticipantData => { }, error => { console.log(error) }
                    );
                })
            }
        )
        this.httpRequest.getPhasesById(4).then(
            phase4 => {
                let anElection = this.election;
                anElection.phase = phase4 as Phase;
                anElection.electedElection = this.actualProposed;
                console.log(anElection)

                this.httpRequest.updateElection(anElection).then(
                    () => {
                        let newNotification: Notification = {
                            message: "La proposition de " + this.actualProposed['firstName'] + ' ' + this.actualProposed['lastName'] + " a été retenue par le facilitateur.",
                            date: new Date(),
                            election: this.election as Election
                        };
                        this.httpRequest.createNotification(newNotification).then(
                            notification => {
                                this.hubConnection.send("updatePhase", Number(this.election['electionId']));
                            }, error => console.log(error)
                        );
                    }, error => console.log(error)
                );
            }, error => console.log(error)
        );
    }
}

class Proposition {
    constructor(
        public UserId: number,
        public VoteCounter: number
    ) { }
}