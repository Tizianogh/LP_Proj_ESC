import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Users } from '../Model/Users';
import { AuthentificationService } from '../services/authentification.service';

@Component({
    selector: 'app-creation',
    templateUrl: './create-election.component.html',
    styleUrls: ['./create-election.component.css'],
    providers: [DatePipe]
})

export class CreateElectionComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users;

    formulaireElection: FormGroup;
    id: number = 5;
    erreur: string;

    constructor(private formbuilder: FormBuilder, private service: HttpClient, private router: Router, private datePipe: DatePipe, private authentificationService: AuthentificationService) { }

    ngOnInit() {
        this.initForm();
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
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
        console.log(window.location.origin)

        if (form['poste'].trim() == "" || form['missions'].trim() == "" || form['responsabilites'].trim() == "" || form['dateD'].trim() == "" || form['dateF'].trim() == "") {
            this.erreur = "*Tous les champs doivent être remplis";
        }
        else {
            if (this.verifDates(form['dateD'], form['dateF'])) {
                this.service.post(window.location.origin + "/api/Elections", {
                    "Job": form['poste'],
                    "Mission": form['missions'],
                    "Responsability": form['responsabilites'],
                    "StartDate": form['dateD'],
                    "EndDate": form['dateF'],
                    "CodeElection": this.generateCode(),
                    "HostId": this.connectedAccount["userId"],
                    "ElectedId":null
                }).subscribe(result => {
                    this.id = result['electionId'];
                    this.linkUsersElection(this.connectedAccount["userId"],this.id);
                    this.router.navigate(['election-reminder/' + this.id]);
                }, error => this.submit());
            }
            else {
                this.erreur = "*Les dates sont incorrectes";
            }
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
        if (dateUne.getTime() > dateDeux.getTime() || dateUne.getTime() < myDate.getTime()) {
            res = true;
        }
        return res;
    }
}

class Election {
    constructor(public poste: string, public missions: string, public responsabilite: string, public dateD: string, public dateF: string) { }


}
