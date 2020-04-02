import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../Model/Users';
import { AuthentificationService } from '../services/authentification.service';
import { NavBarStateService } from '../services/NavBarState.service';



@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
    private connected: boolean;
    private connectedAccount: Users;
    private navBarState: string;

    private logsVisible: boolean;
    private inElection: boolean;

    constructor(private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService, private router: Router) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        this.navBarStateService.GetNavState().subscribe(state => this.navBarState = state);
        this.navBarStateService.GetLogsVisible().subscribe(isVisible => this.logsVisible = isVisible);
        this.navBarStateService.GetIsInElection().subscribe(inElection => this.inElection = inElection);

    }

    connect(email: string, password: string) {
        this.authentificationService.connect(email, password);
    }

    disconnect() {
        this.authentificationService.disconnect();
    }

    goToLogs() {
        this.router.navigate(["logs/" + this.router.url.split('/')[2]]);
    }
}
