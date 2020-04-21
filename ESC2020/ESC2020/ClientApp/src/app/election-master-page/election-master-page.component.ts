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
import { ElectionService } from '../services/election.service';
import * as signalR from "@microsoft/signalr";
        

@Component({
    selector: 'app-election-master-page',
    templateUrl: './election-master-page.component.html',
})

export class ElectionMasterPageComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users = new Users();
    private electionId: string;
    public electionPhase: string = '0';

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
        

        this.electionService.ClearParticipantList();
        this.electionService.ClearUserList();
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.authentificationService.verifConnectedUserVerification(this.connectedAccount);
        this.navBarStateService.SetIsInElection(true);

        this.electionService.fetchElection(this.router.url.split('/')[2]);
        this.electionService.GetElection().subscribe(anElection => this.setElectionStatus(anElection));
        this.electionService.acceptedParticipantVerification(this.connectedAccount, this.router.url.split('/')[2]);
        this.hubConnection.start().catch(err => console.log(err));
        
        this.onSignalReceived();
    }

    

    onSignalReceived() {
        this.hubConnection.on("updatePhase", (electionId: number) => {
            if (electionId == Number(this.electionId)) {
                this.electionPhase = '';
                this.electionService.fetchElection(this.electionId);
            }
        });
    }

    setElectionStatus(anElection: Election) {
        this.election = null;
        this.electionPhase = null;
        this.election = anElection;
        this.electionId = this.election['electionId'];
        this.electionPhase = this.election['electionPhaseId'];
        switch (Number(this.electionPhase)) {
            case 1:
                this.navBarStateService.SetLogsVisible(false);
                this.navBarStateService.SetObjectionsVisible(false);
                this.navBarStateService.SetNavState(this.election['job']);
                break;

            case 2:
                this.navBarStateService.SetLogsVisible(true);
                this.navBarStateService.SetObjectionsVisible(false);
                this.navBarStateService.SetNavState(this.election['job']);
                break;

            default:
                this.navBarStateService.SetLogsVisible(true);
                this.navBarStateService.SetObjectionsVisible(true);
                this.navBarStateService.SetNavState(this.election['job']);
                break;
        }
    }
}