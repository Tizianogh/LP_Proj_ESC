import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class NavBarStateService {
    private navState: BehaviorSubject<string>;
    private logsVisible: BehaviorSubject<boolean>;
    private isInElection: BehaviorSubject<boolean>;


    constructor() {
        this.logsVisible = new BehaviorSubject(false)
        this.isInElection = new BehaviorSubject(false)
        this.navState = new BehaviorSubject("default");
    }

    SetNavState(newState: string) {
        this.navState.next(newState);
        if (this.navState.value == "voteSent")
            this.SetLogsVisible(true);
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

    GetIsInElection() {
        return this.isInElection.asObservable();
    }

    SetIsInElection(newState: boolean) {
        this.isInElection.next(newState);
    }
}