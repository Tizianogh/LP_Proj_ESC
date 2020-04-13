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


@Component({
    selector: 'app-revote',
    templateUrl: './revote.component.html',
    styleUrls: ['./revote.component.css']
})

export class RevoteComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users = new Users();
    private electionId: string;
    private type: TypeOpinion = new TypeOpinion();
    private listeParticipants: Participant[] = []
    opinionsList: Opinion[] = [];

    currentUser: Users = new Users();
    election: Election = new Election();
    currentParticipant: Participant = new Participant();
    scrollingItems: number[] = [];
    actualClickedId: number = 1;

    private listeUsers: Users[] = [];
    private liste: Users[] = [];

    age: number;

    constructor(private service: HttpClient, private router: Router, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) { }

    ngOnInit() {
        this.navBarStateService.SetIsInElection(true);
        this.navBarStateService.SetLogsVisible(true);
        this.FetchParticipants();
    }

    async FetchParticipants() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        //Récupérer l'id de l'élection actuelle à partir de l'url
        let regexp: RegExp = /\d/;
        this.electionId = regexp.exec(this.router.url)[0];

        await this.service.get(window.location.origin + "/api/Elections/" + this.electionId).subscribe(result => {
            this.election = result as Election;
            this.setSubTitle();
            this.navBarStateService.SetNavState(this.election['job']);

            //récupérer la liste des participants en fonction de l'id d'une élection
            this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participants => {

                this.listeParticipants = participants as Participant[];
                this.listeParticipants.sort((p1, p2) => {
                    if (p1['userId'] > p2['userId']) {
                        return 1;
                    }
                    if (p1['userId'] < p2['userId']) {
                        return -1;
                    }
                    return 0;
                });
                console.log(this.listeParticipants);

                this.listeParticipants.forEach((participant) => {
                    console.log(participant);
                    this.FetchUser(participant);
                });
            }, error => console.error(error));
        }, error => console.error(error));
    }

    setSubTitle() {
        this.service.get(window.location.origin + "/api/Opinions/election/" + this.electionId).subscribe(result => {
            let opinion: Opinion[] = result as Opinion[];
            console.log(opinion);

            opinion.sort((l1, l2) => {
                if (l1['dateOpinion'] > l2['dateOpinion']) {
                    return -1;
                }
                if (l1['dateOpinion'] < l2['dateOpinion']) {
                    return 1;
                }
                return 0;
            });

            console.log(opinion);


            console.log(opinion[0]["concernedId"]);

            this.service.get(window.location.origin + "/api/Users/" + opinion[0]["concernedId"]).subscribe(result => {
                console.log(result['firstName'] + ' ' + result['lastName']);
                document.getElementById("sous-titre").innerText += ' ' + result['firstName'] + ' ' + result['lastName'];
            }, error => console.error(error));

        }, error => console.error(error));
    }

    async FetchUser(participant: Participant) {
        await this.service.get(window.location.origin + "/api/Users/" + participant['userId']).subscribe(userResult => {
            let user: Users = userResult as Users;
            this.listeUsers.push(userResult as Users);
            console.log(this.listeUsers);
        }, error => console.error(error));
    }

    HasUserTalked(user: Users): boolean {
        let participant: Participant = this.listeParticipants.find(p => p['userId'] == user['userId']);

        return participant['hasTalked'];
    }

    actualParticipant(user: Users, birthDate: string) {
        document.getElementById("selectParticipant").style.visibility = "visible";

        this.ageCalculation(birthDate);
        this.currentUser = user;
    }

    private ageCalculation(birthDate: string) {
        const currentDate: Date = new Date();
        const BirthDate: Date = new Date(birthDate);

        var Age: number = currentDate.getFullYear() - BirthDate.getFullYear() - 1;

        if (currentDate.getMonth() > BirthDate.getMonth()) {
            Age++;
        }
        else if (currentDate.getMonth() == BirthDate.getMonth()) {
            if (currentDate.getDate() >= BirthDate.getDate()) {
                Age++;
            }
        }

        this.age = Age;
    }

    changeColor(userId: number) {

        Array.from(document.getElementsByClassName("participantIcon")).forEach((participant) => {
            let el = participant as HTMLElement;
            el.style.borderColor = "black";
            el.style.borderWidth = "3px";
        });

        document.getElementById(("userId") + userId.toString()).style.borderColor = "#640a60";
        document.getElementById(("userId") + userId.toString()).style.borderWidth = "5px";
    }

    Revote() {
        //génération d'une opinion Vote (id du type : 3 = opinion de type revote)
        this.service.get(window.location.origin + "/api/TypeOpinions/3").subscribe(result => {
            this.type = result as TypeOpinion;
            this.service.post(window.location.origin + "/api/Opinions", {
                'AuthorId': this.connectedAccount["userId"],
                'ConcernedId': this.currentUser["userId"],
                'Reason': (<HTMLInputElement>document.getElementById("argumentaires")).value,
                'TypeId': this.type["typeId"],
                'DateOpinion': new Date(),
                'ElectionId': this.election['electionId']
            }).subscribe(result => {
            }, error => console.log(error));
        }, error => console.error(error));

        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId']).subscribe(result => {
            let participantResult: Participant = result as Participant;
            this.service.put<Participant>(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.election['electionId'], {
                'UserId': participantResult['userId'],
                'ElectionId': participantResult['electionId'],
                'HasTalked': true
            }).subscribe(result => {
            }, error => console.log(error));
        }, error => console.log(error));
        this.navBarStateService.SetLogsVisible(true);

        this.service.get(window.location.origin + "/api/Participants/" + this.currentUser['userId'] + "/" + this.election['electionId']).subscribe(result => {
            let participantResult: Participant = result as Participant;
            this.service.put(window.location.origin + "/api/Participants/" + participantResult['userId'] + "/" + this.election['electionId'], {
                "UserId": participantResult["userId"],
                "ElectionId": this.election['electionId'],
                "HasTalked": participantResult['hasTalked'],
                "Proposable": true
            }).subscribe(result => {

            }, error => console.log(error));
        }, error => console.log(error));
    }

    Exclude(currentUserId: number) {
        this.service.delete(window.location.origin + "/api/Participants/" + currentUserId + "/" + this.election['electionId']).subscribe(result => {
        }, error => console.log(error));
    }

    goToNextPhase() {
        this.service.get(window.location.origin + "/api/Participants/election/" + this.election['electionId']).subscribe(participantResult => {
            this.listeParticipants = participantResult as Participant[];
            for (let i in this.listeParticipants) {
                this.service.put(window.location.origin + "/api/Participants/" + this.listeParticipants[i]['userId'] + "/" + this.election['electionId'], {
                    "UserId": this.listeParticipants[i]['userId'],
                    "ElectionId": this.election['electionId'],
                    "HasTalked": false,
                    "Proposable": this.listeParticipants[i]['proposable']
                }).subscribe(result => {

                }, error => console.log(error));
            }

            this.router.navigate(['objections/' + this.election['electionId']]);
        }, error => console.error(error));
    }
}