import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users, AuthentificationService } from '../services/authentification.service';


@Component({
    selector: 'app-accountPage',
    templateUrl: './myAccountPage.component.html',
    styleUrls: ['./myAccountPage.component.css']
})
export class MyAccountPageComponent implements OnInit {
    erreur = "";
    private listeUsers: Users[] = [];
    private connected: boolean;
    private connectedAccount: Users;
    private age: number;

    constructor(private authentificationService: AuthentificationService) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
    }

    scroll(el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}