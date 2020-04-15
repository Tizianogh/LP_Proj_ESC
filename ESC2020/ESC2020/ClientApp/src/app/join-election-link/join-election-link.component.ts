import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthentificationService } from '../services/authentification.service';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { Users } from '../Model/Users'
@Component({
    selector: 'app-creation',
    templateUrl: './join-election-link.component.html',
    styleUrls: ['./join-election-link.component.css'],
    providers: [DatePipe]
})

export class JoinElectionLinkComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users;
    private listeElections: Election[] = [];
    private listeParticipants: Participant[] = [];
    election: Election = new Election();
    code: string;
    erreur: string;

    constructor(private service: HttpClient, private router: Router, private datePipe: DatePipe, private authentificationService: AuthentificationService) { }

    ngOnInit() {

        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.code = this.router.url.split('/')[2];
        console.log(this.code);
        console.log(this.connected);
        console.log(this.connectedAccount);
        this.service.get(window.location.origin + "/api/Elections/code/" + this.code).subscribe(result => {
            this.election = result as Election;
        }, error => console.error(error));
          
        
    }

    submit() {
        this.service.get(window.location.origin + "/api/Elections/code/" + this.code).subscribe(result => {
            console.log(result);
            this.listeElections.push(result as Election);
            this.service.post(window.location.origin + "/api/Participants", { 'UserId': this.connectedAccount['userId'], 'ElectionId': result['electionId'] }).subscribe(result => {
                console.log(result);
            }, error => console.log(error));
        }, error => console.error(error));
        this.router.navigate(["my-elections"]);
    }


}