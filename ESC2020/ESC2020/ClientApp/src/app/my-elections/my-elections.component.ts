import { Component, OnInit } from '@angular/core';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { Users } from '../Model/Users';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import * as signalR from "@microsoft/signalr";
import { NavBarStateService } from '../services/NavBarState.service';
import { HTTPRequestService } from '../services/HTTPRequest.service';

@Component({
    selector: 'app-salons',
    templateUrl: './my-elections.component.html',
    styleUrls: ['./my-elections.component.css']
})

export class MyElectionsComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users;
    public listeElections: Election[] = [];

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private authentificationService: AuthentificationService, private router: Router, private navBarStateService: NavBarStateService, private httpRequest: HTTPRequestService) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.navBarStateService.SetIsInElection(false);
        this.hubConnection.start().catch(err => console.log(err));
        this.getElections();
        this.MesElections();
    }

    getElections() {
        this.httpRequest.getParticipantsByUser(this.connectedAccount).then(
            participantData => {
                let participants: Participant[] = participantData as Participant[];
                participants.forEach(p => {
                    this.httpRequest.getElectionById(p['electionId']).then(
                        electionData => {
                            let election: Election = electionData as Election
                            this.httpRequest.getParticipantsByElection(election).then(
                                participantsData => {
                                    let participants: Participant[] = participantsData as Participant[]
                                    election.nbParticipant = participants.length
                                    this.listeElections.push(election);
                                }, error => { console.log(error) }
                            );
                        }, error => {console.log(error)}
                    );
                });
            }, error => {console.log(error)}
        );
    }

    MesElections() {
        document.getElementById("ongletMesElections").style.cssText = "border-bottom: 5px solid #430640;";
        document.getElementById("ongletElectionsCrees").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletElectionsTermines").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletAjouterElections").style.cssText = "border-bottom: 0px solid #430640;";
    }

    ElectionsCrees() {
        document.getElementById("ongletMesElections").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletElectionsCrees").style.cssText = "border-bottom: 5px solid #430640;";
        document.getElementById("ongletElectionsTermines").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletAjouterElections").style.cssText = "border-bottom: 0px solid #430640;";
    }

    ElectionsTermines() {
        document.getElementById("ongletMesElections").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletElectionsCrees").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletElectionsTermines").style.cssText = "border-bottom: 5px solid #430640;";
        document.getElementById("ongletAjouterElections").style.cssText = "border-bottom: 0px solid #430640;";
    }

    ajouterElections() {
        //document.getElementById("ongletMesElections").style.cssText = "border-bottom: 0px solid #430640;";
        //document.getElementById("ongletElectionsCrees").style.cssText = "border-bottom: 0px solid #430640;";
        //document.getElementById("ongletElectionsTermines").style.cssText = "border-bottom: 0px solid #430640;";
        //document.getElementById("ongletAjouterElections").style.cssText = "border-bottom: 5px solid #430640;";
    }

    rajouterElections(codeInput: string) {

        let newElection;
        this.httpRequest.getElectionByCode(codeInput).then(
            election => {
                newElection = election
                this.listeElections.push(election as Election);
                let userAsNewParticipant: Participant = { user: this.connectedAccount, election: newElection, voteCounter: 0, hasTalked: false }
                this.httpRequest.createParticipant(userAsNewParticipant);
                this.hubConnection.send("changeParticipants", Number(newElection['electionId']), Number(newElection['electionPhaseId']));
            }, error => {console.log(error)}
        );
    }

    Navigate(id: number) {
        this.router.navigate(['election/' + id]);
    }
}