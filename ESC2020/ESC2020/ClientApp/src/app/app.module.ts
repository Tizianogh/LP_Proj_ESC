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
import { RevoteComponent } from './revote/revote.component';
import { ElectionVoteComponent } from './election-vote/election-vote.component';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { MyAccountComponent } from './my-account/my-account.component';
import { CelebrationComponent } from './celebration/celebration.component';
import { NextPhaseComponent } from './next-phase/next-phase.component';
import { ObjectionsComponent } from './objections/objections.component';
import { BonificationComponent } from './bonification/bonification.component';
import { JoinElectionLinkComponent } from './join-election-link/join-election-link.component';
import { ElectionMasterPageComponent } from './election-master-page/election-master-page.component';
import { ChatComponent } from './chat/chat.component';
import { DatePipe } from '@angular/common';

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
        ElectionVoteComponent,
        MyAccountComponent,
        ObjectionsComponent,
        BonificationComponent,
        NextPhaseComponent,
        JoinElectionLinkComponent,
        ElectionMasterPageComponent,
        CelebrationComponent,
        RevoteComponent,
        ChatComponent
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
            { path: 'create-election', component: CreateElectionComponent },
            { path: 'logs/:id', component: LogsComponent },
            { path: 'election-reminder/:id', component: ElectionReminderComponent },
            { path: 'my-elections', component: MyElectionsComponent },
            { path: 'home', component: HomeComponent },
            { path: 'election-vote/:id', component: ElectionVoteComponent },
            { path: 'my-account', component: MyAccountComponent },
            { path: 'join-election-link/:id', component: JoinElectionLinkComponent },
            { path: 'celebration/:id', component: CelebrationComponent },
            { path: 'objections/:id', component: ObjectionsComponent },
            { path: 'bonification/:id', component: BonificationComponent },
            { path: 'next-phase', component: NextPhaseComponent },
            { path: 'election/:id', component: ElectionMasterPageComponent },
            { path: 'revote/:id', component: RevoteComponent },
            { path: 'chat/:id', component: ChatComponent },
        ])
    ],

    providers: [DatePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }
