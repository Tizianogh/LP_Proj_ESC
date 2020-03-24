import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../Model/Users';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
  erreur = "";
  private listeUsers: Users[] = [];
  connected = false;
  connectedAccount = null;

  constructor(private service: HttpClient, private router: Router) { }

  connect(email: string, password: string) {
    console.log(email, password);
    if (email.trim() == "" || password.trim() == "") {
      this.erreur = "*Tous les champs doivent être remplis";
    }
    else {
      this.service.get(window.location.origin + "/api/Users").subscribe(result => {
        this.listeUsers = result as Users[];
        console.log(this.listeUsers);
      }, error => console.error(error));

      if (this.listeUsers.find(user => user.UserId === email)) {
        let anUser: Users = this.listeUsers.find(user => user.UserId === email);
        if (anUser.Password === password) {
          this.connected = true;
          this.connectedAccount = anUser;
          console.log("Connected");
          this.router.navigate(['']);
        }
        else {
          console.log("Wrong password");
        }
      }
      else {
        console.log("Cannot find username");
      }
    }
  }

  disconnect() {
    this.connected = false;
    this.connectedAccount = null;
  }
}
