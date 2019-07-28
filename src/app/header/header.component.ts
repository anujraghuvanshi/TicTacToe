import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { SharedService } from '../services/shared.service';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    constructor(private data: SharedService, private router: Router) {
        this.loggedInPlayer = localStorage.getItem('user_email');
    }

    loggedInPlayer = '';

    ngOnInit() {
        this.data.currentStatus.subscribe(loggedInUserEmail => this.loggedInPlayer = loggedInUserEmail)
    }

    logout() {
        localStorage.clear();
        this.data.changeStatus('');
        this.loggedInPlayer = '';
        this.router.navigateByUrl('/login');
    }

}
