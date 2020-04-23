import { Component, OnInit } from '@angular/core';
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
}


