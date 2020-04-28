import { Component, OnInit } from '@angular/core';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { AuthentificationService } from '../services/authentification.service';
import { NavBarStateService } from '../services/NavBarState.service';
import * as signalR from "@microsoft/signalr";
import { ElectionService } from '../services/election.service';
import { Phase } from '../Model/Phase';
import { HTTPRequestService } from '../services/HTTPRequest.service';
import { Opinion } from '../Model/Opinion';
import { Notification } from '../Model/Notification';
import { isUndefined } from 'util';
import { TranslateService } from '@ngx-translate/core';

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

    public listeUsers: Users[] = [];

    age: number;

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private translate: TranslateService, private httpRequest: HTTPRequestService, private electionService: ElectionService, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) {
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang);
    }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.setupConnectedAccount(anUser));
        this.electionService.GetElection().subscribe(anElection => this.setupElection(anElection));
        this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
        this.electionService.GetUserList().subscribe(users => this.setupUsers(users));

        this.navBarStateService.SetIsInElection(true);
        this.navBarStateService.SetLogsVisible(true);

        this.setOnSignalReceived();
        this.hubConnection.start().catch(err => console.log(err));

        this.getCurrentParticipant();
    }

    setupConnectedAccount(anUser: Users) {
        this.connectedAccount = anUser;
        this.connectedAccount.userId = anUser['userId'];
    }

    setupElection(anElection: Election) {
        this.election = anElection;
        this.election.hostElection = anElection['hostId'];
    }

    setOnSignalReceived() {
        this.hubConnection.on("changeParticipants", (electionId: number, phaseId: number) => {
            if (electionId == this.election.electionId && phaseId == 1) {
                this.listeParticipants = [];
                this.listeUsers = [];

                this.electionService.fetchElection(this.election.electionId.toString()).then(
                    () => {
                        this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
                        this.electionService.GetUserList().subscribe(users => this.setupUsers(users));
                    }
                )
            }
        });

        this.hubConnection.on("userHasVoted", (electionId: number, phaseId: number) => {
            if (electionId == Number(this.election.electionId) && phaseId == 1) {
                this.getCurrentParticipant();
                this.listeParticipants = [];
                this.listeUsers = [];

                this.electionService.fetchElection(String(electionId));
                this.electionService.GetParticipantList().subscribe(participants => this.listeParticipants = participants);
                this.electionService.GetUserList().subscribe(users => this.setupUsers(users));
            }
        });
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

    getCurrentParticipant() {
        this.currentParticipant = new Participant();
        this.httpRequest.getParticipant(this.connectedAccount, this.election).then(
            participant => {
                this.currentParticipant = participant as Participant;
            }, error => {console.log(error)}
        );
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

        this.httpRequest.getTypeOpininionsById(1).then(
            typeOpinion => {
                let vote: Opinion = {
                    authorUser: this.connectedAccount,
                    concernedUser: this.currentUser,
                    reason: (<HTMLInputElement>document.getElementById("argumentaires")).value,
                    type: typeOpinion as TypeOpinion,
                    dateOpinion: new Date(),
                    election: this.election
                }
                this.httpRequest.createOpinion(vote);
            }, error => { console.log(error); }
        );

        //Si l'User vote pour lui même, HasTalked en true et ajoute +1 au VoteCounter
        if (this.connectedAccount['userId'] == this.currentUser['userId']) {
            this.httpRequest.getParticipant(this.connectedAccount, this.election).then(
                participantData => {
                    let participant = participantData as Participant;
                    let updatedParticipant: Participant = { user: this.connectedAccount, election: this.election, hasTalked: true, voteCounter: participant.voteCounter + 1 }
                    this.httpRequest.updateParticipant(updatedParticipant).then(
                        () => {
                            this.navBarStateService.SetLogsVisible(true);
                            this.hubConnection.send("userHasVoted", this.election.electionId, Number(this.election['electionPhaseId']));
                        }, error => { console.log(error) }
                    );
                }, error => { console.log(error); }
            );
        }
        //Sinon il vote pour quelqu'un d'autre que lui même
        else {
            //Met HasTalked de l'User en true
            this.httpRequest.getParticipant(this.connectedAccount, this.election).then(
                participantData => {
                    let participant = participantData as Participant;
                    let updatedParticipant: Participant = {
                        user: this.connectedAccount,
                        election: this.election,
                        hasTalked: true,
                        voteCounter: participant.voteCounter
                    }
                    this.httpRequest.updateParticipant(updatedParticipant)
                }, error => { console.log(error) }
            );

            this.navBarStateService.SetLogsVisible(true);

            //Ajoute +1 au VoteCounter au participant pour qui on vote
            this.httpRequest.getParticipant(this.currentUser, this.election).then(
                participantData => {
                    let participant = participantData as Participant;
                    let updatedParticipant: Participant = {
                        user: this.currentUser,
                        election: this.election,
                        hasTalked: participant.hasTalked,
                        voteCounter: participant.voteCounter + 1
                    }
                    this.httpRequest.updateParticipant(updatedParticipant).then(
                        participant => {
                            this.hubConnection.send("userHasVoted", this.election.electionId, Number(this.election['electionPhaseId']))
                        });
                }, error => { console.log(error) }
            );
        }
    }

    Exclude() {
        this.httpRequest.getParticipant(this.currentUser, this.election).then(
            participantData => {
                let participant: Participant = participantData as Participant;
                participant.user = this.currentUser;
                participant.election = this.election;

                this.httpRequest.deleteParticipant(participant).then(
                    () => {
                        this.hubConnection.send("changeParticipants", this.election.electionId, Number(this.election['electionPhaseId']));
                    });
            }, error => { console.log(error) }
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
                        updatedParticipantData => { }, error => { console.log(error) }
                    );
                })
            }
        )

        this.httpRequest.getPhasesById(2).then(
            phase2 => {
                console.log(this.election)
                let anElection = this.election;
                anElection.phase = phase2 as Phase;

                this.httpRequest.updateElection(anElection).then(
                    () => {
                        let newNotification: Notification = {
                            message: "Début de la phase de report de votes pour le poste de " + this.election.job + '.',
                            date: new Date(),
                            election: this.election as Election
                        };
                        this.httpRequest.createNotification(newNotification).then(
                            notification => {
                                this.hubConnection.send("updatePhase", Number(this.election['electionId']));
                            }, error => { console.log(error) }
                        );
                    }, error => { console.log(error) }
                );
            }, error => { console.log(error) }
        );
    }
}