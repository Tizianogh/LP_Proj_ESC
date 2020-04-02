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


@Component({
    selector: 'app-election',
    templateUrl: './objections.component.html',
    styleUrls: ['./objections.component.css']
})

export class ObjectionsComponent implements OnInit {

    connected: boolean;
    connectedAccount: Users = new Users();

    session: Session = new Session();
    actualProposed: Users = new Users();
    connectedParticipant: Participant = new Participant();
    type: TypeOpinion = new TypeOpinion();

    host: boolean = false;


    participantsList: Participant[] = [];
    opinionsList: Opinion[] = [];
    usersList: Users[] = [];
    objectionsList: Opinion[] = [];
    propositions: Proposition[] = [];

    constructor(private service: HttpClient, private router: Router, private authentificationService: AuthentificationService) {
        
    }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        setInterval(() => this.getObjections(), 5000); // solution temporaire avant SignalR

        this.mainRequest();
    }

    mainRequest() {
        //Récupérer l'id de l'élection actuelle à partir de l'url
        let regexp: RegExp = /\d/;
        let electionId = regexp.exec(this.router.url)[0];
        this.service.get(window.location.origin + "/api/Elections/" + electionId).subscribe(result => {
            this.session = result as Session;
            console.log(this.session)
            this.getConnectedParticipant();
            this.checkHost();
            this.preStart();
        }, error => console.error(error));
    }

    getConnectedParticipant() {
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.session['electionId']).subscribe(result => {
            this.connectedParticipant = result as Participant;
            console.log(this.connectedParticipant);
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
        //récupérer la liste des participants en fonction de l'id d'une élection
        this.service.get(window.location.origin + "/api/Participants/election/" + this.session['electionId']).subscribe(participantResult => {
            this.participantsList = participantResult as Participant[];
            this.startCounting();
        }, error => console.error(error));
    }

    startCounting() {
        this.service.get(window.location.origin + "/api/Users/election/" + this.session['electionId']).subscribe(userResult => {

            this.usersList = userResult as Users[];
            //Recuperer toutes les opinions de cette election et comptabilisation des votes
            this.service.get(window.location.origin + "/api/Opinions/election/" + this.session['electionId']).subscribe(result => {
                this.opinionsList = result as Opinion[];
                for (let i in this.usersList) {
                    if (this.getParticipant(this.usersList[i]['userId'])['proposable']) {
                        this.propositions.push(new Proposition(this.usersList[i]['userId'], 0));
                        for (let j in this.opinionsList) {
                            if (this.opinionsList[j]['typeId'] == 1) {
                                if (this.opinionsList[j]['concernedId'] == this.usersList[i]['userId']) {
                                    this.propositions[i].VoteCounter++;
                                }
                            }
                        }
                    }
                }

                //deroulement
                this.sortPropositions();
                console.log(this.propositions);
                for (let i in this.usersList) {
                    if (this.usersList[i]['userId'] == this.propositions[0].UserId) {
                        this.actualProposed = this.usersList[i];
                    }
                }
            });
        }, error => console.error(error));
    }

    getParticipant(userId: number) {
        for (let i in this.participantsList) {
            if (this.participantsList[i]['userId'] == userId) {
                return this.participantsList[i];
            }
        }
    }

    sortPropositions() {
        let tmp: Proposition[] = [];
        let copy = (<any>this.propositions).copyWithin(0, this.propositions.length);
        while (copy.length > 0) {
            let cpt = 0
            for (let i = 0; i < copy.length; i++) {
                if (copy[cpt].VoteCounter < copy[i].VoteCounter)
                    cpt = i;
            }
            tmp.push(copy[cpt]);
            copy.splice(cpt, 1);
        }
        this.propositions = tmp;
    }

    objection() {
        //génération d'une opinion Vote (id du type : 2 = opinion de type vote)
        this.service.get(window.location.origin + "/api/TypeOpinions/2").subscribe(result => {
            this.type = result as TypeOpinion;
            this.service.post(window.location.origin + "/api/Opinions", {
                'AuthorId': this.connectedAccount["userId"],
                'ConcernedId': this.actualProposed["userId"],
                'Reason': (<HTMLInputElement>document.getElementById("argumentaires")).value,
                'TypeId': this.type["typeId"],
                'Date': Date.now(),
                'ElectionId': this.session['electionId']
            }).subscribe(result => {
                (<HTMLInputElement>document.getElementById("argumentaires")).value = "";
            }, error => console.log(error));
        }, error => console.error(error));
    }

    endObjection() {
        this.connectedParticipant['hasTalked'] = true;
        this.service.put(window.location.origin + "/api/Participants/" + this.connectedParticipant['userId'] + "/" + this.session['electionId'], {
            "UserId": this.connectedParticipant['userId'],
            "ElectionId": this.session['electionId'],
            "HasTalked": true,
            "Proposable": this.connectedParticipant['proposable'],
        }).subscribe(result => {
        }, error => console.log(error));

    }

    getObjections() {
        this.service.get(window.location.origin + "/api/Opinions/election/" + this.session['electionId']).subscribe(result => {
            let tempObjectionsList: Opinion[] = result as Opinion[];
            for (let i in tempObjectionsList) {
                if (tempObjectionsList[i]['typeId'] == 2 && tempObjectionsList[i]['concernedId'] == this.actualProposed['userId'] && !this.alreadyInObjections(tempObjectionsList[i])) {
                    this.objectionsList.push(tempObjectionsList[i])
                }
            }

        }, error => console.log(error));
    }

    alreadyInObjections(objection: Opinion) {
        for (let i in this.objectionsList) {
            if (this.objectionsList[i]['opinionId'] == objection['opinionId']) {
                return true;
            }
        }
        return false;
    }

    validateObjection() {
        this.service.put(window.location.origin + "/api/Participants/" + this.actualProposed['userId'] + "/" + this.session['electionId'], {
            "UserId": this.actualProposed['userId'],
            "ElectionId": this.session['electionId'],
            "HasTalked": false,
            "Proposable": false,
        }).subscribe(result => {
            let tempObjectionsList: Opinion[] = result as Opinion[];
            for (let i in tempObjectionsList) {
                if (tempObjectionsList[i]['typeId'] == 2 && tempObjectionsList[i]['concernedId'] == this.actualProposed['userId'] && !this.alreadyInObjections(tempObjectionsList[i])) {
                    this.objectionsList.push(tempObjectionsList[i])
                }
            }

            this.updateParticipantForVote()


        }, error => console.log(error));

    }

    ngOnDestroy() {
        
    }

    updateParticipantForVote() {

        this.service.get(window.location.origin + "/api/Participants/election/" + this.session['electionId']).subscribe(participantResult => {
            this.participantsList = participantResult as Participant[];
            for (let i = 0; i < this.participantsList.length; i++) {
                this.service.put(window.location.origin + "/api/Participants/" + this.participantsList[i]['userId'] + "/" + this.session['electionId'], {
                    "UserId": this.participantsList[i]['userId'],
                    "ElectionId": this.session['electionId'],
                    "HasTalked": false,
                    "Proposable": this.participantsList[i]["proposable"]
                }).subscribe(result => {

                }, error => console.log(error));
            }
        }, error => console.error(error));
    }
}

class Proposition {
    constructor(
        public UserId: number,
        public VoteCounter: number
    ) { }
}