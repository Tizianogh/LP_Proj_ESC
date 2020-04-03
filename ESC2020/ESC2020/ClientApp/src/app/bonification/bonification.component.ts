import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Session } from '../Model/Session';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { Log } from '../Model/Log';
import { Opinion } from '../Model/Opinion';
import { DatePipe } from '@angular/common';
import { FunctionCall } from '@angular/compiler';
import { FormsModule } from '@angular/forms';
import { NavBarStateService } from '../services/NavBarState.service';


@Component({
    selector: 'app-election',
    templateUrl: './bonification.component.html',
    styleUrls: ['./bonification.component.css']
})

export class BonificationComponent implements OnInit {

    connected: boolean;
    connectedAccount: Users = new Users();

    session: Session = new Session();
    isElectedNotNull: boolean = false;
    actualElected: Users = new Users();
    connectedParticipant: Participant = new Participant();
    type: TypeOpinion = new TypeOpinion();

    host: boolean = false;

    participantsList: Participant[] = [];
    opinionsList: Opinion[] = [];
    usersList: Users[] = [];
    objectionsList: Opinion[] = [];
    //propositions: Proposition[] = [];

    constructor(private service: HttpClient, private router: Router, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) {
        
    }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.navBarStateService.SetIsInElection(true);
        this.navBarStateService.SetObjectionsVisible(true);
        this.navBarStateService.SetLogsVisible(true);
       // setInterval(() => this.getObjections(), 5000); // solution temporaire avant SignalR

        this.mainRequest();
    }

    mainRequest() {
        //Récupérer l'id de l'élection actuelle à partir de l'url
        let regexp: RegExp = /\d/;
        let electionId = regexp.exec(this.router.url)[0];
        this.service.get(window.location.origin + "/api/Elections/" + electionId).subscribe(result => {
            this.session = result as Session;
            this.navBarStateService.SetNavState(this.session['job']);
            this.getConnectedParticipant();
            this.checkHost();
            this.preStart();
        }, error => console.error(error));
    }

    getConnectedParticipant() {
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.session['electionId']).subscribe(result => {
            this.connectedParticipant = result as Participant;
        }, error => console.log(error));
    }

    checkHost() {
        if (this.connectedAccount["userId"] == this.session['hostId']) {
            this.host = true;
        }
        else {
            this.host = false;
        }
    }

    preStart() {
        //récupérer l'utilisateur actuellement élu en fonction du champ electedId d'une élection
        if (this.session['electedId'] != null) {
            this.isElectedNotNull = true;
            this.service.get(window.location.origin + "/api/Users/" + this.session['electedId']).subscribe(userResult => {
                this.actualElected = userResult as Users;
            }, error => console.error(error));
        } 
    }


    refus() {
         // génération d'une opinion Bonification (id du type : 3 = opinion de type bonification)
         this.service.get(window.location.origin + "/api/TypeOpinions/3").subscribe(result => {
            this.type = result as TypeOpinion;
            this.service.post(window.location.origin + "/api/Opinions", {
                'AuthorId': this.connectedAccount["userId"],
                'ConcernedId': this.actualElected["userId"],
                'Reason': (<HTMLInputElement>document.getElementById("argumentaires")).value,
                'TypeId': this.type["typeId"],
                'DateOpinion': new Date(),
                'ElectionId': this.session['electionId']
            }).subscribe(result => {
                (<HTMLInputElement>document.getElementById("argumentaires")).value = "";
                console.log(result);
            }, error => console.log(error));
         }, error => console.error(error));

        this.service.put(window.location.origin + "/api/Elections/" + this.session['electionId'], {
            "ElectionId": this.session['electionId'],
            "Job": this.session['job'],
            "Mission": this.session['mission'],
            "Responsability": this.session['responsabilites'],
            "StartDate": this.session['dateD'],
            "EndDate": this.session['dateF'],
            "CodeElection": this.session['codeElection'],
            "HostId": this.session["hostId"],
            "ElectedId": null
        }).subscribe(result => {

        }, error => console.log(error));

    }

    celebration() {
        alert("Fécilitation, vous avez accepté le rôle de " + this.session['job']);
    }



}