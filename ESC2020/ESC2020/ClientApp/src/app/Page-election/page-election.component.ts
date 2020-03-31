import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Session } from '../Model/Session';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Component({
    selector: 'app-election',
    templateUrl: './page-election.component.html',
    styleUrls: ['./page-election.component.css']
})

export class PageElectionComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users = new Users();
    private electionId: string;
    private type: TypeOpinion = new TypeOpinion();

    currentUser: Users = new Users();
    session: Session = new Session();
    //currentParticipant: Participant;
    scrollingItems: number[] = [];
    actualClickedId: number = 1;

    private listeUsers: Users[] = [];
    private liste: Users[] = [];

    age: number;

    constructor(private service: HttpClient, private router: Router, private authentificationService: AuthentificationService) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        //Récupérer l'id de l'élection actuelle à partir de l'url
        let regexp: RegExp = /\d/;
        this.electionId = regexp.exec(this.router.url)[0];

        this.service.get(window.location.origin + "/api/Elections/" + this.electionId).subscribe(result => {
            this.session = result as Session;

            //récupérer la liste des participants en fonction de l'id d'une élection
            this.service.get(window.location.origin + "/api/Participants/election/" + this.session['electionId']).subscribe(participantResult => {
                let listeParticipants = participantResult as Participant[];
                for (let participant in listeParticipants) {
                    this.service.get(window.location.origin + "/api/Users/" + listeParticipants[participant]['userId']).subscribe(userResult => {
                        this.listeUsers.push(userResult as Users);
                    }, error => console.error(error));
                }
            }, error => console.error(error));
        }, error => console.error(error));
    }

    actualParticipant(user: Users, birthDate: string) {
        document.getElementById("selectParticipant").style.visibility = "visible";
        
        const currentDate: Date = new Date();
        currentDate.getTime();
        console.log(currentDate.toString());
        const date: number = new Date(birthDate).getTime();
        console.log(birthDate);
        this.age = Math.floor(new Date(currentDate - date) / 31536000000); // 31536000000 = 1000*60*60*24*365
        console.log(this.age);
        this.currentUser = user;
    }
    
    changeColor(userId: number) {
        if (userId != this.actualClickedId) {
            document.getElementById(this.actualClickedId.toString()).style.borderColor = "black";
            document.getElementById(this.actualClickedId.toString()).style.borderWidth = "3px";

            this.actualClickedId = userId
            document.getElementById(this.actualClickedId.toString()).style.borderColor = "#430640";
            document.getElementById(this.actualClickedId.toString()).style.borderWidth = "5px";
        } else {
            document.getElementById(this.actualClickedId.toString()).style.borderColor = "#430640";
            document.getElementById(this.actualClickedId.toString()).style.borderWidth = "5px";
        }
    }

    Vote() {
        this.service.get(window.location.origin + "/api/TypeOpinions/1").subscribe(result => {
            this.type = result as TypeOpinion;
            this.service.post(window.location.origin + "/api/Opinions", {
                'AuthorId': this.connectedAccount["userId"],
                'ConcernedId': this.currentUser["userId"],
                'Reason': document.getElementById("argumentaires").value,
                //this.voteForm.get('arguments').value),
                'TypeId': this.type["typeId"],
                'Date': Date.now(),
                'ElectionId': this.session['electionId']
            }).subscribe(result => {
                console.log(result);
            }, error => console.log(error));

        }, error => console.error(error));
    }
}