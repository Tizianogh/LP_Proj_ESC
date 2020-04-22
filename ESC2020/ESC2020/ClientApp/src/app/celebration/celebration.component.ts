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
import { ElectionService } from '../services/election.service';
import { HTTPRequestService } from '../services/HTTPRequest.service';
import { Notification } from '../Model/Notification';


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

    constructor(private httpRequest: HTTPRequestService, private electionService: ElectionService, private authentificationService: AuthentificationService) {}

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        this.electionService.GetElection().subscribe(anElection => this.setupElection(anElection));
        this.actualElected = null;
        this.preStart();
    }

    setupElection(anElection: Election) {
        this.election = anElection;
        this.election.job = anElection['job'];
    }

    preStart() {
        //récupérer l'utilisateur actuellement élu en fonction du champ electedId d'une élection
        if (this.election['electedId'] != null) {
            this.httpRequest.getUserById(this.election['electedId']).then(
                userData => {
                    this.actualElected = userData as Users;
                    this.actualElected.firstName = userData['firstName'];
                    this.actualElected.lastName = userData['lastName'];
                    this.actualElected.avatar = userData['avatar'];
                    console.log(this.actualElected)
                }
            )
        }
    }
}