import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../Model/Session';
import { Router } from '@angular/router';



@Component({
    selector: 'app-salons',
    templateUrl: './page-election.component.html',
    styleUrls: ['./page-election.component.css']
})

export class PageElectionComponent implements OnInit {

    session: Session;
    participantList: Participant[] = [];
    currentParticipant: Participant;

  constructor(private service: HttpClient, private router: Router) {}

    ngOnInit(): void {
      this.service.get(window.location.origin + "/api/Elections/" + this.router.url.split('/')[2]).subscribe(result => {
        this.session = result as Session;
          console.log(this.session);

          this.PushParticipant("Jean-Franck Tang", 42, "Professeur", "Bonjour");
          this.PushParticipant("Jean-Francky Tanguy", 24, "Enseignant", "Bonsoir");
          this.PushParticipant("Julien Dias", 27, "Chanteur", "Holà");
          this.PushParticipant("Cindy Mendes", 14, "Politicienne", "Hello");
          this.PushParticipant("Nicolas Kacem", 47, "Pilote", "Au revoir");
          this.PushParticipant("Rémi Cruzel", 22, "Intellectuel", "Bye");
          this.PushParticipant("Steven Le Moine", 44, "Normand", "Non");
          this.PushParticipant("Axel Gasnot", 11, "Scribe", "Neuf");
          this.PushParticipant("Clement Bisson", 28, "Architecte", "Yolo");
          this.PushParticipant("Tiziano Ghisotti", 50, "Pizzaïollo", "Grazzie");
          this.PushParticipant("Maxime Vong", 21, "Dresseur de chauve-souris", "Yes");

      }, error => console.error(error));
    }


    PushParticipant(name: string, age: number, job: string, description: string) {
        let participant = new Participant();
        participant.name = name;
        participant.age = age;
        participant.job = job;
        participant.description = description;
        this.participantList.push(participant);
    }

}

export class Participant {
    public name: string;
    public age: number;
    public job: string;
    public description: string;
}
