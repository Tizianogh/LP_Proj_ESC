import { Component, OnInit } from '@angular/core';
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
import { ElectionService } from '../services/election.service';
        

@Component({
    selector: 'app-election',
    templateUrl: './election-master-page.component.html',
})

export class ElectionMasterPageComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users = new Users();
    private electionId: string;
    private listeParticipants: Participant[] = [];
    private electionPhase: string = '0';

    opinionsList: Opinion[] = [];

    currentUser: Users = new Users();
    election: Election = new Election();
    currentParticipant: Participant = new Participant();

    age: number;

    constructor(private service: HttpClient, private electionService: ElectionService, private router: Router, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) { }

    ngOnInit() {
        this.electionService.ClearParticipantList();
        this.electionService.ClearUserList();

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
            this.electionService.SetElection(this.election);
            this.navBarStateService.SetNavState(this.election['job']);
            this.fetchParticipants();
        }, error => console.error(error));
    }

    async fetchParticipants() {
        //récupérer la liste des participants en fonction de l'id d'une élection
        await this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participantResult => {
            this.listeParticipants = participantResult as Participant[];
            this.listeParticipants.forEach((participant) => {
                this.navBarStateService.SetLogsVisible(this.listeParticipants.find(p => p['userId'] == this.connectedAccount['userId'])['hasTalked']);
                this.electionService.AddParticipant(participant);
                this.fetchUser(participant);
            });
        }, error => console.error(error));
    }

    async fetchUser(participant: Participant) {
        //Récupérer un utilisateur en fonction d'un participant d'une élection passé en paramètred
        await this.service.get(window.location.origin + "/api/Users/" + participant['userId']).subscribe(userResult => {
            let user: Users = userResult as Users;
            this.electionService.AddUser(user);
            this.setElectionStatus();
        }, error => console.error(error));
    }

    setElectionStatus() {
        this.electionPhase = this.election['electionPhaseId'];
        switch (Number(this.electionPhase)) {
            case 1:
                this.navBarStateService.SetLogsVisible(false);
                this.navBarStateService.SetObjectionsVisible(false);
                break;

            case 2:
                this.navBarStateService.SetLogsVisible(true);
                this.navBarStateService.SetObjectionsVisible(false);
                break;

            default:
                this.navBarStateService.SetLogsVisible(true);
                this.navBarStateService.SetObjectionsVisible(true);
                break;
        }
    }
}