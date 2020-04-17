import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { Phase } from '../Model/Phase';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { NavBarStateService } from '../services/NavBarState.service';
import { Opinion } from '../Model/Opinion';
import { isUndefined } from 'util';
import * as signalR from "@microsoft/signalr";
import { ElectionService } from '../services/election.service';

@Component({
    selector: 'app-revote',
    templateUrl: './revote.component.html',
    styleUrls: ['./revote.component.css']
})

export class RevoteComponent implements OnInit {

    private connected: boolean;
    public connectedAccount: Users = new Users();
    private electionId: string;
    private type: TypeOpinion = new TypeOpinion();
    private listeParticipants: Participant[] = [];
    currentUser: Users = new Users();
    election: Election = new Election();
    currentParticipant: Participant = new Participant();
    scrollingItems: number[] = [];

    public listeUsers: Users[] = [];

    age: number;

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private service: HttpClient, private router: Router, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService, private electionService: ElectionService) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.electionService.GetElection().subscribe(anElection => this.election = anElection);
        this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
        this.electionService.GetUserList().subscribe(users => this.listeUsers = users);

        this.getCurrentParticipant();
        this.setOnSignalReceived();
        this.hubConnection.start().catch(err => console.log(err));
        this.setSubTitle();
    }

    setOnSignalReceived() {

        this.hubConnection.on("changeParticipants", (electionId: number, phaseId: number) => {
            if (electionId == Number(this.election['electionId']) && phaseId == 2) {
                this.listeParticipants = [];
                this.listeUsers = [];
                this.electionService.fetchElection(this.election['electionId']);
                this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
                this.electionService.GetUserList().subscribe(users => this.listeUsers = users);
            }
        });

        this.hubConnection.on("userHasVoted", (electionId: number, phaseId: number) => {
            if (electionId == Number(this.election['electionId']) && phaseId == 2) {
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
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId']).subscribe(result => {
            this.currentParticipant = result as Participant;
        }, error => console.log(error));
    }

    setSubTitle() {
        this.service.get(window.location.origin + "/api/Opinions/" + this.election['electionId'] + '/' + this.connectedAccount['userId']).subscribe(result => {
            let opinion: Opinion[] = result as Opinion[];
            opinion.sort((l1, l2) => {
                if (l1['dateOpinion'] > l2['dateOpinion'])
                    return -1;
                if (l1['dateOpinion'] < l2['dateOpinion'])
                    return 1;
                return 0;
            });
            if (isUndefined(opinion[0])) {
                document.getElementById("sous-titre").innerText += ' aucun candidat';
            }
            else {
                this.service.get(window.location.origin + "/api/Users/" + opinion[0]["concernedId"]).subscribe(result => {
                    document.getElementById("sous-titre").innerText += ' ' + result['firstName'] + ' ' + result['lastName'];
                }, error => console.error(error));
            }
        }, error => console.error(error));
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

        if (currentDate.getMonth() > BirthDate.getMonth())
            Age++;
        else if (currentDate.getMonth() == BirthDate.getMonth()) {
            if (currentDate.getDate() >= BirthDate.getDate())
                Age++;
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

    Revote() {
        document.getElementById("voteBtn").setAttribute('disabled', 'disabled');
        this.service.get(window.location.origin + "/api/Opinions/vote/" + this.election['electionId'] + '/' + this.connectedAccount['userId']).subscribe(result => {
            let opinion: Opinion[] = result as Opinion[];
            opinion.sort((l1, l2) => {
                if (l1['dateOpinion'] > l2['dateOpinion'])
                    return -1;
                if (l1['dateOpinion'] < l2['dateOpinion'])
                    return 1;
                return 0;
            });

            if (isUndefined(opinion[0])) {

            }
            else {
                this.service.get(window.location.origin + "/api/Participants/" + opinion[0]["concernedId"] + '/' + this.election['electionId']).subscribe(participantResult => {
                    let participant = participantResult as Participant;
                    let voteCounter = participant['voteCounter'] - 1;
                    this.service.put(window.location.origin + "/api/Participants/" + participant['userId'] + "/" + this.election['electionId'], {
                        "UserId": participant['userId'],
                        "ElectionId": this.election['electionId'],
                        "HasTalked": participant['hasTalked'],
                        "VoteCounter": voteCounter
                    }).subscribe(result => {

                        //génération d'une opinion revote (id du type : 3 = opinion de type revote)
                        this.service.get(window.location.origin + "/api/TypeOpinions/3").subscribe(result => {
                            this.type = result as TypeOpinion;
                            this.service.post(window.location.origin + "/api/Opinions", {
                                'AuthorId': this.connectedAccount["userId"],
                                'ConcernedId': this.currentUser["userId"],
                                'Reason': (<HTMLInputElement>document.getElementById("argumentaires")).value,
                                'TypeId': this.type["typeId"],
                                'DateOpinion': new Date(),
                                'ElectionId': this.election['electionId']
                            }).subscribe(result => {
                                this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId']).subscribe(result => {
                                    let participantResult: Participant = result as Participant;
                                    this.service.put<Participant>(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId'], {
                                        'UserId': participantResult['userId'],
                                        'ElectionId': participantResult['electionId'],
                                        'HasTalked': true,
                                        'VoteCounter': participantResult['voteCounter']
                                    }).subscribe(result => {
                                        this.service.get(window.location.origin + "/api/Participants/" + this.currentUser['userId'] + "/" + this.election['electionId']).subscribe(result => {
                                            let participantResult: Participant = result as Participant;
                                            let voteCounter = participantResult['voteCounter'] + 1;
                                            this.service.put(window.location.origin + "/api/Participants/" + participantResult['userId'] + "/" + this.election['electionId'], {
                                                "UserId": participantResult["userId"],
                                                "ElectionId": this.election['electionId'],
                                                "HasTalked": participantResult['hasTalked'],
                                                "VoteCounter": voteCounter
                                            }).subscribe(result => {
                                                this.hubConnection.send("userHasVoted", Number(this.election['electionId']), Number(this.election['electionPhaseId']));
                                            }, error => console.log(error));
                                        }, error => console.log(error));
                                    }, error => console.log(error));
                                }, error => console.log(error));
                                this.navBarStateService.SetLogsVisible(true);
                            }, error => console.log(error));
                        }, error => console.error(error));
                    }, error => console.log(error));
                }, error => console.error(error));
            }
        }, error => console.error(error));
    }

    Exclude(currentUserId: number) {
        this.service.delete(window.location.origin + "/api/Participants/" + currentUserId + "/" + this.election['electionId']).subscribe(result => {
            this.hubConnection.send("changeParticipants", Number(this.election['electionId']), Number(this.election['electionPhaseId']));
        }, error => console.log(error));
    }

    noChange() {
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId']).subscribe(result => {
            let participantResult: Participant = result as Participant;
            this.service.put(window.location.origin + "/api/Participants/" + participantResult['userId'] + "/" + this.election['electionId'], {
                "UserId": participantResult["userId"],
                "ElectionId": this.election['electionId'],
                "HasTalked": true,
                "VoteCounter": participantResult['voteCounter']
            }).subscribe(result => {
                this.hubConnection.send("userHasVoted", Number(this.election['electionId']), Number(this.election['electionPhaseId']));
            }, error => console.log(error));
        }, error => console.log(error));
    }

    goToNextPhase() {
        this.listeParticipants = [];
        this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(result => {
            this.listeParticipants = result as Participant[];
            for (let i in this.listeParticipants) {
                this.service.put(window.location.origin + "/api/Participants/" + this.listeParticipants[i]['userId'] + "/" + this.election['electionId'], {
                    "UserId": this.listeParticipants[i]['userId'],
                    "ElectionId": this.election['electionId'],
                    "HasTalked": false,
                    "VoteCounter": this.listeParticipants[i]['voteCounter']
                }).subscribe(result => {
                    let phase: Phase = new Phase();
                    this.service.get(window.location.origin + "/api/Phases/3").subscribe(phaseResult => {
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
                            this.hubConnection.send("updatePhase", Number(this.election['electionId']));
                        }, error => console.log(error));
                    });
                }, error => console.log(error));
            }
        }, error => console.error(error));
    }
}