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
        //throw new Error("Method not implemented.");
    }

    /*
     Seul l'hôte doit pouvoir passer à la phase suivante, je suggère qu'avec un ngIF on affiche ce bouton que si le participant est bien l'hôte
     */
    goToNextPhase() {
        console.log("Phase suivante");
        //quand on appuie sur le bouton, mettre tous les champs de Participant dans la BDD "hasTalked" à false pour la prochaine phase
        //sauf si la phase actuelle n'est pas Célébration
            //changer l'id de la phase
            //sinon il faudrait faire en sorte que le bouton ne soit pas visible
    }


}