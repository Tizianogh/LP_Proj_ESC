import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../Model/Users';
import { BehaviorSubject } from 'rxjs';
import { Election } from '../Model/Election';
import { Participant } from '../Model/Participant';
import { Phase } from '../Model/Phase';


@Injectable({
    providedIn: 'root'
})

export class ElectionService {

    private election: BehaviorSubject<Election>;
    private electionO: Election;
    private participants: Participant[];
    private participantList: BehaviorSubject<Participant[]>;
    private users: Users[];
    private userList: BehaviorSubject<Users[]>;


    constructor(private service: HttpClient, private router: Router) {
        this.election = new BehaviorSubject(new Election());
        this.participantList = <BehaviorSubject<Participant[]>>new BehaviorSubject([]);
        this.userList = <BehaviorSubject<Users[]>>new BehaviorSubject([]);


        if (localStorage.getItem('participantList') != null)
            this.SetParticipantList(JSON.parse(localStorage.getItem('participantList')));
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

    async fetchElection(electionId: string) {
        await this.service.get(window.location.origin + "/api/Elections/" + electionId).subscribe(result => {
            this.electionO = result as Election;
            this.SetElection(this.electionO);
            this.fetchParticipants(electionId);
        }, error => console.error(error));
    }

    async fetchParticipants(electionId:string) {
        this.ClearParticipantList();
        //récupérer la liste des participants en fonction de l'id d'une élection
        await this.service.get(window.location.origin + "/api/Participants/election/" + electionId).subscribe(participantResult => {
            this.participants = participantResult as Participant[];
            this.participants.forEach((participant) => {
                this.AddParticipant(participant);
                this.fetchUser(participant);
            });
        }, error => console.error(error));
    }

    async fetchUser(participant: Participant) {
        this.ClearUserList();
        //Récupérer un utilisateur en fonction d'un participant d'une élection passé en paramètred
        await this.service.get(window.location.origin + "/api/Users/" + participant['userId']).subscribe(userResult => {
            let user: Users = userResult as Users;
            this.AddUser(user);
        }, error => console.error(error));
    }
}