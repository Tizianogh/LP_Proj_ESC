import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Session } from '../Model/Session';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { Log } from '../Model/Log';
import { Opinion } from '../Model/Opinion';



@Component({
    selector: 'app-election',
    templateUrl: './objections.component.html',
    styleUrls: ['./objections.component.css']
})

export class ObjectionsComponent implements OnInit {

    private electionId: string;
    currentUser: Users = new Users();
    session: Session = new Session();
    //currentParticipant: Participant;
    scrollingItems: number[] = [];
    actualClickedId: number = 1;
    participantsList: Participant[] = [];
    opinionsList: Opinion[] = [];
    propositions: Proposition[] = [];
    private usersList: Users[] = [];
    actualProposed: Users = null;

    constructor(private service: HttpClient, private router: Router) { }

    ngOnInit() {

        //Récupérer l'id de l'élection actuelle à partir de l'url
        let regexp: RegExp = /\d/;
        this.electionId = regexp.exec(this.router.url)[0];
        this.service.get(window.location.origin + "/api/Elections/" + this.electionId).subscribe(result => {
            this.session = result as Session;

            //récupérer la liste des participants en fonction de l'id d'une élection
            this.service.get(window.location.origin + "/api/Participants/election/" + this.session['electionId']).subscribe(participantResult => {
                this.participantsList = participantResult as Participant[];
                console.log(window.location.origin + "/api/Users/election/" + this.session['electionId']);
                this.service.get(window.location.origin + "/api/Users/election/" + this.session['electionId']).subscribe(userResult => {

                    console.log(this.usersList);
                    this.usersList = userResult as Users[];
                    //Recuperer toutes les opinions de cette election et comptabilisation des votes
                    this.service.get(window.location.origin + "/api/Opinions/election/" + this.electionId).subscribe(result => {
                        this.opinionsList = result as Opinion[];
                        for (let i in this.usersList) {
                            this.propositions.push(new Proposition(this.usersList[i]['userId'], 0));
                            for (let j in this.opinionsList) {
                                if (this.opinionsList[j].TypeId == 1) {
                                    if (this.opinionsList[j].ConcernedId == this.usersList[i].UserId) {
                                        this.propositions[i].VoteCounter++;
                                    }
                                }
                            }
                        }

                        //deroulement
                        this.sortPropositions();
                        console.log(this.propositions);
                        for (let i in this.usersList) {
                            console.log(this.usersList[i]['userId']);
                            if (this.usersList[i]['userId'] == this.propositions[0].UserId) {
                                this.actualProposed = this.usersList[i];
                            }
                        }
                        console.log(this.actualProposed);
                    });

                }, error => console.error(error));
                

            }, error => console.error(error));
        }, error => console.error(error));

    }

    //    // GET: api/Opinions/election/5
    //    [HttpGet]
    //    [Route("election/{idElec}")]
    //    public async Task<ActionResult<IEnumerable<Opinion>>> GetOpinionsFromElection(int idElec)
    //{
    //    var opinion = await _context.Opinions.Where(o => (o.ElectionId == idElec)).ToListAsync();

    //    if (opinion == null) {
    //        return NotFound();
    //    }

    //    return opinion;
    //}


    sortPropositions() {

        let tmp: Proposition[] = [];
        let copy = this.propositions.copyWithin(0, this.propositions.length);
        while(copy.length>0){
            let cpt = 0
            for(let i=0;i<copy.length;i++){
                if(copy[cpt].VoteCounter<copy[i].VoteCounter)
                    cpt=i;
            }
         tmp.push(copy[cpt]);
         copy.splice(cpt,1);
        }

    this.propositions = tmp;
    }

    actualParticipant(user: Users) {
        document.getElementById("selectParticipant").style.visibility = "visible";
        this.currentUser = user;
        console.log(this.currentUser);
    }


}

class Proposition {

    constructor(
        public UserId: number,
        public VoteCounter: number
    ) { }
}