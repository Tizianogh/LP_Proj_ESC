import { Component, OnInit } from '@angular/core';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { Phase } from '../Model/Phase';
import { AuthentificationService } from '../services/authentification.service';
import { Opinion } from '../Model/Opinion';
import { ElectionService } from '../services/election.service';
import * as signalR from "@microsoft/signalr";
import { HTTPRequestService } from '../services/HTTPRequest.service';
import { Notification } from '../Model/Notification';

@Component({
    selector: 'app-bonification',
    templateUrl: './bonification.component.html',
    styleUrls: ['./bonification.component.css']
})

export class BonificationComponent implements OnInit {
    connected: boolean;
    connectedAccount: Users = new Users();

    election: Election = new Election();
    isElectedNotNull: boolean = false;
    actualElected: Users = new Users();
    connectedParticipant: Participant = new Participant();
    host: boolean = false;

    opinionsList: Opinion[] = [];

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private httpRequest: HTTPRequestService, private electionService: ElectionService, private authentificationService: AuthentificationService) {
    }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        this.electionService.GetElection().subscribe(anElection => this.setupElection(anElection));

        this.mainRequest();
        this.hubConnection.start().catch(err => console.log(err));
    }

 

    mainRequest() {
        this.getConnectedParticipant();
        this.checkHost();
        this.preStart();
    }

    getConnectedParticipant() {
        this.httpRequest.getParticipant(this.connectedAccount, this.election).then(
            participantData => {
                this.connectedParticipant = participantData as Participant;
            }, error => console.log(error)
        );
    }

    setupElection(anElection: Election) {
        this.election = anElection;
        this.election.job = anElection['job'];
        this.election.mission = anElection['mission'];
        this.election.responsability = anElection['responsability'];
    }

    checkHost() {
        if (this.connectedAccount["userId"] == this.election['hostId'])
            this.host = true;
        else
            this.host = false;
    }

    preStart() {
        //récupérer l'utilisateur actuellement élu en fonction du champ electedId d'une élection
        if (this.election['electedId'] != null) {
            this.isElectedNotNull = true;
            this.httpRequest.getUserById(this.election['electedId']).then(
                userData => {
                    this.actualElected = userData as Users;
                },error => console.log(error)
            );
        }
    }

    refus() {

        this.httpRequest.getTypeOpininionsById(2).then(
            typeOpinion => {
                let revote: Opinion = {
                    authorUser: this.connectedAccount,
                    concernedUser: this.actualElected,
                    reason: (<HTMLInputElement>document.getElementById("argumentaires")).value,
                    type: typeOpinion as TypeOpinion,
                    dateOpinion: new Date(),
                    election: this.election
                }
                this.httpRequest.createOpinion(revote)

                let newNotification: Notification = {
                    message: this.actualElected['firstName'] + ' ' + this.actualElected['lastName'] + " a refusé de pourvoir le rôle de " + this.election['job'],
                    date: new Date(),
                    election: this.election as Election
                };
                this.httpRequest.createNotification(newNotification).then(
                    () => {
                        this.hubConnection.send("updatePhase", Number(this.election['electionId']));
                    }, error => { console.log(error) }
                );
            }, error => console.log(error)
        );

        this.httpRequest.getParticipant(this.actualElected, this.election).then(
            participantData => {
                let proposedParticipant = participantData as Participant;
                proposedParticipant.voteCounter = 0;
                this.httpRequest.updateParticipant(proposedParticipant).then(
                    () => {
                        this.httpRequest.getParticipantsByElection(this.election).then(
                            participantsData => {
                                let participantsList: Participant[] = participantsData as Participant[];

                                participantsList.forEach(participant => {
                                    participant.hasTalked = false;
                                    this.httpRequest.updateParticipant(participant).then(
                                        () => {
                                            this.httpRequest.getPhasesById(3).then(
                                                phase5 => {
                                                    let anElection = this.election;
                                                    anElection.phase = phase5 as Phase;
                                                    anElection.electedElection = this.actualElected,

                                                    this.httpRequest.updateElection(anElection).then(
                                                        () => {
                                                            this.hubConnection.send("updatePhase", Number(this.election['electionId']));
                                                        }, error => console.log(error)
                                                    ); 
                                                }, error => { console.log(error) }
                                            );
                                        }
                                    );
                                });
                            }, error => console.log(error)
                        );
                    },error=>console.log(error)
                )
            },error =>console.log(error)
        );
    }

    goToNextPhase() {

        this.httpRequest.getPhasesById(5).then(
            phase5 => {
                let anElection = this.election;
                anElection.phase = phase5 as Phase;
                anElection.electedElection = this.actualElected,

                this.httpRequest.updateElection(anElection).then(
                    () => {
                        let newNotification: Notification = {
                            message: this.actualElected['firstName'] + ' ' + this.actualElected['lastName'] + " a accepté de pourvoir le rôle de " + this.election['job'] + ". Félicitations !",
                            date: new Date(),
                            election: this.election as Election
                        };
                        this.httpRequest.createNotification(newNotification).then(
                            () => {
                                this.hubConnection.send("updatePhase", Number(this.election['electionId']));
                            }, error => { console.log(error) }
                        );
                    }, error => { console.log(error) }
                );
            }, error => { console.log(error) }
        );
    }
}