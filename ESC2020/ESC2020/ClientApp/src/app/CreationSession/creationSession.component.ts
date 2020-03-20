import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-creation',
  templateUrl: './creationSession.component.html',
  styleUrls: ['./creationSession.component.css'],
  providers: [DatePipe]
})

export class CreationSessionComponent implements OnInit {

  formulaireSession: FormGroup;
  id: number = 5;
  constructor(private formbuilder: FormBuilder, private service: HttpClient, private router: Router, private datePipe: DatePipe) { }
  erreur: string;
  
  ngOnInit() {
    this.initForm();
  }


  initForm() {
    this.formulaireSession = this.formbuilder.group({
      poste: '',
      missions: '',
      responsabilites: '',
      dateD: '',
      dateF: '',

    });

  }

  submit() {
    const form = this.formulaireSession.value
    console.log(window.location.origin)
    
    if (form['poste'].trim() == "" || form['missions'].trim() == "" || form['responsabilites'].trim() == "" || form['dateD'].trim() == "" || form['dateF'].trim() == "") {
      this.erreur = "*Tous les champs doivent être remplis";
    }
    else {
      if (this.verifDates(form['dateD'], form['dateF'])) {
        this.service.post(window.location.origin + "/api/Elections", {
          "Job": form['poste'],
          "Mission": form['missions'],
          "Responsability": form['responsabilites'],
          "StartDate": form['dateD'],
          "EndDate": form['dateF']
        }).subscribe(result => {
          console.log(result)
          console.log("ICI"+result['electionId']);
          this.id = result['electionId'];
          this.router.navigate(['rappel/' + this.id]);
        }, error => console.error(error));
      }
      else {
        this.erreur = "*Les dates sont incorrectes";
      }
    }
  }

  verifDates(date1: string, date2: string) {
    let res: boolean = true;
    let dateUne = new Date(date1);
    let dateDeux = new Date(date2);
    let myDate = new Date();
    this.datePipe.transform(myDate, 'yyyy-MM-dd');
    if (dateUne.getTime() > dateDeux.getTime() || dateUne.getTime() < myDate.getTime()) {
      res = true;
    }
    return res;
  }

}

class Session {
  constructor(public poste:string,public missions: string, public responsabilite:string, public dateD:string,public dateF:string) {}


}
