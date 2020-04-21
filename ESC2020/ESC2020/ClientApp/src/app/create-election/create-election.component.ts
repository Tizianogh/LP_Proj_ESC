import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Users } from '../Model/Users';
import { Election } from '../Model/Election';
import { AuthentificationService } from '../services/authentification.service';
import { HTTPRequestService } from '../services/HTTPRequest.service';
import { Phase } from '../Model/Phase';
import { NavBarStateService } from '../services/NavBarState.service';

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
    id: number = 5;
    erreur: string;

    constructor(private httpRequest: HTTPRequestService, private navBarStateService: NavBarStateService, private formbuilder: FormBuilder, private service: HttpClient, private router: Router, private datePipe: DatePipe, private authentificationService: AuthentificationService) {
    }

    ngOnInit() {
        this.initForm();
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        let date: Date = new Date();
        let currentDate: Date = new Date();
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

                let newElection: Election =  {
                    poste: form['poste'],
                    missions: form['missions'],
                    responsabilite: form['responsabilites'],
                    dateD: form['dateD'],
                    dateF: form['dateF']
                };

                let anElection = this.httpRequest.createElection(newElection, this.connectedAccount, this.generateCode()));
                console.log(anElection);

                //console.log(election);
                //LA 
                //  |
                //  |
                //  v
                //.then(successCallback, failureCallback)  // <-----
                //  ^
                //  |
                //  |

                /*
                this.id = newElection['electionId'];
                this.linkUsersElection(this.connectedAccount["userId"], this.id);
                this.router.navigate(['election-reminder/' + this.id]);

                this.service.post(window.location.origin + "/api/Notifications", {
                    "Message": "Début de l'élection pour le poste de " + form['poste'] + '.',
                    "DateNotification": new Date(),
                    "ElectionId": result['electionId']
                }).subscribe(result => {
                }, error => this.submit());*/
            }
            else
                this.erreur = "*Les dates sont incorrectes";
        }

    }

    linkUsersElection(aUserId, aElectionId) {
        this.service.post(window.location.origin + "/api/Participants", { 'UserId': aUserId, 'ElectionId': aElectionId }).subscribe(result => {
            console.log(result);
        }, error => console.log(error));
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
