import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { Users } from '../Model/Users'
import * as signalR from "@microsoft/signalr";
import { HTTPRequestService } from '../services/HTTPRequest.service';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-creation',
    templateUrl: './join-election-link.component.html',
    styleUrls: ['./join-election-link.component.css'],
    providers: [DatePipe]
})

export class JoinElectionLinkComponent implements OnInit {

    private connected: boolean;
    public connectedAccount: Users;
    election: Election = new Election();
    code: string;
  
    public alreadyJoined: boolean =true;

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private translate: TranslateService, private httpRequest: HTTPRequestService, private router: Router, private datePipe: DatePipe, private authentificationService: AuthentificationService, private service: HttpClient) {

    }

    ngOnInit() {
        this.hubConnection.start().catch(err => console.log(err));

        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.authentificationService.connectedUserVerification(this.connectedAccount);
        this.code = this.router.url.split('/')[2];
        this.service.get(window.location.origin + "/api/Elections/code/" + this.code).subscribe(result => {
            this.election =result as Election;
        }, error => console.error(error));

        this.code = this.router.url.split('/')[2];
        this.httpRequest.getElectionByCode(this.code).then(
            electionData => {
                this.election = electionData as Election;
                this.alreadyJoinedElection();
            },error=>console.log(error)
        );
    }

    alreadyJoinedElection() {
        console.log(this.election)
        this.httpRequest.getParticipant(this.connectedAccount, this.election).then(
            participantData => {
                console.log(participantData);
                if (participantData == null) {
                    this.alreadyJoined = false;
                } else {
                    this.alreadyJoined = true;
                }
                console.log(this.alreadyJoined);
                
            }, error => console.log(error) 
        );
    }

    submit() {
        let participant: Participant = { user: this.connectedAccount, election: this.election, voteCounter: 0, hasTalked: false }

        this.httpRequest.createParticipant(participant).then(
            participantData  =>  {
                this.hubConnection.send("changeParticipants", Number(this.election['electionId']), Number(this.election['electionPhaseId']));
                this.router.navigate(["my-elections"]);
            }, error => console.log(error)
        );
    }
}