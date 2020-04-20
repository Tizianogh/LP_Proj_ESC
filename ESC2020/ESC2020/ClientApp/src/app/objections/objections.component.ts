import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { AuthentificationService } from '../services/authentification.service';
import { Opinion } from '../Model/Opinion';
import * as signalR from "@microsoft/signalr";
import { Phase } from '../Model/Phase';
import { ElectionService } from '../services/election.service';

@Component({
    selector: 'app-objections',
    templateUrl: './objections.component.html',
    styleUrls: ['./objections.component.css']
})

export class ObjectionsComponent implements OnInit {

    connected: boolean;
    connectedAccount: Users = new Users();

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

    constructor(private service: HttpClient, private authentificationService: AuthentificationService, private electionService: ElectionService) { }

    ngOnInit() {
        this.setOnSignalReceived();
        this.hubConnection.start().catch(err => console.log(err));

        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        this.electionService.GetElection().subscribe(anElection => this.election = anElection);

        this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participantsResult => {
            this.participantsList = participantsResult as Participant[]
            this.service.get(window.location.origin + "/api/Users/election/" + this.election['electionId']).subscribe(usersResult => {
                this.usersList = usersResult as Users[]

                this.election.HostId = this.election['hostId'];
                this.checkHost();
                this.mainRequest();
            }, error => console.error(error));
        }, error => console.error(error));
    }

    setOnSignalReceived() {

        this.hubConnection.on("nextParticipant", (electionId: number) => {
            if (electionId == this.election["electionId"])
                this.mainRequest();
        });

        this.hubConnection.on("updateObjections", (electionId: number) => {
            if (electionId == this.election["electionId"])
                this.getObjections();
        });
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
        this.sortPropositions();
        this.actualProposed = this.usersList.find(user => user['userId'] == this.propositions[0].UserId);
        this.getObjections();
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

    objection() {
        //gÃ©nÃ©ration d'une opinion Vote (id du type : 3 = opinion de type vote)
        this.service.get(window.location.origin + "/api/TypeOpinions/3").subscribe(result => {
            this.type = result as TypeOpinion;
            this.service.post(window.location.origin + "/api/Opinions", {
                'AuthorId': this.connectedAccount["userId"],
                'ConcernedId': this.actualProposed["userId"],
                'Reason': (<HTMLInputElement>document.getElementById("argumentaires")).value,
                'TypeId': this.type["typeId"],
                'DateOpinion': new Date(),
                'ElectionId': this.election['electionId']
            }).subscribe(result => {
                (<HTMLInputElement>document.getElementById("argumentaires")).value = "";
                this.hubConnection.send("updateObjections", this.election["electionId"]);
            }, error => console.log(error));
        }, error => console.error(error));
    }

    endObjection() {
        this.connectedParticipant['hasTalked'] = true;
        this.service.put(window.location.origin + "/api/Participants/" + this.connectedParticipant['userId'] + "/" + this.election['electionId'], {
            "UserId": this.connectedParticipant['userId'],
            "ElectionId": this.election['electionId'],
            "HasTalked": true,
            "VoteCounter": this.connectedParticipant['voteCounter'],
        }).subscribe(result => { }, error => console.log(error));
    }

    getObjections() {
        this.service.get(window.location.origin + "/api/Opinions/election/" + this.election['electionId']).subscribe(result => {
            let tempObjectionsList: Opinion[] = result as Opinion[];
            for (let i in tempObjectionsList) {
                if (tempObjectionsList[i]['typeId'] == 3 && tempObjectionsList[i]['concernedId'] == this.actualProposed['userId'] && !this.alreadyInObjections(tempObjectionsList[i]))
                    this.objectionsList.push(tempObjectionsList[i])
            }
        }, error => console.log(error));
    }

    alreadyInObjections(objection: Opinion) {
        for (let i in this.objectionsList) {
            if (this.objectionsList[i]['opinionId'] == objection['opinionId'])
                return true;
        }
        return false;
    }

    validateObjection() {
        this.service.put(window.location.origin + "/api/Participants/" + this.actualProposed['userId'] + "/" + this.election['electionId'], {
            "UserId": this.actualProposed['userId'],
            "ElectionId": this.election['electionId'],
            "HasTalked": false,
            "VoteCounter": 0,
        }).subscribe(result => {
            this.service.post(window.location.origin + "/api/Notifications", {
                "Message": "Une objection à l'élection de " + this.actualProposed['firstName'] + ' ' + this.actualProposed['lastName'] + " a été validée par le facilitateur.",
                "DateNotification": new Date(),
                "ElectionId": this.election['electionId']
            }).subscribe(result => { }, error => console.log(error));

            let tempObjectionsList: Opinion[] = result as Opinion[];
            for (let i in tempObjectionsList) {
                if (tempObjectionsList[i]['typeId'] == 3 && tempObjectionsList[i]['concernedId'] == this.actualProposed['userId'] && !this.alreadyInObjections(tempObjectionsList[i]))
                    this.objectionsList.push(tempObjectionsList[i])
            }
            this.updateParticipantForVote();
        }, error => console.log(error));
    }

    updateParticipantForVote() {
        this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participantsResult => {
            this.participantsList = participantsResult as Participant[]
            for (let i = 0; i < this.participantsList.length; i++) {
                this.service.put(window.location.origin + "/api/Participants/" + this.participantsList[i]['userId'] + "/" + this.election['electionId'], {
                    "UserId": this.participantsList[i]['userId'],
                    "ElectionId": this.election['electionId'],
                    "HasTalked": false,
                    "VoteCounter": this.participantsList[i]["voteCounter"]
                }).subscribe(result => {
                    this.hubConnection.send("nextParticipant", this.election["electionId"]);
                }, error => console.log(error));
            }
        }, error => console.log(error));
    }

    acceptCandidate() {
        let phase: Phase = new Phase();
        this.service.get(window.location.origin + "/api/Phases/4").subscribe(phaseResult => {
            phase = phaseResult as Phase;
            this.service.put(window.location.origin + "/api/Elections/" + this.election['electionId'], {
                "ElectionId": this.election['electionId'],
                "Job": this.election['job'],
                "Mission": this.election['mission'],
                "Responsability": this.election['responsability'],
                "StartDate": this.election['starteDate'],
                "EndDate": this.election['endDate'],
                "CodeElection": this.election['codeElection'],
                "HostId": this.election["hostId"],
                "ElectedId": this.actualProposed['userId'],
                "ElectionPhaseId": phase['phaseId']
            }).subscribe(result => {
                this.service.put(window.location.origin + "/api/Participants/" + this.actualProposed['userId'] + "/" + this.election['electionId'], {
                    "UserId": this.actualProposed['userId'],
                    "ElectionId": this.election['electionId'],
                    "HasTalked": false,
                    "VoteCounter": this.participantsList.find(p => p['userId'] == this.actualProposed['userId'])['voteCounter']
                }).subscribe(result => {

                    this.service.post(window.location.origin + "/api/Notifications", {
                        "Message": "La proposition de " + this.actualProposed['firstName'] + ' ' + this.actualProposed['lastName'] + " a été retenue par le facilitateur.",
                        "DateNotification": new Date(),
                        "ElectionId": this.election['electionId']
                    }).subscribe(result => { }, error => console.log(error));
                    this.hubConnection.send("updatePhase", this.election['electionId']);
                }, error => console.log(error));
            }, error => console.log(error));
        });
    }
}

class Proposition {
    constructor(
        public UserId: number,
        public VoteCounter: number
    ) { }
}