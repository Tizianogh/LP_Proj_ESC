import { Component, OnInit, AfterViewInit } from '@angular/core';
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
import { templateJitUrl } from '@angular/compiler';
        

@Component({
    selector: 'app-election',
    templateUrl: './election-master-page.component.html',
    styleUrls: ['./election-master-page.component.css']
})

export class ElectionMasterPageComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users = new Users();
    private electionId: string;
    private type: TypeOpinion = new TypeOpinion();
    private listeParticipants: Participant[] = [];
    private electionPhase: string;
    opinionsList: Opinion[] = [];

    currentUser: Users = new Users();
    election: Election = new Election();
    currentParticipant: Participant = new Participant();
    scrollingItems: number[] = [];
    actualClickedId: number = 1;

    private listeUsers: Users[] = [];
    private liste: Users[] = [];

    age: number;

    constructor(private service: HttpClient, private router: Router, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        this.navBarStateService.SetIsInElection(true);

        this.fetchElection();
    }

    async fetchElection() {
        //Récupérer l'id de l'élection actuelle à partir de l'url
        this.electionId = this.router.url.split('/')[2];
        await this.service.get(window.location.origin + "/api/Elections/" + this.electionId).subscribe(result => {
            this.election = result as Election;
            this.navBarStateService.SetNavState(this.election['job']);
            this.fetchParticipants();
        }, error => console.error(error));
    }

    fetchParticipants() {
        //récupérer la liste des participants en fonction de l'id d'une élection
        this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participantResult => {
            this.listeParticipants = participantResult as Participant[];
            this.listeParticipants.forEach((participant) => {
                this.navBarStateService.SetLogsVisible(this.listeParticipants.find(p => p['userId'] == this.connectedAccount['userId'])['hasTalked']);
                this.fetchUser(participant);
            });
        }, error => console.error(error));
        this.setElectionStatus();
    }

    async fetchUser(participant: Participant) {
        //Récupérer un utilisateur en fonction d'un participant d'une élection passé en paramètred
        await this.service.get(window.location.origin + "/api/Users/" + participant['userId']).subscribe(userResult => {
            let user: Users = userResult as Users;
            this.listeUsers.push(userResult as Users);
        }, error => console.error(error));
    }

    setElectionStatus() {
        this.electionPhase = this.election['electionPhaseId'];
    }
}