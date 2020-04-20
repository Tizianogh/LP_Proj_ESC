import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { Users } from '../Model/Users'
import * as signalR from "@microsoft/signalr";
@Component({
    selector: 'app-creation',
    templateUrl: './join-election-link.component.html',
    styleUrls: ['./join-election-link.component.css'],
    providers: [DatePipe]
})

export class JoinElectionLinkComponent implements OnInit {

    private connected: boolean;
    public connectedAccount: Users;
    private listeElections: Election[] = [];
    private listeParticipants: Participant[] = [];
    election: Election = new Election();
    electionId: number;
    code: string;
    erreur: string;

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private service: HttpClient, private router: Router, private datePipe: DatePipe, private authentificationService: AuthentificationService) { }

    ngOnInit() {

        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.setupConnectedAccount(anUser));
        this.code = this.router.url.split('/')[2];
        this.service.get(window.location.origin + "/api/Elections/code/" + this.code).subscribe(result => {
            this.election = result as Election;
        }, error => console.error(error));
          
        
        this.hubConnection.start().catch(err => console.log(err));
    }

    setupConnectedAccount(anUser: Users) {
            this.connectedAccount = anUser;
            this.connectedAccount.BirthDate = anUser['birthDate'];
            this.connectedAccount.FirstName = anUser['firstName'];
            this.connectedAccount.LastName = anUser['lastName'];
            this.connectedAccount.Email = anUser['email'];
            this.connectedAccount.Description = anUser['description'];
            this.connectedAccount.Job = anUser['job'];
        }

    submit() {
        this.service.get(window.location.origin + "/api/Elections/code/" + this.code).subscribe(result => {
            this.listeElections.push(result as Election);
            this.electionId = result['electionId'];
            this.service.post(window.location.origin + "/api/Participants", {
                'UserId': this.connectedAccount['userId'],
                'ElectionId': result['electionId']
            }).subscribe(result => {
                this.hubConnection.send("changeParticipants", Number(result['electionId']), Number(result['electionPhaseId']));
                this.router.navigate(["my-elections"]);
            }, error => console.log(error));
        }, error => console.error(error));
    }
}