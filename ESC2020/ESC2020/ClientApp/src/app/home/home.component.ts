import { Component } from '@angular/core';
import { NavBarStateService } from '../services/NavBarState.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(private navBarStateService: NavBarStateService) {}

    ngOnInit() {
        this.navBarStateService.SetIsInElection(false);
    }

    //showFooter() {
    //  document.getElementById("apparait").style.cssText = "display : block;";
    //  document.getElementById("btnAnimation").style.cssText = "display : none;";
    //}

    //hideFooter() {
    //  document.getElementById("apparait").style.cssText = "display : none;";
    //  document.getElementById("btnAnimation").style.cssText = "display : block;";
    //}
}


