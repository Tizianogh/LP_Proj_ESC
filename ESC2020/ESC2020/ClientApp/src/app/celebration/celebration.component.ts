import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { Opinion } from '../Model/Opinion';
import { NavBarStateService } from '../services/NavBarState.service';


@Component({
    selector: 'app-celebration',
    templateUrl: './celebration.component.html',
    styleUrls: ['./celebration.component.css']
})

export class CelebrationComponent implements OnInit {

    connected: boolean;
    connectedAccount: Users = new Users();

    election: Election = new Election();
    actualElected: Users = new Users();
    connectedParticipant: Participant = new Participant();
    type: TypeOpinion = new TypeOpinion();

    host: boolean = false;

    participantsList: Participant[] = [];
    opinionsList: Opinion[] = [];
    usersList: Users[] = [];
    objectionsList: Opinion[] = [];

    constructor(private service: HttpClient, private router: Router, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) {

    }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.navBarStateService.SetIsInElection(true);
        this.navBarStateService.SetObjectionsVisible(true);
        this.navBarStateService.SetLogsVisible(true);
        // setInterval(() => this.getObjections(), 5000); // solution temporaire avant SignalR

        this.mainRequest();
    }

    mainRequest() {
        //Récupérer l'id de l'élection actuelle à partir de l'url
        let regexp: RegExp = /\d/;
        let electionId = regexp.exec(this.router.url)[0];
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
        //récupérer l'utilisateur actuellement élu en fonction du champ electedId d'une élection
        if (this.election['electedId'] != null) {
            this.service.get(window.location.origin + "/api/Users/" + this.election['electedId']).subscribe(userResult => {
                this.actualElected = userResult as Users;
            }, error => console.error(error));
        }
    }
}