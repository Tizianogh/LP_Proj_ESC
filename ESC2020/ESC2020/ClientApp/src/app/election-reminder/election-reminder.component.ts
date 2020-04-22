import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavBarStateService } from '../services/NavBarState.service';
import { HTTPRequestService } from '../services/HTTPRequest.service';

@Component({
    selector: 'app-rappel',
    templateUrl: './election-reminder.component.html',
    styleUrls: ['./election-reminder.component.css']
})
export class ElectionReminderComponent implements OnInit {


    constructor(private navBarStateService: NavBarStateService, private service: HttpClient, private router: Router, private httpRequest: HTTPRequestService) { }

    electionId: string;
    poste: string;
    missions: string;
    responsabilite: string;
    dateD: string;
    dateF: string;
    codeElection: string;

    ngOnInit() {
        this.navBarStateService.SetIsInElection(false);
        this.electionId = this.router.url.split('/')[2];
        this.getElection();
    }

    getElection() {

        this.httpRequest.getElectionById(Number(this.electionId)).then(
            election => { // resolve() 
                console.log("le result");
                console.log(election)
                this.electionId = election['electionId'];
                this.poste = election['job'];
                this.missions = election['mission'];
                this.responsabilite = election['responsability'];
                this.dateD = election['startDate'];
                this.dateF = election['endDate'];
                this.codeElection = election['codeElection'];
            }, error => {//Reject
                console.log(error)
            }
        );
    }

    navigate() {
        this.router.navigate(['election/' + this.electionId]);
    }
}
