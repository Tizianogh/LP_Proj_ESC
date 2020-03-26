import { Component, OnInit } from '@angular/core';
import { Log } from '../Model/Log';
import { Location } from '@angular/common';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {
  private voteList: Log[] = [];
  private objectionList: Log[] = [];
  private notificationList: Log[] = [];

  private logList: Log[] = [];

  constructor(private location: Location) { }

  ngOnInit() {
    this.votePush("Rémi a voté pour Nicolas", "Je trouve que Nicolas est un bon candidat d'après son expérience", "08:24");
    this.votePush("Nicolas a voté pour Cindy", "Je trouve que Nicolas est un bon candidat d'après son expérience", "08:34");
    this.votePush("Julien a voté pour Cindy", "Je trouve que Nicolas est un bon candidat d'après son expérience", "09:11");
    this.votePush("Tiziano a voté pour Rémi",
      "Je trouve que Rémi est un bon candidat, afin donc de le faire élire, j'écris un argument extrêmement long et très très très recherché car Rémi est une personne inspirante. Il m'est donc aisé d'écrire beaucoup sur cette personne, et, nous pouvons également profiter de mon message pour observer le comportement de la fenêtre de logs lorsque que quelqu'un de très très inspiré écrit un argument vraiment long. Inutilement long.",
      "09:27");
    this.votePush("Steven a voté pour Steven", "Je trouve que Nicolas est un bon candidat d'après son expérience", "10:11");
    this.votePush("Cindy a voté pour Cindy", "Je trouve que Nicolas est un bon candidat d'après son expérience", "10:14");
    this.votePush("Jean-Franck a voté pour Nicolas", "Je trouve que Nicolas est un bon candidat d'après son expérience", "10:58");
    this.votePush("Maxime a voté pour Cindy", "Je trouve que Nicolas est un bon candidat d'après son expérience", "11:45");

    this.objectionPush("Rémi a émit une objection contre Cindy", "Non.", "08:24");
    this.objectionPush("Cindy a émit une objection contre Nicolas", "Pas assez intelligent", "08:34");
    this.objectionPush("Nicolas a émit une objection contre Cindy", "Si", "09:11");

    this.notificationPush("La session d'éléction est passée à la phase d'objection.", "", "07:24");
    this.notificationPush("La session d'éléction est passée à la phase de revote.", "", "08:24");
    this.notificationPush("Jean-Franck Tang a refusé le poste de Représentant du délégué.", "", "07:24");

  }

  ShowVotes() {
    this.logList = this.voteList;
      document.getElementById("VotesTab").style.cssText = "border-bottom: 5px solid #430640;";
      document.getElementById("ObjectionsTab").style.cssText = "border-bottom: 0px solid #430640;";
      document.getElementById("NotificationsTab").style.cssText = "border-bottom: 0px solid #430640;";
  }
  ShowObjections() {
    this.logList = this.objectionList;
      document.getElementById("ObjectionsTab").style.cssText = "border-bottom: 5px solid #430640;";
      document.getElementById("VotesTab").style.cssText = "border-bottom: 0px solid #430640;";
      document.getElementById("NotificationsTab").style.cssText = "border-bottom: 0px solid #430640;";
  }
  ShowNotifications() {
    this.logList = this.notificationList;
      document.getElementById("NotificationsTab").style.cssText = "border-bottom: 5px solid #430640;";
      document.getElementById("ObjectionsTab").style.cssText = "border-bottom: 0px solid #430640;";
      document.getElementById("VotesTab").style.cssText = "border-bottom: 0px solid #430640;";
  }

  votePush(title: string, opinion: string, hour: string) {
    let customLog = new Log();
    customLog.title = title;
    customLog.opinion = opinion;
    customLog.hour = hour;
    this.voteList.push(customLog);
  }

  objectionPush(title: string, opinion: string, hour: string) {
    let customLog = new Log();
    customLog.title = title;
    customLog.opinion = opinion;
    customLog.hour = hour;
    this.objectionList.push(customLog);
  }

  notificationPush(title: string, opinion: string, hour: string) {
    let customLog = new Log();
    customLog.title = title;
    customLog.opinion = opinion;
    customLog.hour = hour;
    this.notificationList.push(customLog);
  }

  browserReturn() {
    this.location.back();
  }
}
