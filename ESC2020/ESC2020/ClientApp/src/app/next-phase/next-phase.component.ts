import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-nextPhase',
    templateUrl: './next-phase.component.html',
    styleUrls: ['./next-phase.component.css']
})

export class NextPhaseComponent implements OnInit {
    ngOnInit(): void {
        //throw new Error("Method not implemented.");
    }

    /*
     Seul l'hôte doit pouvoir passer à la phase suivante, je suggère qu'avec un ngIF on affiche ce bouton que si le participant est bien l'hôte
     */
    goToNextPhase() {
        
        //quand on appuie sur le bouton, mettre tous les champs de Participant dans la BDD "hasTalked" à false pour la prochaine phase
        //sauf si la phase actuelle n'est pas Célébration
            //changer l'id de la phase
            //sinon il faudrait faire en sorte que le bouton ne soit pas visible
    }


}