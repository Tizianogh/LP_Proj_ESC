import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Session } from '../Model/Session';
import { Users } from '../Model/Users';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { partition } from 'rxjs';
import { async } from '@angular/core/testing';

@Component({
    selector: 'app-salons',
    templateUrl: './mesSalons.component.html',
    styleUrls: ['./mesSalons.component.css']
})

export class MesSalonsComponent implements OnInit {

    private connected: boolean;
    private connectedAccount: Users;
    private listeSessions: Session[] = [];
    private listeParticipants: Participant[] = [];

    constructor(private authentificationService: AuthentificationService, private service: HttpClient, private router: Router) { }


    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.getElections()
    }

    getElections() {
        this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId']).subscribe(result => {
            this.listeParticipants = result as Participant[];
            for (let i in this.listeParticipants) {
                this.service.get(window.location.origin + "/api/Elections/" + this.listeParticipants[i]["electionId"]).subscribe(result => {
                    this.listeSessions.push(result as Session);
                }, error => console.error(error));
            }
        }, error => console.error(error));
    }

    MesSalons() {
        document.getElementById("ongletMesSalons").style.cssText = "border-bottom: 5px solid #430640;";
        document.getElementById("ongletSalonsCrees").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletSalonsTermines").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletAjouterSalon").style.cssText = "border-bottom: 0px solid #430640;";
    }

    SalonsCrees() {
        document.getElementById("ongletMesSalons").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletSalonsCrees").style.cssText = "border-bottom: 5px solid #430640;";
        document.getElementById("ongletSalonsTermines").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletAjouterSalon").style.cssText = "border-bottom: 0px solid #430640;";
    }

    SalonsTermines() {
        document.getElementById("ongletMesSalons").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletSalonsCrees").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletSalonsTermines").style.cssText = "border-bottom: 5px solid #430640;";
        document.getElementById("ongletAjouterSalon").style.cssText = "border-bottom: 0px solid #430640;";
    }

    ajouterSalon() {
        document.getElementById("ongletMesSalons").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletSalonsCrees").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletSalonsTermines").style.cssText = "border-bottom: 0px solid #430640;";
        document.getElementById("ongletAjouterSalon").style.cssText = "border-bottom: 5px solid #430640;";
    }

    rajouterSalon(codeInput: string) {
        this.service.get(window.location.origin + "/api/Elections/code/" + codeInput).subscribe(result => {
            console.log(result);
            this.listeSessions.push(result as Session);
            this.service.post(window.location.origin + "/api/Participants", { 'UserId': this.connectedAccount['userId'], 'ElectionId': result['electionId'] }).subscribe(result => {
                console.log(result);
            }, error => console.log(error));
        }, error => console.error(error));
    }

    Navigate(id: number) {
        this.router.navigate(['page-election/' + id]);
    }
}