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
import { CreateElectionComponent } from './create-election/create-election.component';
import { LogsComponent } from './logs/logs.component';
import { ElectionReminderComponent } from './election-reminder/election-reminder.component';
import { MyElectionsComponent } from './my-elections/my-elections.component';
import { ElectionComponent } from './election/election.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MyAccountComponent } from './my-account/my-account.component';
import { CelebrationComponent } from './celebration/celebration.component';
import { NextPhaseComponent } from './next-phase/next-phase.component';
import { ObjectionsComponent } from './objections/objections.component';
import { BonificationComponent } from './bonification/bonification.component';
import { JoinElectionLinkComponent } from './join-election-link/join-election-link.component';

registerLocaleData(localeFr, 'fr');

@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        CounterComponent,
        FetchDataComponent,
        CreateElectionComponent,
        LogsComponent,
        ElectionReminderComponent,
        MyElectionsComponent,
        ElectionComponent,
        MyAccountComponent,
        ObjectionsComponent,
        BonificationComponent,
        NextPhaseComponent,
        CelebrationComponent,
        JoinElectionLinkComponent

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
            { path: 'celebration/:id', component: CelebrationComponent },
            { path: 'create-election', component: CreateElectionComponent },
            { path: 'logs/:id', component: LogsComponent },
            { path: 'election-reminder/:id', component: ElectionReminderComponent },
            { path: 'my-elections', component: MyElectionsComponent },
            { path: 'home', component: HomeComponent },
            { path: 'election/:id', component: ElectionComponent },
            { path: 'my-account', component: MyAccountComponent },
            { path: 'join-election-link/:id', component: JoinElectionLinkComponent },
            { path: 'objections/:id', component: ObjectionsComponent },
            { path: 'bonification/:id', component: BonificationComponent },
            { path: 'next-phase', component: NextPhaseComponent }

        ])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
