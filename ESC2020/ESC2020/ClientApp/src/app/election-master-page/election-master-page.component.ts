import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { Users } from '../Model/Users';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { NavBarStateService } from '../services/NavBarState.service';
import { Opinion } from '../Model/Opinion';
import { ElectionService } from '../services/election.service';
import * as signalR from "@microsoft/signalr";
        

@Component({
    selector: 'app-election-master-page',
    templateUrl: './election-master-page.component.html',
})

export class ElectionMasterPageComponent implements OnInit {

    electionPhase: string = '0';
    electionId: string;
    election = new Election()

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private electionService: ElectionService, private router: Router, private navBarStateService: NavBarStateService) { }

    async ngOnInit() {
        this.hubConnection.start().catch(err => console.log(err));
        this.onSignalReceived();

        this.electionService.ClearParticipantList();
        this.electionService.ClearUserList();

        this.navBarStateService.SetIsInElection(true);

        this.electionService.fetchElection(this.router.url.split('/')[2]).then(
            electionData => {
                this.election = electionData;
                this.setElectionStatus(this.election)
            }, error => { console.log(error);}
        );
    }

    onSignalReceived() {
        this.hubConnection.on("updatePhase", (electionId: number) => {
            if (electionId == Number(this.electionId)) {
                this.electionPhase = '';
                this.electionService.fetchElection(this.electionId).then(
                    electionData => {
                        this.election = electionData;
                        this.setElectionStatus(this.election)
                    }, error => { console.log(error); }
                );
            }
        });
    }

    setElectionStatus(anElection: Election) {
        this.election = null;
        this.electionPhase = null;
        this.election = anElection;
        this.electionId = this.election['electionId'].toString();
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