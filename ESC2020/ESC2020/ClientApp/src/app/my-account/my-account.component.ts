import { Component, OnInit, ViewChild, SystemJsNgModuleLoader } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from '../Model/Users';
import { AuthentificationService } from '../services/authentification.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
    selector: 'app-accountPage',
    templateUrl: './my-account.component.html',
    styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent implements OnInit {
    private erreur = "";
    private listeUsers: Users[] = [];
    private connected: boolean;
    private connectedAccount: Users;
    private age: number;
    private isReadOnly: boolean = true;
    private image: any;

    constructor(private authentificationService: AuthentificationService, private service: HttpClient, private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);

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
            //console.log(this.connectedAccount.avatar);
            if (this.image != null) {
                this.image = this.decodeBase64(this.image);
            } else {
                this.image = this.connectedAccount.avatar;
            }
            //il faudra éventuellement rajouter des vérifications par exemple : une limite de chaine de caractères, pas de nombre dans le nom...
            //remplacement
            this.service.get(window.location.origin + "/api/Users/" + this.connectedAccount['userId']).subscribe(result => {
                let userResult: Users = result as Users;
                this.service.put<Users>(window.location.origin + "/api/Users/" + this.connectedAccount['userId'], {
                    'UserId': userResult['userId'],
                    'Email': userResult['email'],
                    'Password': userResult['password'],
                    'Salt': userResult['salt'],
                    'BirthDate': (<HTMLInputElement>document.getElementById("birthDate")).value,
                    'Description': (<HTMLInputElement>document.getElementById("description")).value,
                    'Job': (<HTMLInputElement>document.getElementById("job")).value,
                    'LastName': (<HTMLInputElement>document.getElementById("lastName")).value,
                    'FirstName': (<HTMLInputElement>document.getElementById("firstName")).value,
                    'Avatar': this.image
                }).subscribe(result => {
                    this.actualize();
                }, error => console.log(error));
            }, error => console.log(error));
        }
        this.isReadOnly = !this.isReadOnly;
    }

    changeListener($event): void {
        this.readThis($event.target);

    }

    //Supprime une partie inutile de la chaine de caractère de l'image
    decodeBase64(image: any) {
        if (image.includes("data:image/png;base64,")) {
            image = image.replace("data:image/png;base64,", "");
        } else if (image.includes("data:image/jpg;base64,")) {
            image = image.replace("data:image/jpg;base64,", "");
        } else if (image.includes("data:image/jpeg;base64,")) {
            image = image.replace("data:image/jpeg;base64,", "");
        }

        return image;
    }

    readThis(inputValue: any): void {
        var file: File = inputValue.files[0];
        var myReader: FileReader = new FileReader();

        myReader.onloadend = (e) => {
            this.image = myReader.result;
        }
        if (file != null) {
            myReader.readAsDataURL(file);
        }
    }

    //vérifier que le nom, le prénom, le job et la description sont non-vides
    verifyProfile() {
        if ((<HTMLInputElement>document.getElementById("lastName")).value.trim() == "" || (<HTMLInputElement>document.getElementById("firstName")).value.trim() == ""
            || (<HTMLInputElement>document.getElementById("job")).value.trim() == "" || (<HTMLInputElement>document.getElementById("description")).value.trim() == "") {
            this.erreur = "*Tous les champs doivent être remplis";
            alert(this.erreur);
            return false;
        }
        return true;
    }

    //Actualise l'affichage après la modification du profil
    actualize() {
        this.service.get(window.location.origin + "/api/Authentification/" + this.connectedAccount['userId']).subscribe(update => {
            localStorage.clear();
            localStorage.setItem('connectedUser', JSON.stringify(update));
            this.authentificationService.setConnectedAccount(JSON.parse(localStorage.getItem('connectedUser')));
        }, error => console.log(error));
    }
}