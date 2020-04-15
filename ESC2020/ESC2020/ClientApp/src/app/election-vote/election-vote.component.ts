import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { NavBarStateService } from '../services/NavBarState.service';
import { Opinion } from '../Model/Opinion';
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
    private connectedAccount: Users = new Users();
    private type: TypeOpinion = new TypeOpinion();
    private listeParticipants: Participant[] = []

    currentUser: Users = new Users();
    election: Election = new Election();
    currentParticipant: Participant = new Participant();
    scrollingItems: number[] = [];
    electionId: string;

    private listeUsers: Users[] = [];

    age: number;


    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private service: HttpClient, private router: Router, private electionService: ElectionService, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.electionService.GetElection().subscribe(anElection => this.election = anElection);
        this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
        this.electionService.GetUserList().subscribe(users => this.listeUsers = users);
        this.electionId = this.election['electionId'];
        this.navBarStateService.SetIsInElection(true);
        this.setOnSignalReceived();
        this.hubConnection.start().catch(err => console.log(err));


        this.getCurrentParticipant();
    }

    setOnSignalReceived() {
        this.hubConnection.on("endVote", (electionId: number) => {
            if (electionId == Number(this.electionId)) {
                this.router.navigate(['objections/' + this.election['electionId']]);
            }

        });

        this.hubConnection.on("changeParticipants", (electionId: number) => {
            if (electionId == Number(this.electionId)) {
                this.listeParticipants = [];
                this.listeUsers = [];
                //this.electionService.ClearParticipantList();
                //this.electionService.ClearUserList();
                this.fetchParticipants();
            }
        });

        this.hubConnection.on("userHasVoted", (electionId: number) => {
            if (electionId == Number(this.electionId)) {
                this.getCurrentParticipant();
                this.listeUsers = [];
                this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
                this.electionService.GetUserList().subscribe(users => this.listeUsers = users);

            }

        });
    }

    async fetchParticipants() {
        //récupérer la liste des participants en fonction de l'id d'une élection
        await this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participantResult => {
            this.listeParticipants = participantResult as Participant[];
            this.listeParticipants.forEach((participant) => {
                this.navBarStateService.SetLogsVisible(this.listeParticipants.find(p => p['userId'] == this.connectedAccount['userId'])['hasTalked']);
                this.electionService.AddParticipant(participant);
                this.fetchUser(participant);
            });
        }, error => console.error(error));
    }

    async fetchUser(participant: Participant) {
        //Récupérer un utilisateur en fonction d'un participant d'une élection passé en paramètred
        await this.service.get(window.location.origin + "/api/Users/" + participant['userId']).subscribe(userResult => {
            let user: Users = userResult as Users;
            this.electionService.AddUser(user);
        }, error => console.error(error));
    }


    getCurrentParticipant() {
        this.currentParticipant = new Participant();
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.electionId).subscribe(result => {
            this.currentParticipant = result as Participant;
        }, error => console.log(error));
    }

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

        if (this.connectedAccount['userId'] == this.currentUser['userId']) {
            this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId']).subscribe(result => {
                let participantResult: Participant = result as Participant;
                this.service.put<Participant>(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId'], {
                    'UserId': participantResult['userId'],
                    'ElectionId': participantResult['electionId'],
                    'HasTalked': true,
                    "Proposable": true
                }).subscribe(result => {
                }, error => console.log(error));
            }, error => console.log(error));
            this.navBarStateService.SetLogsVisible(true);
        }
        else {
            this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId']).subscribe(result => {
                let participantResult: Participant = result as Participant;
                this.service.put<Participant>(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId'], {
                    'UserId': participantResult['userId'],
                    'ElectionId': participantResult['electionId'],
                    'HasTalked': true
                }).subscribe(result => {
                    this.hubConnection.send("userHasVoted", Number(this.electionId));
                }, error => console.log(error));
            }, error => console.log(error));
            this.navBarStateService.SetLogsVisible(true);

            this.service.get(window.location.origin + "/api/Participants/" + this.currentUser['userId'] + "/" + this.election['electionId']).subscribe(result => {
                let participantResult: Participant = result as Participant;
                this.service.put(window.location.origin + "/api/Participants/" + participantResult['userId'] + "/" + this.election['electionId'], {
                    "UserId": participantResult["userId"],
                    "ElectionId": this.election['electionId'],
                    "HasTalked": participantResult['hasTalked'],
                    "Proposable": true
                }).subscribe(result => {

                }, error => console.log(error));
            }, error => console.log(error));


        }
    }

    Exclude(currentUserId: number) {
        this.service.delete(window.location.origin + "/api/Participants/" + currentUserId + "/" + this.election['electionId']).subscribe(result => {
            this.hubConnection.send("changeParticipants", Number(this.electionId));

        }, error => console.log(error));
    }



    goToNextPhase() {
        this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participantResult => {
            this.listeParticipants = participantResult as Participant[];
            for (let i in this.listeParticipants) {
                this.service.put(window.location.origin + "/api/Participants/" + this.listeParticipants[i]['userId'] + "/" + this.election['electionId'], {
                    "UserId": this.listeParticipants[i]['userId'],
                    "ElectionId": this.election['electionId'],
                    "HasTalked": false,
                    "Proposable": this.listeParticipants[i]['proposable']
                }).subscribe(result => {
                }, error => console.log(error));
            }
            let phase: Phase = new Phase();
            this.service.get(window.location.origin + "/api/Phases/2").subscribe(phaseResult => {
                phase = phaseResult as Phase;

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
                    this.hubConnection.send("endVote", Number(this.electionId));
                }, error => console.log(error));
            });
        }, error => console.error(error));
    }
}