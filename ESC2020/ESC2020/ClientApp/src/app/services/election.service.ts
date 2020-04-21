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


@Injectable({
    providedIn: 'root'
})

export class ElectionService {

    private electionValue: Election;
    private election: BehaviorSubject<Election>;
    private electionO: Election;
    private participants: Participant[];
    private participantList: BehaviorSubject<Participant[]>;
    private users: Users[];
    private userList: BehaviorSubject<Users[]>;


    constructor(private service: HttpClient, private navBarStateService: NavBarStateService, private router: Router) {
        this.election = new BehaviorSubject(new Election());
        this.participantList = <BehaviorSubject<Participant[]>>new BehaviorSubject([]);
        this.userList = <BehaviorSubject<Users[]>>new BehaviorSubject([]);
    }

    fetchElection(electionId: string) {
        //Récupérer l'id de l'élection actuelle à partir de l'url
        this.service.get(window.location.origin + "/api/Elections/" + electionId).subscribe(result => {
            this.electionValue = result as Election;
            this.SetElection(this.electionValue);
            this.fetchParticipants(electionId);
        }, error => console.error(error));
    }

    async fetchParticipants(electionId: string) {
        this.ClearParticipantList();
        this.ClearUserList();
        //récupérer la liste des participants en fonction de l'id d'une élection
        await this.service.get(window.location.origin + "/api/Participants/election/" + electionId).subscribe(participantResult => {
            this.participants = participantResult as Participant[];
            this.participants.forEach((participant) => {
                //this.navBarStateService.SetLogsVisible(this.participants.find(p => p['userId'] == this.connectedAccount['userId'])['hasTalked']);
                this.AddParticipant(participant);
                this.fetchUser(participant);
            });
        }, error => console.error(error));
    }

    async fetchUser(participant: Participant) {
        //Récupérer un utilisateur en fonction d'un participant d'une élection passé en paramètred
        await this.service.get(window.location.origin + "/api/Users/" + participant['userId']).subscribe(userResult => {
            let user: Users = userResult as Users;
            this.AddUser(user);
        }, error => console.error(error));
        this.participants.sort((u1, u2) => {
            if (u1['userId'] > u2['userId'])
                return -1;
            if (u1['userId'] < u2['userId'])
                return 1;
            return 0;
        });
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