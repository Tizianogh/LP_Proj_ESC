import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { Users } from '../Model/Users';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { partition } from 'rxjs';
import { async } from '@angular/core/testing';
import * as signalR from "@microsoft/signalr";
import { NavBarStateService } from '../services/NavBarState.service';

@Component({
    selector: 'app-salons',
    templateUrl: './my-elections.component.html',
    styleUrls: ['./my-elections.component.css']
})

export class MyElectionsComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users;
    private electionId: number;
    private listeElections: Election[] = [];
    private listeParticipants: Participant[] = [];
    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();
    constructor(private authentificationService: AuthentificationService, private service: HttpClient, private router: Router, private navBarStateService: NavBarStateService) { }
 



    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.navBarStateService.SetIsInElection(false);
        this.hubConnection.start().catch(err => console.log(err));
        this.getElections()
    }

    getElections() {
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId']).subscribe(result => {
            this.listeParticipants = result as Participant[];
            for (let i in this.listeParticipants) {
                this.service.get(window.location.origin + "/api/Elections/" + this.listeParticipants[i]["electionId"]).subscribe(electionresult => {

                    let election: Election = electionresult as Election;
                    this.service.get(window.location.origin + "/api/Participants/election/" + election['electionId']).subscribe(result => {
                        let participantResult = result as Participant[];
                        election.nbParticipant = participantResult.length;
                    }, error => console.error(error));

                    this.listeElections.push(election);
                    console.log(election);
                }, error => console.error(error));
            }
        }, error => console.error(error));
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
        document.getElementById("ongletMesElections").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletElectionsCrees").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletElectionsTermines").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletAjouterElections").style.cssText = "border-bottom: 5px solid #430640;";
    }

    rajouterElections(codeInput: string) {
        this.service.get(window.location.origin + "/api/Elections/code/" + codeInput).subscribe(result => {
            console.log(result);
            this.listeElections.push(result as Election);
            this.service.post(window.location.origin + "/api/Participants", {
                'UserId': this.connectedAccount['userId'],
                'ElectionId': result['electionId'],
                'HasTalked': false
            }).subscribe(result => {
                this.hubConnection.send("changeParticipants",result['electionId']);
                console.log(result);
            }, error => console.log(error));
        }, error => console.error(error));
    }

    Navigate(id: number) {
        this.router.navigate(['election/' + id]);
    }
}