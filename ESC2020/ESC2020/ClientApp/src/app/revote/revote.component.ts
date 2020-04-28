import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { Phase } from '../Model/Phase';

import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { NavBarStateService } from '../services/NavBarState.service';
import { Opinion } from '../Model/Opinion';
import { Notification } from '../Model/Notification';
import { isUndefined } from 'util';
import * as signalR from "@microsoft/signalr";
import { ElectionService } from '../services/election.service';
import { HTTPRequestService } from '../services/HTTPRequest.service';

@Component({
    selector: 'app-revote',
    templateUrl: './revote.component.html',
    styleUrls: ['./revote.component.css']
})

export class RevoteComponent implements OnInit {

    private connected: boolean;
    public connectedAccount: Users = new Users();
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

    constructor(private httpRequest: HTTPRequestService, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService, private electionService: ElectionService) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.setupConnectedAccount(anUser));
        this.navBarStateService.SetIsInElection(true);
        this.navBarStateService.SetLogsVisible(true);
        this.electionService.GetElection().subscribe(anElection => this.setupElection(anElection));
        this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
        this.electionService.GetUserList().subscribe(users => this.setupUsers(users));

        this.getCurrentParticipant();
        this.setOnSignalReceived();
        this.hubConnection.start().catch(err => console.log(err));
        this.setSubTitle();
    }

    setupConnectedAccount(anUser: Users) {
        this.connectedAccount = anUser;
        this.connectedAccount.userId = anUser['userId'];
    }

    setupElection(anElection: Election) {
        this.election = anElection;
        this.election.hostElection = anElection.hostElection;
        this.election.startDate = anElection.startDate;
    }

    setupUsers(users: Users[]) {
        this.listeUsers = [];
        var tmpListe: Users[] = users;

        //fonction anti doublon
        tmpListe.forEach(u => {
            if (isUndefined(this.listeUsers.find(u2 => u2['userId'] == u['userId'])))
                this.listeUsers.push(u);
        });
    }

    setOnSignalReceived() {

        this.hubConnection.on("changeParticipants", (electionId: number, phaseId: number) => {
            if (electionId == Number(this.election['electionId']) && phaseId == 2) {
                this.listeParticipants = [];
                this.listeUsers = [];
                this.electionService.fetchElection(this.election['electionId'].toString());
                this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
                this.electionService.GetUserList().subscribe(users => this.setupUsers(users));
            }
        });
        this.hubConnection.on("userHasVoted", (electionId: number, phaseId: number) => {
            if (electionId == Number(this.election['electionId']) && phaseId == 2) {
                this.getCurrentParticipant();
                this.listeUsers = [];
                this.electionService.fetchElection(String(electionId));
                this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
                this.electionService.GetUserList().subscribe(users => this.setupUsers(users));
            }
        });
    }

    getCurrentParticipant() {
        this.currentParticipant = new Participant();
        this.httpRequest.getParticipant(this.connectedAccount, this.election).then(
            participant => {
                this.currentParticipant = participant as Participant;
            }, error => {
                console.log(error)
            }
        );
    }

    setSubTitle() {

        this.httpRequest.getVotesFromUser(this.election['electionId'], this.connectedAccount).then(
            opinionsData => {
                let opinion: Opinion[] = opinionsData as Opinion[];
                opinion.sort((l1, l2) => {
                    if (l1['dateOpinion'] > l2['dateOpinion'])
                        return -1;
                    if (l1['dateOpinion'] < l2['dateOpinion'])
                        return 1;
                    return 0;
                });
                if (isUndefined(opinion[0]))
                    document.getElementById("sous-titre").innerText += ' aucun candidat';
                else {
                    this.httpRequest.getUserById(opinion[0]["concernedId"]).then(
                        userData => {
                            document.getElementById("sous-titre").innerText += ' ' + userData['firstName'] + ' ' + userData['lastName'];
                        }, error => { console.log(error) }
                    );
                }
            }, error => { console.log(error) }
        );
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
        this.currentUser.firstName = user.firstName;
        this.currentUser.lastName = user.lastName;
        this.currentUser.description = user.description;
        this.currentUser.job = user.job;

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

        this.httpRequest.getVotesFromUser(this.election['electionId'], this.connectedAccount).then(
            opinionsData => {
                let opinion: Opinion[] = opinionsData as Opinion[];
                opinion.sort((l1, l2) => {
                    if (l1['dateOpinion'] > l2['dateOpinion'])
                        return -1;
                    if (l1['dateOpinion'] < l2['dateOpinion'])
                        return 1;
                    return 0;
                });

                if (isUndefined(opinion[0])) { //Si l'utilisateur n'avait pas précédemment voté
                    alert("Vous n'aviez pas voté à la phase de vote précédente")
                }
                else {  //Si l'utilisateur avait précédemment voté

                    //On retire une voie à l'ancien participant pour qui l'utilisateur avait voté
                    this.httpRequest.getUserById(opinion[0]["concernedId"]).then(
                        userData => {
                            let concernedUser = userData as Users
                            this.httpRequest.getParticipant(concernedUser as Users, this.election).then(
                                previousParticipantData => {
                                    let previousParticipant = previousParticipantData as Participant
                                    previousParticipant.voteCounter--;
                                    this.httpRequest.updateParticipant(previousParticipant).then(
                                        ()=>{
                                            //on génère une opinion de revote
                                            this.httpRequest.getTypeOpininionsById(2).then(
                                                typeOpinion => {
                                                    let revote: Opinion = {
                                                        authorUser: this.connectedAccount,
                                                        concernedUser: this.currentUser,
                                                        reason: (<HTMLInputElement>document.getElementById("argumentaires")).value,
                                                        type: typeOpinion as TypeOpinion,
                                                        dateOpinion: new Date(),
                                                        election: this.election
                                                    }
                                                    this.httpRequest.createOpinion(revote).then(
                                                        () => {
                                                            // On indique que le participant qui vient de voter a parlé
                                                            this.httpRequest.getParticipant(this.connectedAccount, this.election).then(
                                                                participantData => {
                                                                    let connectedParticipant: Participant = participantData as Participant;
                                                                    connectedParticipant.hasTalked = true;
                                                                    this.httpRequest.updateParticipant(connectedParticipant).then(
                                                                        () => {
                                                                            // On incrémente d'une voie le compteur du participant pour qui on vient de voter
                                                                            this.httpRequest.getParticipant(this.currentUser, this.election).then(
                                                                                participantData => {
                                                                                    let concernedParticipant: Participant = participantData as Participant;
                                                                                    concernedParticipant.voteCounter++;
                                                                                    this.httpRequest.updateParticipant(concernedParticipant).then(
                                                                                        () => {
                                                                                            this.hubConnection.send("userHasVoted", Number(this.election['electionId']), Number(this.election['electionPhaseId']));
                                                                                            this.navBarStateService.SetLogsVisible(true);
                                                                                        }, error => {console.log(error)}
                                                                                    );
                                                                                }, error => { console.log(error) }
                                                                            );
                                                                        }, error => {  console.log(error)  }
                                                                    );
                                                                }, error => { console.log(error) }
                                                            );
                                                        }, error => {console.log(error)}
                                                    );
                                                }, error => { console.log(error); }
                                            );
                                        }, error => {console.log(error)} 
                                    );
                                }, error => { console.log(error) }
                            );
                        }, error => { console.log(error) }
                    );
                }
            }, error => { console.log(error) }
        );
    }

    Exclude(currentUserId: number) {
        this.httpRequest.getParticipant(this.currentUser, this.election).then(
            participantData => {
                let participant: Participant = participantData as Participant;
                participant.user = this.currentUser;
                participant.election = this.election;
                this.httpRequest.deleteParticipant(participant).then(
                    () => {
                        this.hubConnection.send("changeParticipants", this.election.electionId, Number(this.election['electionPhaseId']));
                    }
                );
            }, error => { console.log(error) }
        );
    }

    becomeHost() {
        if (this.connectedAccount.userId != this.election['hostId']) {
            this.election.hostElection = this.connectedAccount;
            this.httpRequest.updateElection(this.election).then(
                () => {
                    this.hubConnection.send("changeParticipants", this.election.electionId, Number(this.election['electionPhaseId']));
                }
            )
        }
    }

    noChange() {

        this.httpRequest.getParticipant(this.connectedAccount, this.election).then(
            participantData => {
                let participant = participantData as Participant;
                let updatedParticipant: Participant = { user: this.connectedAccount, election: this.election, hasTalked: true, voteCounter: participant.voteCounter }
                this.httpRequest.updateParticipant(updatedParticipant).then(
                    () => {
                        this.hubConnection.send("userHasVoted", Number(this.election['electionId']), Number(this.election['electionPhaseId']));
                    }, error => { console.log(error) }
                );
            }
        );
    }

    goToNextPhase() {

        this.httpRequest.getParticipantsByElection(this.election).then(
            participantsData => {
                this.listeParticipants = participantsData as Participant[];
                this.listeParticipants.forEach(p => {
                    p.hasTalked = false;
                    p.election = this.election;
                    this.httpRequest.updateParticipant(p).then(
                        () => {
                            this.httpRequest.getPhasesById(3).then(
                                phase3 => {
                                    let anElection = this.election;
                                    anElection.phase = phase3 as Phase;
                                    this.httpRequest.updateElection(anElection).then(
                                        () => {
                                            if (this.connectedAccount.userId == this.election['hostId']) {

                                                let newNotification2: Notification = {
                                                    message: "Début de la phase d'objections pour le poste de " + this.election.job + '.',
                                                    date: new Date(),
                                                    election: this.election as Election
                                                };
                                                this.httpRequest.createNotification(newNotification2).then(
                                                    () => {
                                                        this.hubConnection.send("updatePhase", Number(this.election['electionId']));
                                                    }, error => { console.log(error) }
                                                );
                                            }
                                        }, error => { console.log(error) }
                                    );
                                }, error => { console.log(error) }
                            );
                        }, error => { console.log(error) }
                    );
                })
            }
        )
    }
}