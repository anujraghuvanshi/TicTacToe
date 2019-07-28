import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedService {

    private userStatus = new BehaviorSubject(localStorage.getItem('user_email'));
    currentStatus = this.userStatus.asObservable();

    constructor() { }

    changeStatus(loggedInUserEmail: string) {
        this.userStatus.next(loggedInUserEmail);
    }


}
