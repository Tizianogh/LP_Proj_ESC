import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../Model/Users';
import { BehaviorSubject } from 'rxjs';
import { Election } from '../Model/Election';
import { Participant } from '../Model/Participant';
import { Phase } from '../Model/Phase';
import { NavBarStateService } from './NavBarState.service';
import { isUndefined } from 'util';
import { HTTPRequestService } from '../services/HTTPRequest.service';


@Injectable({
    providedIn: 'root'
})

export class ElectionService {

    private election: BehaviorSubject<Election>;
    private participants: Participant[];
    private participantList: BehaviorSubject<Participant[]>;
    private users: Users[];
    private userList: BehaviorSubject<Users[]>;


    constructor(private httpRequest: HTTPRequestService, private service: HttpClient, private navBarStateService: NavBarStateService, private router: Router) {
        this.election = new BehaviorSubject( new Election());
        this.participantList = <BehaviorSubject<Participant[]>>new BehaviorSubject([]);
        this.userList = <BehaviorSubject<Users[]>>new BehaviorSubject([]);
    }
    //vérifier que l'utilisateur a été invité à rejoindre
    async acceptedParticipantVerification(user: Users, electionId : string) {
        await this.service.get(window.location.origin + "/api/Participants/election/" + electionId).subscribe(participantResult => {
            this.participants = participantResult as Participant[];
            //ici on devrait avoir récupéré la liste des participants
            let findedParticipant = false;
            for (let participant of this.participants) {
                if (participant['userId'] == user['userId']) {
                    console.log("cc");
                    findedParticipant = true;
                }
            }
       
            if (!findedParticipant) {
                alert("Vous n'avez pas été invité à rejoindre cette élection depuis ce compte.");
                this.router.navigate(['home/']);
            }
            
        }, error => console.error(error));
    }

    fetchElection(electionId: string) {
        return new Promise((resolve, reject) => {
            this.ClearParticipantList();
            this.ClearUserList();

            //Récupérer l'id de l'élection actuelle à partir de l'url
            this.httpRequest.getElectionById(Number(electionId)).then(
                electionData => {
                    this.SetElection(electionData as Election);
                    this.fetchParticipants(electionData as Election);
                    resolve(electionData as Election);
                }, error => { console.log(error); }
            );
        });
    }

    async fetchParticipants(election: Election) {
        this.ClearParticipantList();
        this.ClearUserList();

        //récupérer la liste des participants en fonction de l'id d'une élection
        this.httpRequest.getParticipantsByElection(election).then(
            participantsResult => {
                this.participants = participantsResult as Participant[]
                this.participants.forEach((participant) => {
                    this.AddParticipant(participant);
                    this.fetchUser(participant);
                });
            },error => { console.log(error); }
        );
    }

    async fetchUser(participant: Participant) {
        //Récupérer un utilisateur en fonction d'un participant d'une élection passé en paramètre
        this.httpRequest.getUserById(participant['userId']).then(
            userData => {
                let user: Users = userData as Users;
                this.AddUser(user);
                this.participants.sort((u1, u2) => {
                    if (u1['userId'] > u2['userId'])
                        return -1;
                    if (u1['userId'] < u2['userId'])
                        return 1;
                    return 0;
                });
            }, error => {  console.log(error);}
        );
    }

    SetElection(newState: Election) {
        this.election.next(newState);
    }

    GetElection() {
        return this.election.asObservable();
    }

    AddParticipant(newEntry: Participant) {
        this.participants.push(newEntry);
        this.participantList.next(this.participants);
    }

    RemoveParticipant(removedEntry: Participant) {
        this.participants.splice(this.participants.findIndex(p => p['userId'] == removedEntry['userId']), 1);
        this.participantList.next(this.participants);
    }

    ClearParticipantList() {
        this.participants = [];
        this.participantList.next(this.participants);
    }

    SetParticipantList(newList: Participant[]) {
        this.participants = newList;
        this.participantList.next(this.participants);
    }

    GetParticipantList() {
        return this.participantList.asObservable();
    }

    GetParticipantListValue() {
        return this.participants;
    }

    AddUser(newEntry: Users) {
        this.users.push(newEntry);
        this.userList.next(this.users);
    }

    RemoveUser(removedEntry: Users) {
        this.users.splice(this.users.findIndex(p => p['userId'] == removedEntry['userId']), 1);
        this.userList.next(this.users);
    }

    ClearUserList() {
        this.users = [];
        this.userList.next(this.users);
    }

    SetUserList(newList: Users[]) {
        this.users = newList;
        this.userList.next(this.users);
    }

    GetUserList() {
        return this.userList.asObservable();
    }
}