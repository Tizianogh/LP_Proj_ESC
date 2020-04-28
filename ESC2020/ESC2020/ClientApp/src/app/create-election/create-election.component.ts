import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Users } from '../Model/Users';
import { Election } from '../Model/Election';
import { AuthentificationService } from '../services/authentification.service';
import { HTTPRequestService } from '../services/HTTPRequest.service';
import { NavBarStateService } from '../services/NavBarState.service';
import { Participant } from '../Model/Participant';
import { Notification } from '../Model/Notification';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-create-election',
    templateUrl: './create-election.component.html',
    styleUrls: ['./create-election.component.css'],
    providers: [DatePipe]
})

export class CreateElectionComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users;

    currentDate: string;

    formulaireElection: FormGroup;
    erreur: string;

    constructor(private translate: TranslateService, private httpRequest: HTTPRequestService, private navBarStateService: NavBarStateService, private formbuilder: FormBuilder, private router: Router, private datePipe: DatePipe, private authentificationService: AuthentificationService) {
        const browserLang = translate.getBrowserLang();
        translate.use(browserLang);
    }

    ngOnInit() {
        this.initForm();
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        let date: Date = new Date();
        this.currentDate = date.toLocaleDateString()
        this.navBarStateService.SetIsInElection(false);
    }

    initForm() {
        this.formulaireElection = this.formbuilder.group({
            poste: '',
            missions: '',
            responsabilites: '',
            dateD: '',
            dateF: '',
        });
    }

    generateCode() {
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var stringLength = 5;

        function pickRandom() {
            return possible[Math.floor(Math.random() * possible.length)];
        }
        var randomString = Array.apply(null, Array(stringLength)).map(pickRandom).join('');
        return randomString;
    }

    submit() {
        const form = this.formulaireElection.value

        if (form['poste'].trim() == "" || form['missions'].trim() == "" || form['responsabilites'].trim() == "" || form['dateD'].trim() == "" || form['dateF'].trim() == "")
            this.erreur = "*Tous les champs doivent être remplis";
        else {
            if (this.verifDates(form['dateD'], form['dateF'])) {



                let newElection: Election = {
                    job: form['poste'],
                    mission: form['missions'],
                    responsability: form['responsabilites'],
                    startDate: form['dateD'],
                    endDate: form['dateF'],
                    codeElection: this.generateCode(),
                    hostElection: this.connectedAccount,
                    electedElection: null,
                };
                 
                this.httpRequest.createElection(newElection).then(
                    election => { // resolve() 

                        let newNotification: Notification = {
                            message: "Début de l'élection pour le poste de " + election['job'] + '.',
                            date: new Date(),
                            election: election as Election
                        };

                        this.httpRequest.createNotification(newNotification).then(
                            () => { //resolve()
                                this.linkUsersElection(this.connectedAccount, election as Election);
                                this.router.navigate(['election-reminder/' + election['electionId']]);
                            }, error => {console.log(error)}
                        );
                    }, error => {console.log(error)}
                ); 
            }
            else
                this.erreur = "*Les dates sont incorrectes";
        }
    }

    linkUsersElection(user: Users, election: Election) {
        let participant: Participant = { user: user, election: election, voteCounter: 0, hasTalked: false }
        this.httpRequest.createParticipant(participant)
    }

    verifDates(date1: string, date2: string) {
        let res: boolean = true;
        let dateUne = new Date(date1);
        let dateDeux = new Date(date2);
        let myDate = new Date();
        this.datePipe.transform(myDate, 'yyyy-MM-dd');
        if (dateUne.getTime() > dateDeux.getTime() || dateUne.getTime() < myDate.getTime())
            res = true;
        return res;
    }
}
