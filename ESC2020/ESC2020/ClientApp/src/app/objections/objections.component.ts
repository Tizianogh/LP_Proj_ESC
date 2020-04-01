import { Component, OnInit } from '@angular/core';
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



@Component({
    selector: 'app-election',
    templateUrl: './objections.component.html',
    styleUrls: ['./objections.component.css']
})

export class ObjectionsComponent implements OnInit {

    private electionId: string;
    currentUser: Users = new Users();
    session: Session = new Session();
    //currentParticipant: Participant;
    scrollingItems: number[] = [];
    actualClickedId: number = 1;
    participantsList: Participant[] = [];
    opinionsList: Opinion[] = [];
    propositions: Proposition[] = [];
    private usersList: Users[] = [];
    actualProposed: Users = new Users();
    connectedParticipant: Participant;
    objectionsList: Opinion[] = [];

    private connected: boolean;
    private connectedAccount: Users = new Users();
    private type: TypeOpinion = new TypeOpinion();
    host: boolean = false;
    displayObjectBtn: boolean = false;

    constructor(private service: HttpClient, private router: Router, private authentificationService: AuthentificationService) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId']).subscribe(result => {
            this.connectedParticipant = result as Participant;
            console.log(this.connectedParticipant);
        }, error => console.log(error));
    
        //Récupérer l'id de l'élection actuelle à partir de l'url
        let regexp: RegExp = /\d/;
        this.electionId = regexp.exec(this.router.url)[0];
        this.service.get(window.location.origin + "/api/Elections/" + this.electionId).subscribe(result => {
            this.session = result as Session;
            if (this.connectedAccount["userId"] == this.session['hostId']) {
                this.host = true;
            }
            else {
                this.host = false;
            }
            //récupérer la liste des participants en fonction de l'id d'une élection
            this.service.get(window.location.origin + "/api/Participants/election/" + this.session['electionId']).subscribe(participantResult => {
                this.participantsList = participantResult as Participant[]; 
                this.service.get(window.location.origin + "/api/Users/election/" + this.session['electionId']).subscribe(userResult => {

                    this.usersList = userResult as Users[];
                    //Recuperer toutes les opinions de cette election et comptabilisation des votes
                    this.service.get(window.location.origin + "/api/Opinions/election/" + this.electionId).subscribe(result => {
                        this.opinionsList = result as Opinion[];
                        for (let i in this.usersList) {
                            this.propositions.push(new Proposition(this.usersList[i]['userId'], 0));
                            for (let j in this.opinionsList) {
                                if (this.opinionsList[j]['typeId'] == 1) {
                                    if (this.opinionsList[j]['concernedId'] == this.usersList[i]['userId']) {
                                        this.propositions[i].VoteCounter++;
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
                

            }, error => console.error(error));
        }, error => console.error(error));

    }

    sortPropositions() {

        let tmp: Proposition[] = [];
        let copy = this.propositions.copyWithin(0, this.propositions.length);
        while(copy.length>0){
            let cpt = 0
            for(let i=0;i<copy.length;i++){
                if(copy[cpt].VoteCounter<copy[i].VoteCounter)
                    cpt=i;
            }
         tmp.push(copy[cpt]);
         copy.splice(cpt,1);
        }

    this.propositions = tmp;
    }

    actualParticipant(user: Users) {
        document.getElementById("selectParticipant").style.visibility = "visible";
        this.currentUser = user;
        console.log(this.currentUser);
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
                document.getElementById("argumentaires").nodeValue="";
            }, error => console.log(error));
        }, error => console.error(error));
    }

    endObjection() {
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId']).subscribe(result => {
            this.connectedParticipant = result as Participant;
            this.connectedParticipant.HasTalked = true;

            this.service.put<Participant>(window.location.origin + "/api/Participants", this.connectedParticipant).pipe();

        }, error => console.log(error));
    }

    getObjections() {
        this.objectionsList = [];
        this.service.get(window.location.origin + "/api/Opinions/election/" + this.session['electionId']).subscribe(result => {
            let tempObjectionsList = result as Opinion[];
            for (let i in tempObjectionsList) {
                if (tempObjectionsList[i]['typeId'] == 2 && tempObjectionsList[i]['concernedId'] == this.actualProposed['userId']) {
                    this.objectionsList.push(tempObjectionsList[i])
                }
            }
            this.service.put<Participant>(window.location.origin + "/api/Participants", this.connectedParticipant).pipe();

        }, error => console.log(error));
    }

    refuseObjection(anObjectionId: number) {
        document.getElementById("objection_" + anObjectionId).remove();
        console.log(document.getElementById("objection_" + anObjectionId));
        this.service.delete(window.location.origin + "/api/Opinions/" + anObjectionId).subscribe(result => {
            
        }, error => console.log(error));
    }
}

class Proposition {

    constructor(
        public UserId: number,
        public VoteCounter: number
    ) { }
}