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
        this.connectedAccount = new BehaviorSubject(new Users());

        if (localStorage.getItem('connectedUser') != null) {
            this.setConnected(true);
            let aGUID = JSON.parse(localStorage.getItem('connectedUser'));
            
            this.httpRequest.getUserByGUID(aGUID).then(
                anUser => {
                    this.setConnectedAccount(anUser as Users);
                    
                }, error => {
                    console.log(error)
                }
            );
        }
    }

    //vérifier que l'utilisateur est bien connecté à un compte, sinon l'envoyer sur la page d'accueil
    connectedUserVerification() {

        if (this.connected.value==false) {
          
            this.router.navigate(['home/']);
            alert("Vous devez être connecté pour rejoindre l'élection.");
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
                    let aGUID = result['authUser'];
                    localStorage.setItem('connectedUser', JSON.stringify(aGUID));
                    this.setConnectedAccount(result as Users);
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