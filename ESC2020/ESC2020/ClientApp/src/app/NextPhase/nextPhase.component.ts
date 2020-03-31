import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Session } from '../Model/Session';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';

@Component({
    selector: 'app-nextPhase',
    templateUrl: './nextPhase.component.html',
    styleUrls: ['./nextPhase.component.css']
})

export class NextPhaseComponent implements OnInit {
    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }


}