import { Component, OnInit } from '@angular/core';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { Users } from '../Model/Users';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import * as signalR from "@microsoft/signalr";
import { NavBarStateService } from '../services/NavBarState.service';
import { HTTPRequestService } from '../services/HTTPRequest.service';
import { HttpClient } from '@angular/common/http';

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

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private authentificationService: AuthentificationService, private router: Router, private navBarStateService: NavBarStateService, private httpRequest: HTTPRequestService, private service: HttpClient) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => { this.connectedAccount = anUser; this.getElections(); this.MesElections();});
        this.navBarStateService.SetIsInElection(false);
        this.hubConnection.start().catch(err => console.log(err));
       
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
                                    if(election['electionPhaseId']==5){
                                        this.FinishedElectionsList.push(election);
                                    }
                                    else{
                                        this.OngoingElectionsList.push(election);
                                     }
                                    console.log(election)
                                }, error => { console.log(error) }
                            );
                        }, error => { console.log(error) }
                    );
                });
            }, error => { console.log(error) }
        );
    }

    getLink(election: Election) {
        return "http://51.158.77.237/join-election-link/" + election['codeElection'];
    }

    getElectedUser(election: Election) {
        //récupérer l'utilisateur actuellement élu en fonction du champ electedId d'une élection
        if (election['electedId'] != null) {
            this.service.get(window.location.origin + "/api/Users/" + election['electedId']).subscribe(userResult => {
                this.userElected = userResult as Users;
                this.userElected.firstName = userResult['firstName'];
                this.userElected.lastName = userResult['lastName'];
                document.getElementById("election" + election['electionId']).innerHTML = "&nbsp;" + this.userElected.firstName + " " + this.userElected.lastName
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

    CreateElection() {
        this.router.navigate(["create-election/"]);
    }
}