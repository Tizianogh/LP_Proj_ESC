import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../Model/Users';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  private connected: BehaviorSubject<boolean>;
  private connectedAccount: BehaviorSubject<Users>;
  private emptyUsers: Users;
  erreur = "";

  constructor(private service: HttpClient, private router: Router) {
    this.connected = new BehaviorSubject(false);

        this.emptyUsers = {
            UserId: null, Email: "", Password: "", Salt: "", BirthDate: "", Description: "", FirstName: "", LastName: "", Job: "", Avatar: null //new Blob()
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
      this.erreur = "*Tous les champs doivent être remplis";
    }
    else {
      const params = new HttpParams()
        .set('mail', email)
        .set('password', password);
      this.service.get(window.location.origin + "/api/Authentifcation", {params}).subscribe(result => {
       //this.setConnectedAccount({ UserId: result['userId'], Email: result['email'], Password: result['password'], Salt: result['salt'], BirthDate: result['birthDate'], Description: result['description'], FirstName: result['firstName'], LastName: result['lastName'], Job: result['job'] });

       this.setConnected(true);

       localStorage.setItem('connectedUser', JSON.stringify(result));
       this.setConnectedAccount(JSON.parse(localStorage.getItem('connectedUser')));

       this.router.navigate(['']);
      }, error => console.log("Wrong password"));
    }
  }

  disconnect() {
    this.setConnected(false);
    this.setConnectedAccount(this.emptyUsers);
    localStorage.removeItem('connectedUser');
  }
}