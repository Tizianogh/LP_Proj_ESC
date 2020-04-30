import { Component } from '@angular/core';
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
    public connectedAccount: Users;
    public navBarState: string;

    public logsVisible: boolean;
    public currentLang: string ;
    public inElection: boolean;

    constructor(private translate: TranslateService, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService, private router: Router) {
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang);
        this.currentLang = browserLang.toString();
    }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        this.navBarStateService.GetNavState().subscribe(state => this.navBarState = state);
        this.navBarStateService.GetLogsVisible().subscribe(isVisible => this.logsVisible = isVisible);
        this.navBarStateService.GetIsInElection().subscribe(inElection => this.inElection = inElection);

    }


    setFr() {
        this.translate.use("fr").subscribe(result => {
            this.currentLang = this.translate.currentLang;
        });
    }

    setEn() {
        this.translate.use("en").subscribe(result => {
            this.currentLang = this.translate.currentLang;
        });
        
    }

    setEs() {
        this.translate.use("es").subscribe(result => {
            this.currentLang = this.translate.currentLang;
        });
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
