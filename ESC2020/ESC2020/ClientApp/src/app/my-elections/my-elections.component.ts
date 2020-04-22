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

    qrdata: string = null;
    userElected: Users = new Users();
    private connectedAccount: Users;
    private electionId: number;
    public FinishedElectionsList: Election[] = [];
    public OngoingElectionsList: Election[] = [];
    public listeElections: Election[] = [];
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
        this.getElections();
        this.MesElections();
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

                    if (election['electionPhaseId'] == 5) {
                        this.FinishedElectionsList.push(election);
                    } else {
                        this.OngoingElectionsList.push(election);
                    }
                }, error => console.error(error));
            }
        }, error => console.error(error));
    }

    getLink(election: Election) {
        return "http://51.158.77.237/join-election-link/" + election['codeElection'];
    }

    getElectedUser(election: Election) {
        //récupérer l'utilisateur actuellement élu en fonction du champ electedId d'une élection
        if (election['electedId'] != null) {
            this.service.get(window.location.origin + "/api/Users/" + election['electedId']).subscribe(userResult => {
                this.userElected = userResult as Users;
                this.userElected.FirstName = userResult['firstName'];
                this.userElected.LastName = userResult['lastName'];
                document.getElementById("election" + election['electionId']).innerHTML = "&nbsp;" + this.userElected.FirstName + " " + this.userElected.LastName
            }, error => console.error(error));
        }
    }

    MesElections() {
        document.getElementById("ongletMesElections").style.cssText = "border-bottom: 5px solid #430640;";
        document.getElementById("ongletElectionsTermines").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletAjouterElections").style.cssText = "border-bottom: 0px solid #430640;";
        this.listeElections = this.OngoingElectionsList;
    }

    ElectionsTermines() {
        document.getElementById("ongletMesElections").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletElectionsTermines").style.cssText = "border-bottom: 5px solid #430640;";
        document.getElementById("ongletAjouterElections").style.cssText = "border-bottom: 0px solid #430640;";
        this.listeElections = this.FinishedElectionsList;
        this.listeElections.forEach(election => {
            this.getElectedUser(election);
        });

    }

    rajouterElections(codeInput: string) {
        this.service.get(window.location.origin + "/api/Elections/code/" + codeInput).subscribe(result => {
            this.listeElections.push(result as Election);
            this.service.post(window.location.origin + "/api/Participants", {
                'UserId': this.connectedAccount['userId'],
                'ElectionId': result['electionId'],
                'HasTalked': false
            }).subscribe(participantResult => {
                this.hubConnection.send("changeParticipants", Number(result['electionId']), Number(result['electionPhaseId']));
            }, error => console.log(error));
        }, error => console.error(error));
    }

    Navigate(id: number) {
        this.router.navigate(['election/' + id]);
    }
}