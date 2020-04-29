import { Component, OnInit } from '@angular/core';
import { NavBarStateService } from '../services/NavBarState.service';

import { TranslateService, TranslationChangeEvent, LangChangeEvent } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    constructor(private translate: TranslateService, private navBarStateService: NavBarStateService) {
        
    }

    ngOnInit() {
        this.translate.onTranslationChange.subscribe((params: TranslationChangeEvent) => {
            this.setupCarousel();
        });
        this.translate.onLangChange.subscribe((params: LangChangeEvent) => {
            this.setupCarousel();
        });
        this.navBarStateService.SetIsInElection(false);
        this.setupCarousel();
    }

    setupCarousel() {
        let lang = this.translate.currentLang;
        var slide1 = document.getElementById('slide1');
        var slide2 = document.getElementById('slide2');
        switch (lang) {
            case 'fr':
                slide1.setAttribute("src", "assets/img/Slide1.png");
                slide2.setAttribute("src", "assets/img/Slide2.png");
                break;
            case 'en':
                slide1.setAttribute("src", "assets/img/Slide1.en.png");
                slide2.setAttribute("src", "assets/img/Slide2.en.png");
                break;
            case 'es':
                slide1.setAttribute("src", "assets/img/Slide1.es.png");
                slide2.setAttribute("src", "assets/img/Slide2.es.png");
                break;
        }
    }
}


