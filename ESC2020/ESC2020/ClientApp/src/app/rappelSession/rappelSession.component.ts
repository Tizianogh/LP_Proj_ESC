import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rappel',
  templateUrl: './rappelSession.component.html',
  styleUrls: ['./rappelSession.component.css']
})
export class RappelSessionComponent implements OnInit {

  constructor(private service: HttpClient, private router: Router) { }
  poste: string;
  missions: string;
  responsabilite: string;
  dateD: string;
  dateF: string

  ngOnInit() {

    this.service.get(window.location.origin + "/api/Elections/" + this.router.url.split('/')[2]).subscribe(result => {
      console.log(result)
      this.poste = result['job'];
      this.missions = result['mission'];
      this.responsabilite = result['responsability'];
      this.dateD = result['startDate'];
      this.dateF = result['endDate'];
    }, error => console.error(error));
  }
}
