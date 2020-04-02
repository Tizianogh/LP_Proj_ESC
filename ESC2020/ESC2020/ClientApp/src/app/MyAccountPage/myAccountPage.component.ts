import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../Model/Users';
import { AuthentificationService } from '../services/authentification.service';


@Component({
    selector: 'app-accountPage',
    templateUrl: './myAccountPage.component.html',
    styleUrls: ['./myAccountPage.component.css']
})
export class MyAccountPageComponent implements OnInit {
    private erreur = "";
    private listeUsers: Users[] = [];
    private connected: boolean;
    private connectedAccount: Users;
    private age: number;
    private isReadOnly: boolean = true;

    constructor(private authentificationService: AuthentificationService, private service: HttpClient) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

        this.service.get(window.location.origin + "/api/Authentification/" + this.connectedAccount['userId']).subscribe(update => {

            console.log(update);

            localStorage.clear();
            localStorage.setItem('connectedUser', JSON.stringify(update));
            this.authentificationService.setConnectedAccount(JSON.parse(localStorage.getItem('connectedUser')));

            let updateUser: Users = update as Users;
            this.service.put<Users>(window.location.origin + "/api/Users/" + this.connectedAccount['userId'], {
                'UserId': updateUser['userId'],
                'Email': updateUser['email'],
                'Password': updateUser['password'],
                'Salt': updateUser['salt'],
                'BirthDate': updateUser['birthDate'],
                'Description': (<HTMLInputElement>document.getElementById("description")).value,
                'Job': (<HTMLInputElement>document.getElementById("job")).value,
                'LastName': (<HTMLInputElement>document.getElementById("lastName")).value,
                'FirstName': (<HTMLInputElement>document.getElementById("firstName")).value,
                'Avatar': updateUser['avatar']
            })
        }, error => console.log(error));
        
    }

    scroll(el: HTMLElement) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }


    modifyProfile() {
        //si l'utilisateur a terminé la modification de ses informations
        if (!this.isReadOnly) {
            //verifier si les modifications sont valides
            if (!this.verifyProfile())//ne pas oublier de prévenir l'utilisateur par affichage que ce n'est pas valide
                return;
            //il faudra éventuellement rajouter des vérifications par exemple : une limite de chaine de caractères, pas de nombre dans le nom...

            //remplacement
            this.service.get(window.location.origin + "/api/Users/" + this.connectedAccount['userId']).subscribe(result => {
                let userResult: Users = result as Users;
                /*
                this.service.get(window.location.origin + "/api/Authentification/" + this.connectedAccount['userId']).subscribe(update => {
                    localStorage.clear();
                    localStorage.setItem('connectedUser', JSON.stringify(update));
                    this.authentificationService.setConnectedAccount(JSON.parse(localStorage.getItem('connectedUser')));

                    let updateUser: Users = update as Users;
                    this.service.put<Users>(window.location.origin + "/api/Users/" + this.connectedAccount['userId'], {
                        'UserId': updateUser['userId'],
                        'Email': updateUser['email'],
                        'Password': updateUser['password'],
                        'Salt': updateUser['salt'],
                        'BirthDate': updateUser['birthDate'],
                        'Description': (<HTMLInputElement>document.getElementById("description")).value,
                        'Job': (<HTMLInputElement>document.getElementById("job")).value,
                        'LastName': (<HTMLInputElement>document.getElementById("lastName")).value,
                        'FirstName': (<HTMLInputElement>document.getElementById("firstName")).value,
                        'Avatar': updateUser['avatar']
                    }).subscribe(result => {
                    }, error => console.log(error));
                }, error => console.log(error));*/

                //il faut pouvoir actualiser, peut-être l'objet user ?

                this.service.put<Users>(window.location.origin + "/api/Users/" + this.connectedAccount['userId'], {
                    'UserId': userResult['userId'],
                    'Email': userResult['email'],
                    'Password': userResult['password'],
                    'Salt': userResult['salt'],
                    'BirthDate': userResult['birthDate'],
                    'Description': (<HTMLInputElement>document.getElementById("description")).value,
                    'Job': (<HTMLInputElement>document.getElementById("job")).value,
                    'LastName': (<HTMLInputElement>document.getElementById("lastName")).value,
                    'FirstName': (<HTMLInputElement>document.getElementById("firstName")).value,
                    'Avatar': userResult['avatar']
                }).subscribe(result => {
                }, error => console.log(error));
            }, error => console.log(error));
        }
        //connectedAccount;
        //this.authentificationService.setConnectedAccount(JSON.parse(localStorage.getItem('connectedUser')));



        //console.log(JSON.parse(localStorage.getItem('connectedUser')));
        this.isReadOnly = !this.isReadOnly;
    }
    /*
        
        //this.service.get(window.location.origin + "/api/Users/" + this.connectedAccount['userId'] + "/" + this.session['electionId']).subscribe(result => {
          //  let participantResult: Participant = result as Participant;
            
            
            
            this.service.put<Participant>(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.session['electionId'], {
                'UserId': participantResult['userId'],
                'ElectionId': participantResult['electionId'],
                'HasTalked': false
            }).subscribe(result => {
            }, error => console.log(error));
        }, error => console.log(error));
    */
    /*
     * this.service.get(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.session['electionId']).subscribe(result => {
            let participantResult: Participant = result as Participant;
            this.service.put<Participant>(window.location.origin + "/api/Participants/" + this.connectedAccount['userId'] + "/" + this.session['electionId'], {
                'UserId': participantResult['userId'],
                'ElectionId': participantResult['electionId'],
                'HasTalked': false
            }).subscribe(result => {
            }, error => console.log(error));
        }, error => console.log(error));*/

    verifyProfile() {
        //vérifier que le nom, le prénom, le job et la description sont non-vides
        if ((<HTMLInputElement>document.getElementById("lastName")).value.trim() == "" || (<HTMLInputElement>document.getElementById("firstName")).value.trim() == ""
            || (<HTMLInputElement>document.getElementById("job")).value.trim() == "" || (<HTMLInputElement>document.getElementById("description")).value.trim() == "") {
            this.erreur = "*Tous les champs doivent être remplis";
            alert(this.erreur);
            return false;
        }
        return true;
    }
}