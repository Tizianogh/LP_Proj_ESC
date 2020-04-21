import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Participant } from '../Model/Participant';
import { Election } from '../Model/Election';
import { TypeOpinion } from '../Model/TypeOpinion';
import { Users } from '../Model/Users';
import { Phase } from '../Model/Phase';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { AuthentificationService } from '../services/authentification.service';
import { Opinion } from '../Model/Opinion';
import { NavBarStateService } from '../services/NavBarState.service';
import { DatePipe } from '@angular/common';
import { ElectionService } from '../services/election.service';
import * as signalR from "@microsoft/signalr";
import { Message } from '../Model/Message';
import { isUndefined } from 'util';
import { isDefined } from '@angular/compiler/src/util';


@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css']
})

export class ChatComponent implements OnInit {
    connected: boolean;
    connectedAccount: Users = new Users();
    messagesList: Message[] = [];
    election: Election = new Election();
    electionId: string;
    host: boolean = false;
    listeUsers: Users[];

    hubConnection = new signalR.HubConnectionBuilder()
        .withUrl("/data")
        .build();

    constructor(private electionService: ElectionService, private service: HttpClient, public datePipe: DatePipe, private router: Router, private authentificationService: AuthentificationService, private navBarStateService: NavBarStateService) {
        
            
    }

    ngOnInit() {

        this.authentificationService.getConnectedFeed().subscribe(aBoolean => this.connected = aBoolean);
        this.authentificationService.getConnectedAccountFeed().subscribe(anUser => this.connectedAccount = anUser);
        this.electionService.GetUserList().subscribe(users => this.listeUsers = users);
        this.electionService.GetElection().subscribe(anElection => this.setupElection(anElection));
        this.mainRequest();
        this.setOnSignalReceived();
        this.hubConnection.start().catch(err => console.log(err));
    }

    clearChat() {
        document.getElementById("chatList").childNodes.forEach(c => c.remove());
    }

    setOnSignalReceived() {
        this.hubConnection.on("changeParticipants", (electionId: number, phaseId: number) => {
            if (electionId == Number(this.election.Id)) {
                this.listeUsers = [];
                this.electionService.fetchElection(this.electionId);
                this.electionService.GetUserList().subscribe(users => this.listeUsers = users);
            }
        });

        this.hubConnection.on("newMessage", (electionId: number, message: any) => {
            if (electionId == Number(this.election.Id)) {
                var messageC: Message = {
                    authorId: message['userId'],
                    text: message['sentence'],
                    dateMessage: message['dateMessage']
                }
                let newMessageElement = document.createElement("li");
                newMessageElement.innerHTML = `<li class="left clearfix added">
                                <span class="chat-img pull-left">
                                </span>
                                <div class="chat-body clearfix">
                                    <div class="header">
                                        <strong class="chatText">${this.getAuthorById((Number)(messageC.authorId))}</strong>
                                        <small class="pull-right text-muted">
                                            <span class="glyphicon glyphicon-time"></span><span class="chatText" style="font-size:15px">${this.datePipe.transform(messageC.dateMessage, 'dd/MM/yyyy hh:mm')
            } </span>
                                        </small>
                                    </div>
                                    <p class="chatText" style="color:#777777">
                                        ${messageC.text}
                                    </p>
                                </div>
                            </li>`;
                newMessageElement.setAttribute("style", "font-size:15px;margin-left: 60px;");
                document.getElementById("chatList").appendChild(newMessageElement);
                (<HTMLInputElement>document.getElementById("btn-input")).value = "";
                if (!(document.getElementById("collapseOne").classList.contains("show"))) {
                    let notif = document.createElement("span");
                    notif.innerHTML = `<li><span id="notifs">Messages en attente</span></li>`;
                    notif.setAttribute("style", "font-size:16px;padding-top:1vh;");
                    document.getElementsByClassName("navbar-nav")[0].appendChild(notif);
                }
            }
        });
    }

    mainRequest() {
        this.checkHost();
    }

    addMessage(message: Message) {
        this.messagesList.push(message);
    }

    resetNotifs() {
        if (document.getElementById("notifs") != null) {
            document.getElementById("notifs").remove();
        }
        document.getElementById("scrollCont").scrollTop = document.getElementById("scrollCont").scrollHeight;
    }

    removeAdded() {
        console.log(document.getElementsByClassName("added"));
        for (let i in document.getElementsByClassName("added")) {
            console.log("removing " + document.getElementsByClassName("added")[i].nodeValue);
            console.log(document.getElementsByClassName("added")[i]);
            if ((document.getElementsByClassName("added")[i].nodeValue + "").includes("undefined")) {

            }
            else {
                console.log("enter remove");
                document.getElementsByClassName("added")[i].parentNode.removeChild(document.getElementsByClassName("added")[i]);
            }
        }
    }

    getMessages() {
        while (document.getElementsByClassName("added").length != 0) {
            this.removeAdded();
        }
        this.service.get(window.location.origin + "/api/Messages/election/" + this.election.Id).subscribe(result => {
            var tmpMessagesList: Message[] = result as Message[];
            this.messagesList = [];
            for (let i = 0; i < tmpMessagesList.length; i++) {
                this.addMessage({
                    authorId: tmpMessagesList[i]['userId'],
                    text: tmpMessagesList[i]['sentence'],
                    dateMessage: tmpMessagesList[i]['dateMessage']
                });
            }
        }, error => console.error(error));
    }

    getAuthorById(userId: number) {
        var firstName: string;
        var lastName: string;
        var userC = this.listeUsers.find(u => u['userId'] == userId);
        if (isUndefined(userC)) {
            return " ";
        }
        else {
            firstName = userC['firstName'];
            lastName = userC['lastName'];
            return firstName + " " + lastName;
        }
    }


    setupElection(anElection: Election) {
        this.election = anElection;
        this.election.Id = anElection['electionId'];
        this.electionId = anElection['electionId'];
        this.election.poste = anElection['job'];
        this.election.missions = anElection['mission'];
        this.election.responsabilite = anElection['responsability'];
        
        setTimeout(() => this.getMessages(), 500);
    }

    checkHost() {
        if (this.connectedAccount["userId"] == this.election['hostId']) {
            this.host = true;
        }
        else {
            this.host = false;
        }
    }

    sendMessage() {
        var content: string;
        content = (<HTMLInputElement>document.getElementById("btn-input")).value;
        var message = {
            'UserId': this.connectedAccount["userId"],
            'Sentence': content,
            'DateMessage': new Date,
            'ElectionId': this.election['electionId']
        }
        this.service.post(window.location.origin + "/api/Messages", message).subscribe(result => {
            this.hubConnection.send("newMessage", (Number)(this.election.Id), message);
        }, error => console.log(error));
    }


}
