import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Users } from '../Model/Users';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class NavBarStateService {
    private navState: BehaviorSubject<string>;

    private logsVisible: BehaviorSubject<boolean>;
    private objectionsVisible: BehaviorSubject<boolean>;

    private isInElection: BehaviorSubject<boolean>;


    constructor(private service: HttpClient, private router: Router) {
        this.logsVisible = new BehaviorSubject(false)
        this.objectionsVisible = new BehaviorSubject(false)

        this.isInElection = new BehaviorSubject(false)
        this.navState = new BehaviorSubject("default");
    }

    SetNavState(newState: string) {
        this.navState.next(newState);
        if (this.navState.value == "voteSent")
            this.SetLogsVisible(true);
            
        console.log(this.navState);
    }

    GetNavState() {
        return this.navState.asObservable();
    }

    SetLogsVisible(newState: boolean) {
        this.logsVisible.next(newState);
    }

    GetLogsVisible() {
        return this.logsVisible.asObservable();
    }

    SetObjectionsVisible(newState: boolean) {
        this.objectionsVisible.next(newState);
    }

    GetObjectionsVisible() {
        return this.objectionsVisible.asObservable();
    }

    GetIsInElection() {
        return this.isInElection.asObservable();
    }

    SetIsInElection(newState: boolean) {
        this.isInElection.next(newState);
    }
}