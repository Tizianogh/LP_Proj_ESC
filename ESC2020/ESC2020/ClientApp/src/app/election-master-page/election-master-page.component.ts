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
import * as signalR from "@microsoft/signalr";
        

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

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private service: HttpClient, private electionService: ElectionService, private router: Router, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) { }

    ngOnInit() {
        this.electionId = this.router.url.split("/")[2];
        this.electionService.ClearParticipantList();
        this.electionService.ClearUserList();
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.electionService.fetchElection(this.electionId);
        this.electionService.GetElection().subscribe(anElection => this.election = anElection);
        this.navBarStateService.SetIsInElection(true);
        this.setElectionStatus();
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