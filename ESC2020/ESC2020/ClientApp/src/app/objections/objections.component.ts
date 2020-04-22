import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { Log } from '../Model/Log';
import { Opinion } from '../Model/Opinion';
import { DatePipe } from '@angular/common';
import { FunctionCall } from '@angular/compiler';
import { FormsModule } from '@angular/forms';
import { NavBarStateService } from '../services/NavBarState.service';
import * as signalR from "@microsoft/signalr";
import { Phase } from '../Model/Phase';

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

    constructor(private service: HttpClient, private router: Router, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        this.setOnSignalReceived();

        this.hubConnection.start().catch(err => console.log(err));
        this.mainRequest();
    }

    setOnSignalReceived() {

        this.hubConnection.on("nextParticipant", (electionId: number) => {
            if (electionId == this.election["electionId"]) {
                this.mainRequest();
            }
        });

        this.hubConnection.on("updateObjections", (electionId: number) => {
            if (electionId == this.election["electionId"]) {
                this.getObjections();
            }

        });
    }

    mainRequest() {
        //RÃ©cupÃ©rer l'id de l'Ã©lection actuelle Ã  partir de l'url
        this.actualProposed = new Users();
        this.participantsList = [];
        this.opinionsList = [];
        this.usersList = [];
        this.objectionsList = [];
        this.propositions = [];



        let electionId = this.router.url.split("/")[2];
        this.service.get(window.location.origin + "/api/Elections/" + electionId).subscribe(result => {
            this.election = result as Election;
            this.navBarStateService.SetNavState(this.election['job']);
            this.getConnectedParticipant();
            this.checkHost();
            this.preStart();
        }, error => console.error(error));
    }

    getConnectedParticipant() {
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId']).subscribe(result => {
            this.connectedParticipant = result as Participant;
        }, error => console.log(error));
    }

    checkHost() {
        if (this.connectedAccount["userId"] == this.election['hostId']) {
            this.host = true;
        }
        else {
            this.host = false;
        }
    }

    preStart() {
        //rÃ©cupÃ©rer la liste des participants en fonction de l'id d'une Ã©lection
        this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participantResult => {
            this.participantsList = participantResult as Participant[];
            this.startCounting();
        }, error => console.error(error));
    }

    startCounting() {
        //Recupere les "Users" de l'"Election" actuelle
        this.service.get(window.location.origin + "/api/Users/election/" + this.election['electionId']).subscribe(userResult => {
            this.usersList = userResult as Users[];
            
            //Recuperer toutes les "Opinions" de cette "Election" et comptabilisation des votes
            this.service.get(window.location.origin + "/api/Opinions/election/" + this.election['electionId']).subscribe(result => {
                this.opinionsList = result as Opinion[];

                //Pour chaque "Users" qui est "Propasable=true" crÃ©e une "Proposition" dans le tableau "propositions"
                for (let i in this.usersList) {
                    
                    if (this.getParticipant(this.usersList[i]['userId'])['voteCounter'] > 0) {
                        this.propositions.push(new Proposition(this.usersList[i]['userId'], Number(this.getParticipant(this.usersList[i]['userId'])['voteCounter'])));
                        ////Pour chaque "Opinions"
                        //for (let j in this.opinionsList) {
                        //    //Comptabilise tous les revotes et les votes qui n'ont pas de revotes du meme auteur
                        //    console.log(this.opinionsList.find(anOpinion => anOpinion['typeId'] == 3 && anOpinion['authorId'] == this.opinionsList[j]['authorId']));
                        //    if (this.opinionsList[j]['typeId'] == 3 || (this.opinionsList[j]['typeId'] == 1 && (this.opinionsList.find(anOpinion => anOpinion['typeId'] == 3 && anOpinion['authorId'] == this.opinionsList[j]['authorId'])) == undefined)) {
                        //        if (this.opinionsList[j]['concernedId'] == this.usersList[i]['userId']) {
                        //            console.log("juste avant" + this.propositions[i].UserId + this.propositions[i].VoteCounter);
                        //            if (this.propositions[i] != null) {
                        //                this.propositions[i].VoteCounter++;
                        //                console.log("juste aprÃ¨s" + this.propositions[i].UserId + this.propositions[i].VoteCounter);
                        //            }
                        //        }
                        //    }
                        //}
                    }
                }

                //deroulement
                this.sortPropositions();
                
                for (let i in this.usersList) {
                    if (this.usersList[i]['userId'] == this.propositions[0].UserId) {
                        this.actualProposed = this.usersList[i];
                    }
                }
                this.getObjections();
            });
        }, error => console.error(error));
    }

    getParticipant(userId: number) {
        for (let i in this.participantsList) {
            if (this.participantsList[i]['userId'] == userId) {
                return this.participantsList[i];
            }
        }
    }

    sortPropositions() {
        let tmp: Proposition[] = [];
        let copy = (<any>this.propositions).copyWithin(0, this.propositions.length);
        while (copy.length > 0) {
            let cpt = 0
            for (let i = 0; i < copy.length; i++) {
                if (copy[cpt].VoteCounter < copy[i].VoteCounter)
                    cpt = i;
            }
            tmp.push(copy[cpt]);
            copy.splice(cpt, 1);
        }
        this.propositions = tmp;
    }

    objection() {
        //gÃ©nÃ©ration d'une opinion Vote (id du type : 2 = opinion de type vote)
        this.service.get(window.location.origin + "/api/TypeOpinions/2").subscribe(result => {
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
        }).subscribe(result => {
        }, error => console.log(error));

    }

    getObjections() {
        this.service.get(window.location.origin + "/api/Opinions/election/" + this.election['electionId']).subscribe(result => {
            let tempObjectionsList: Opinion[] = result as Opinion[];
            for (let i in tempObjectionsList) {
                if (tempObjectionsList[i]['typeId'] == 2 && tempObjectionsList[i]['concernedId'] == this.actualProposed['userId'] && !this.alreadyInObjections(tempObjectionsList[i])) {
                    this.objectionsList.push(tempObjectionsList[i]);
                   
                }
            }
            this.objectionsList.forEach(opinion => {
                console.log(opinion);
                this.getObjectionsAuthor(opinion);
            });
           
        }, error => console.log(error));
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
            if (this.objectionsList[i]['opinionId'] == objection['opinionId']) {
                return true;
            }
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
            }).subscribe(result => {
            }, error => console.log(error));

            let tempObjectionsList: Opinion[] = result as Opinion[];
            for (let i in tempObjectionsList) {
                if (tempObjectionsList[i]['typeId'] == 2 && tempObjectionsList[i]['concernedId'] == this.actualProposed['userId'] && !this.alreadyInObjections(tempObjectionsList[i])) {
                    this.objectionsList.push(tempObjectionsList[i])
                }
            }

            this.updateParticipantForVote();


        }, error => console.log(error));

    }

    ngOnDestroy() {

    }

    updateParticipantForVote() {

        this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participantResult => {
            this.participantsList = participantResult as Participant[];
            for (let i = 0; i < this.participantsList.length; i++) {
                this.service.put(window.location.origin + "/api/Participants/" + this.participantsList[i]['userId'] + "/" + this.election['electionId'], {
                    "UserId": this.participantsList[i]['userId'],
                    "ElectionId": this.election['electionId'],
                    "HasTalked": false,
                    "VoteCounter": this.participantsList[i]["voteCounter"]
                }).subscribe(result => {
                    this.sendNextSignal();
                }, error => console.log(error));
            }

        }, error => console.error(error));
    }

    sendNextSignal() {
        this.hubConnection.send("nextParticipant", this.election["electionId"]);
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
                    "VoteCounter": this.getParticipant(this.actualProposed['userId'])['voteCounter']
                }).subscribe(result => {

                    this.service.post(window.location.origin + "/api/Notifications", {
                        "Message": "La proposition de " + this.actualProposed['firstName'] + ' ' + this.actualProposed['lastName'] + " a été retenue par le facilitateur.",
                        "DateNotification": new Date(),
                        "ElectionId": this.election['electionId']
                    }).subscribe(result => {
                    }, error => console.log(error));

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