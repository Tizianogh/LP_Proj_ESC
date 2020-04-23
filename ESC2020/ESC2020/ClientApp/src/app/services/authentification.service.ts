import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../Model/Users';
import { BehaviorSubject } from 'rxjs';
import { HTTPRequestService } from '../services/HTTPRequest.service';

@Injectable({
    providedIn: 'root'
})

export class AuthentificationService {
    private connected: BehaviorSubject<boolean>;
    private connectedAccount: BehaviorSubject<Users>;
    private emptyUsers: Users;
    erreur = "";

    constructor(private httpRequest: HTTPRequestService, private service: HttpClient, private router: Router) {
        this.connected = new BehaviorSubject(false);

        this.emptyUsers = {
            userId: null, email: "", password: "", salt: "", birthDate: "", description: "", firstName: "", lastName: "", job: "", avatar: null //new Blob()
        };
        this.connectedAccount = new BehaviorSubject(this.emptyUsers);

        if (localStorage.getItem('connectedUser') != null) {
            this.setConnected(true);
            this.setConnectedAccount(JSON.parse(localStorage.getItem('connectedUser')));
        }
    }

    getConnected() {
        return this.connected.value;
    }
    getConnectedFeed() {
        return this.connected.asObservable();
    }

    getConnectedAccountFeed() {
        return this.connectedAccount.asObservable();
    }
    getConnectedAccount() {
        return this.connectedAccount.value;
    }

    setConnected(aBoolean: boolean) {
        this.connected.next(aBoolean);
    }

    setConnectedAccount(anUser: Users) {
        this.connectedAccount.next(anUser);
    }

    connect(email: string, password: string) {
        if (email.trim() == "" || password.trim() == "") {
            this.erreur = "Tous les champs doivent être remplis";
        }
        else {
            this.httpRequest.getUserByMailPassword(email, password).then(
                result => {
                    this.setConnected(true);

                    localStorage.setItem('connectedUser', JSON.stringify(result));
                    this.setConnectedAccount(JSON.parse(localStorage.getItem('connectedUser')));

                    this.router.navigate(['']);
                }, error => console.log(error)
            );
        }
    }

    disconnect() {
        this.setConnected(false);
        this.setConnectedAccount(this.emptyUsers);
        localStorage.removeItem('connectedUser');
    }
}