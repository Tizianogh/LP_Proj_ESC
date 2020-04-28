import { Component, OnInit } from '@angular/core';
import { Log } from '../Model/Log';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { Users } from '../Model/Users';
import { NavBarStateService } from '../services/NavBarState.service';
import { AuthentificationService } from '../services/authentification.service';
import { HTTPRequestService } from '../services/HTTPRequest.service';


@Component({
    selector: 'app-logs',
    templateUrl: './logs.component.html',
    styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
    private allListOpinion: Log[] = [];
    private allListNotifs: Log[] = [];

    public logsVisible: boolean;

    public logList: Log[] = [];

    constructor(private httpRequest: HTTPRequestService, private location: Location, private navBarStateService: NavBarStateService, private router: Router) { }

    ngOnInit() {
        this.navBarStateService.GetLogsVisible().subscribe(isVisible => this.logsVisible = isVisible);

        this.getNotifications();
        this.getLogs();
    }

    logPush(title: string, opinion: string, hour: string, type: number) {
        let customLog = new Log();
        customLog.title = title;
        customLog.opinion = opinion;
        customLog.hour = hour;
        customLog.type = type;

        this.logList.push(customLog);
        this.sort(this.logList);
    }
   
    sort(array: Log[]) {
        array.sort((l1, l2) => {
            if (l1.hour > l2.hour)
                return -1;
            if (l1.hour < l2.hour)
                return 1;
            return 0;
        });
    }

    browserReturn() {
        this.location.back();
    }

    getNotifications() {
        this.httpRequest.getNotifications(Number(this.router.url.split('/')[2])).then(
            notificationsData => {
                this.allListNotifs = notificationsData as Log[];
                for (let i in this.allListNotifs) {
                    let datePubli: string = this.allListNotifs[i]['dateNotification'];
                    this.logPush(this.allListNotifs[i]['message'], "",
                        new Date(datePubli).toLocaleDateString() + " " + new Date(datePubli).toLocaleTimeString().substring(0, 8), 4);
                }
            }, error => console.error(error)
        );
    }

    getLogs() {
        this.httpRequest.getOpinions(Number(this.router.url.split('/')[2])).then(
            opinionsData => {
                this.allListOpinion = opinionsData as Log[];

                for (let i in this.allListOpinion) {
                    if (this.allListOpinion[i]['typeId'] == 1) {
                        //vote
                        this.httpRequest.getUserById(this.allListOpinion[i]['authorId']).then(
                            votingUserData => {
                                let voting = votingUserData as Users;
                                this.httpRequest.getUserById(this.allListOpinion[i]['concernedId']).then(
                                    votedUserData => {
                                        let voted = votedUserData as Users;
                                        let datePubli: string = this.allListOpinion[i]['dateOpinion'];
                                        this.logPush(voting["firstName"] + " " + voting["lastName"] + " a voté pour " + voted["firstName"] + " " + voted["lastName"],
                                            this.allListOpinion[i]['reason'], new Date(datePubli).toLocaleDateString() + " " + new Date(datePubli).toLocaleTimeString().substring(0, 8), 1);
                                    }, error => console.error(error)
                                );
                            }, error => console.error(error)
                        );
                    }
                    else if (this.allListOpinion[i]['typeId'] == 2) {
                        //revote
                        this.httpRequest.getUserById(this.allListOpinion[i]['authorId']).then(
                            votingUserData => {
                                let voting = votingUserData as Users;
                                this.httpRequest.getUserById(this.allListOpinion[i]['concernedId']).then(
                                    votedUserData => {
                                        let voted = votedUserData as Users;
                                        let datePubli: string = this.allListOpinion[i]['dateOpinion'];
                                        this.logPush(voting["firstName"] + " " + voting["lastName"] + " a modifié son vote afin de voter pour " + voted["firstName"] + " " + voted["lastName"],
                                            this.allListOpinion[i]['reason'], new Date(datePubli).toLocaleDateString() + " " + new Date(datePubli).toLocaleTimeString().substring(0, 8), 2);
                                    }, error => console.error(error)
                                );
                            }, error => console.error(error)
                        );
                    }
                    else if (this.allListOpinion[i]['typeId'] == 3) {
                        //objection
                        this.httpRequest.getUserById(this.allListOpinion[i]['authorId']).then(
                            objectingUserData => {
                                let objecting = objectingUserData as Users;
                                this.httpRequest.getUserById(this.allListOpinion[i]['concernedId']).then(
                                    objectedUserData => {
                                        let objected = objectedUserData as Users;
                                        let datePubli: string = this.allListOpinion[i]['dateOpinion'];
                                        this.logPush(objecting["firstName"] + " " + objecting["lastName"] + " a émis une objection sur l'élection de " + objected["firstName"] + " " + objected["lastName"],
                                            this.allListOpinion[i]['reason'], new Date(datePubli).toLocaleDateString() + " " + new Date(datePubli).toLocaleTimeString().substring(0, 8), 3);
                                    }, error => console.error(error)
                                );
                            }, error => console.error(error)
                        );
                    }
                }
            }, error => console.error(error)
        );
    }
}
