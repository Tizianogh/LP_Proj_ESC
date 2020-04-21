import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { NavBarStateService } from '../services/NavBarState.service';
import * as signalR from "@microsoft/signalr";
import { ElectionService } from '../services/election.service';
import { Phase } from '../Model/Phase';

@Component({
    selector: 'app-election-vote',
    templateUrl: './election-vote.component.html',
    styleUrls: ['./election-vote.component.css'],
})

export class ElectionVoteComponent implements OnInit {

    private connected: boolean;
    public connectedAccount: Users = new Users();
    private type: TypeOpinion = new TypeOpinion();
    private listeParticipants: Participant[] = []

    currentUser: Users = new Users();
    election: Election = new Election();
    currentParticipant: Participant = new Participant();
    scrollingItems: number[] = [];
    electionId: string;

    public listeUsers: Users[] = [];

    age: number;

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private service: HttpClient, private electionService: ElectionService, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.setupConnectedAccount(anUser));
        this.electionService.GetElection().subscribe(anElection => this.setupElection(anElection));
        this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
        this.electionService.GetUserList().subscribe(users => this.listeUsers = users);
        this.electionId = this.election['electionId'];
        this.navBarStateService.SetIsInElection(true);
        this.navBarStateService.SetLogsVisible(true);
        this.setOnSignalReceived();
        this.hubConnection.start().catch(err => console.log(err));

        this.getCurrentParticipant();
    }

    setupConnectedAccount(anUser: Users) {
        this.connectedAccount = anUser;
        this.connectedAccount.UserId = anUser['userId'];
    }

    setupElection(anElection: Election) {
        this.election = anElection;
        this.election.HostId = anElection['hostId'];
    }

    setOnSignalReceived() {
        this.hubConnection.on("changeParticipants", (electionId: number, phaseId: number) => {
            if (electionId == Number(this.electionId) && phaseId == 1) {
                this.listeParticipants = [];
                this.listeUsers = [];

                this.electionService.fetchElection(this.electionId);
                this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
                this.electionService.GetUserList().subscribe(users => this.listeUsers = users);
            }
        });

        this.hubConnection.on("userHasVoted", (electionId: number, phaseId: number) => {
            if (electionId == Number(this.electionId) && phaseId == 1) {
                this.getCurrentParticipant();
                this.listeUsers = [];

                this.electionService.fetchElection(String(electionId));
                this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
                this.electionService.GetUserList().subscribe(users => this.listeUsers = users);
            }
        });
    }

    getCurrentParticipant() {
        this.currentParticipant = new Participant();
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.electionId).subscribe(result => {
            this.currentParticipant = result as Participant;
        }, error => console.log(error));
    }

    //Voyant Vert/Rouge pour savoir si le participant a HasTalked en true/false
    HasUserTalked(user: Users): boolean {
        try {
            let participant: Participant = this.listeParticipants.find(p => p['userId'] == user['userId']);
            return participant['hasTalked'];
        }
        catch (e) { }
    }

    actualParticipant(user: Users, birthDate: string) {
        document.getElementById("selectParticipant").style.visibility = "visible";
        this.ageCalculation(birthDate);
        this.currentUser = user;
        this.currentUser.FirstName = user['firstName'];
        this.currentUser.LastName = user['lastName'];
        this.currentUser.Description = user['description'];
        this.currentUser.Job = user['job'];
    }

    private ageCalculation(birthDate: string) {
        const currentDate: Date = new Date();
        const BirthDate: Date = new Date(birthDate);
        var Age: number = currentDate.getFullYear() - BirthDate.getFullYear() - 1;

        if (currentDate.getMonth() > BirthDate.getMonth()) {
            Age++;
        }
        else if (currentDate.getMonth() == BirthDate.getMonth()) {
            if (currentDate.getDate() >= BirthDate.getDate()) {
                Age++;
            }
        }
        this.age = Age;
    }

    //Cercle violet quand on selectionne un Participant
    changeColor(userId: number) {
        Array.from(document.getElementsByClassName("participantIcon")).forEach((participant) => {
            let el = participant as HTMLElement;
            el.style.borderColor = "black";
            el.style.borderWidth = "3px";
        });
        document.getElementById(("userId") + userId.toString()).style.borderColor = "#640a60";
        document.getElementById(("userId") + userId.toString()).style.borderWidth = "5px";
    }

    Vote() {
        //grisage btn
        document.getElementById("voteBtn").setAttribute('disabled', 'disabled');
        //génération d'une opinion Vote (id du type : 1 = opinion de type vote)
        this.service.get(window.location.origin + "/api/TypeOpinions/1").subscribe(result => {
            this.type = result as TypeOpinion;
            this.service.post(window.location.origin + "/api/Opinions", {
                'AuthorId': this.connectedAccount["userId"],
                'ConcernedId': this.currentUser["userId"],
                'Reason': (<HTMLInputElement>document.getElementById("argumentaires")).value,
                'TypeId': this.type["typeId"],
                'DateOpinion': new Date,
                'ElectionId': this.election['electionId']
            }).subscribe(result => {
            }, error => console.log(error));
        }, error => console.error(error));

        //Si l'User vote pour lui même, HasTalked en true et ajoute +1 au VoteCounter
        if (this.connectedAccount['userId'] == this.currentUser['userId']) {
            this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId']).subscribe(result => {
                let participantResult: Participant = result as Participant;
                var voteCounter: number = Number(participantResult['voteCounter']) + 1;
                this.service.put<Participant>(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId'], {
                    'UserId': participantResult['userId'],
                    'ElectionId': participantResult['electionId'],
                    'HasTalked': true,
                    "VoteCounter": voteCounter
                }).subscribe(result => {
                    this.hubConnection.send("userHasVoted", Number(this.electionId), Number(this.election['electionPhaseId']));
                }, error => console.log(error));
            }, error => console.log(error));
            this.navBarStateService.SetLogsVisible(true);
        }
        //Sinon il vote pour quelqu'un d'autre que lui même
        else {
            //Met HasTalked de l'User en true
            this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId']).subscribe(result => {
                let participantResult: Participant = result as Participant;
                this.service.put<Participant>(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId'], {
                    'UserId': participantResult['userId'],
                    'ElectionId': participantResult['electionId'],
                    'HasTalked': true,
                    'VoteCounter': participantResult['voteCounter']
                }).subscribe(result => {
                    this.hubConnection.send("userHasVoted", Number(this.electionId), Number(this.election['electionPhaseId']));
                }, error => console.log(error));
            }, error => console.log(error));
            this.navBarStateService.SetLogsVisible(true);

            //Ajoute +1 au VoteCounter
            this.service.get(window.location.origin + "/api/Participants/" + this.currentUser['userId'] + "/" + this.election['electionId']).subscribe(result => {
                let participantResult: Participant = result as Participant;
                var voteCounter: number = Number(participantResult['voteCounter']) + 1;
                this.service.put(window.location.origin + "/api/Participants/" + participantResult['userId'] + "/" + this.election['electionId'], {
                    "UserId": participantResult["userId"],
                    "ElectionId": this.election['electionId'],
                    "HasTalked": participantResult['hasTalked'],
                    "VoteCounter": voteCounter
                }).subscribe(result => {
                }, error => console.log(error));
            }, error => console.log(error));
        }
    }

    Exclude(currentUserId: number) {
        this.service.delete(window.location.origin + "/api/Participants/" + currentUserId + "/" + this.election['electionId']).subscribe(result => {
            this.hubConnection.send("changeParticipants", Number(this.electionId), Number(this.election['electionPhaseId']));
        }, error => console.log(error));
    }

    goToNextPhase() {
        //Change les HasTalked de tous les Participants en false
        this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participantResult => {
            this.listeParticipants = participantResult as Participant[];
            for (let i in this.listeParticipants) {
                this.service.put(window.location.origin + "/api/Participants/" + this.listeParticipants[i]['userId'] + "/" + this.election['electionId'], {
                    "UserId": this.listeParticipants[i]['userId'],
                    "ElectionId": this.election['electionId'],
                    "HasTalked": false,
                    "VoteCounter": this.listeParticipants[i]['voteCounter']
                }).subscribe(result => {
                }, error => console.log(error));
            }
            //CrÃ©er un objet Phase 2
            let phase: Phase = new Phase();
            this.service.get(window.location.origin + "/api/Phases/2").subscribe(phaseResult => {
                phase = phaseResult as Phase;
                //Change la phase de l'Election en 2
                this.service.put(window.location.origin + "/api/Elections/" + this.election['electionId'], {
                    "ElectionId": this.election['electionId'],
                    "Job": this.election['job'],
                    "Mission": this.election['mission'],
                    "Responsability": this.election['responsability'],
                    "StartDate": this.election['startDate'],
                    "EndDate": this.election['endDate'],
                    "CodeElection": this.election['codeElection'],
                    "HostId": this.election["hostId"],
                    "ElectedId": null,
                    "ElectionPhaseId": phase['phaseId']
                }).subscribe(result => {
                    //Informe que la phase de l'Election a changÃ©
                    this.service.post(window.location.origin + "/api/Notifications", {
                        "Message": "Phase de votes terminée.",
                        "DateNotification": new Date(),
                        "ElectionId": this.election['electionId']
                    }).subscribe(result => {
                    }, error => console.log(error));
                    this.hubConnection.send("updatePhase", Number(this.electionId));
                }, error => console.log(error));
            });
        }, error => console.error(error));
    }
}