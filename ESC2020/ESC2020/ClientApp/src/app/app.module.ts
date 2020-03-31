import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { CreationSessionComponent } from './CreationSession/creationSession.component';
import { LogsComponent } from './logs/logs.component';
import { RappelSessionComponent } from './rappelSession/rappelSession.component';
import { MesSalonsComponent } from './MesSalons/mesSalons.component';
import { PageElectionComponent } from './Page-election/page-election.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MyAccountPageComponent } from './MyAccountPage/myAccountPage.component';
import { NextPhaseComponent } from './NextPhase/nextPhase.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    CreationSessionComponent,
    LogsComponent,
    RappelSessionComponent,
    MesSalonsComponent,
    PageElectionComponent,
    MyAccountPageComponent,
    NextPhaseComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([
        { path: '', component: HomeComponent, pathMatch: 'full' },
        { path: 'counter', component: CounterComponent },
        { path: 'fetch-data', component: FetchDataComponent },
        { path: 'creationSession', component: CreationSessionComponent },
        { path: 'logs/:id', component: LogsComponent },
        { path: 'rappel/:id', component: RappelSessionComponent },
        { path: 'mes-salons', component: MesSalonsComponent },
        { path: 'home', component: HomeComponent},
        { path: 'page-election/:id', component: PageElectionComponent },
        { path: 'myAccountPage', component: MyAccountPageComponent },
        { path: 'nextPhase', component: NextPhaseComponent}

    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
