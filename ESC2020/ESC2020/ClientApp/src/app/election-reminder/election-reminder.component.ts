import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { NavBarStateService } from '../services/NavBarState.service';

@Component({
    selector: 'app-rappel',
    templateUrl: './election-reminder.component.html',
    styleUrls: ['./election-reminder.component.css']
})
export class ElectionReminderComponent implements OnInit {

    constructor(private navBarStateService: NavBarStateService, private service: HttpClient, private router: Router) { }

    poste: string;
    missions: string;
    responsabilite: string;
    dateD: string;
    dateF: string;
    codeElection: string;

    ngOnInit() {
        this.navBarStateService.SetIsInElection(false);

        this.service.get(window.location.origin + "/api/Elections/" + this.router.url.split('/')[2]).subscribe(result => {
            this.poste = result['job'];
            this.missions = result['mission'];
            this.responsabilite = result['responsability'];
            this.dateD = result['startDate'];
            this.dateF = result['endDate'];
            this.codeElection = result['codeElection'];
        }, error => console.error(error));
    }
}
