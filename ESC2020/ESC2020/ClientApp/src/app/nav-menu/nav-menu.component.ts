import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Users } from '../Model/Users';
import { AuthentificationService } from '../services/authentification.service';
import { NavBarStateService } from '../services/NavBarState.service';

import { TranslateService } from '@ngx-translate/core';


@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent {
    public connected: boolean;
    private connectedAccount: Users;
    public navBarState: string;

    private logsVisible: boolean;
    public inElection: boolean;

    constructor(private translate: TranslateService, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService, private router: Router) {
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang);
    }

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
