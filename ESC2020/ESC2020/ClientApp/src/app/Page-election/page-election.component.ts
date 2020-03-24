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
    scrollingItems: number[] = [];
    
        

    constructor(private service: HttpClient, private router: Router) {
        for (let i = 0; i < 5000; i++) {
            this.scrollingItems.push(i);
        }}

    ngOnInit(): void {
      this.service.get(window.location.origin + "/api/Elections/" + this.router.url.split('/')[2]).subscribe(result => {
        this.session = result as Session;
          console.log(this.session);

          this.pushParticipant("Jean-Franck Tang", 42, "Professeur", "Bonjour");
          this.pushParticipant("Jean-Francky Tanguy", 24, "Enseignant", "Bonsoir");
          this.pushParticipant("Julien Dias", 27, "Chanteur", "Holà");
          this.pushParticipant("Cindy Mendes", 14, "Politicienne", "Hello");
          this.pushParticipant("Nicolas Kacem", 47, "Pilote", "Au revoir");
          this.pushParticipant("Rémi Cruzel", 22, "Intellectuel", "Bye");
          this.pushParticipant("Steven Le Moine", 44, "Normand", "Non");
          this.pushParticipant("Axel Gasnot", 11, "Scribe", "Neuf");
          this.pushParticipant("Clement Bisson", 28, "Architecte", "Yolo");
          this.pushParticipant("Tiziano Ghisotti", 50, "Pizzaïollo", "Grazzie");
          this.pushParticipant("Maxime Vong", 21, "Dresseur de chauve-souris", "Yes");
            this.pushParticipant("Jean-Franck Tang", 42, "Professeur", "Bonjour");
          this.pushParticipant("Jean-Francky Tanguy", 24, "Enseignant", "Bonsoir");
          this.pushParticipant("Julien Dias", 27, "Chanteur", "Holà");
          this.pushParticipant("Cindy Mendes", 14, "Politicienne", "Hello");
          this.pushParticipant("Nicolas Kacem", 47, "Pilote", "Au revoir");
          this.pushParticipant("Rémi Cruzel", 22, "Intellectuel", "Bye");
          this.pushParticipant("Steven Le Moine", 44, "Normand", "Non");
          this.pushParticipant("Axel Gasnot", 11, "Scribe", "Neuf");
          this.pushParticipant("Clement Bisson", 28, "Architecte", "Yolo");
          this.pushParticipant("Tiziano Ghisotti", 50, "Pizzaïollo", "Grazzie");
          this.pushParticipant("Maxime Vong", 21, "Dresseur de chauve-souris", "Yes");

      }, error => console.error(error));
    }


    pushParticipant(name: string, age: number, job: string, description: string) {
        let participant = new Participant();
        participant.name = name;
        participant.age = age;
        participant.job = job;
        participant.description = description;
        this.participantList.push(participant);
  }

  actualParticipant(participant: Participant) {
    document.getElementById("selectParticipant").style.visibility = "visible";
    this.currentParticipant = participant;



  }

}

export class Participant {
    public name: string;
    public age: number;
    public job: string;
    public description: string;
}
